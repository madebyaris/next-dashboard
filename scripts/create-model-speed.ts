#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import prompts from 'prompts'
import chalk from 'chalk'
import { format } from 'prettier'

const execAsync = promisify(exec)

interface Field {
  name: string
  type: string
  isRequired: boolean
  isUnique: boolean
  hasDefault: boolean
  defaultValue?: string
  isRelation: boolean
  relationModel?: string
  relationField?: string
  relationOnDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT'
}

interface ModelConfig {
  name: string
  fields: Field[]
  createDashboard: boolean
}

const FIELD_TYPES = [
  'String',
  'Int',
  'Float',
  'Boolean',
  'DateTime',
  'Json',
  'BigInt',
  'Decimal',
  'Relation',
] as const

async function getModelConfig(): Promise<ModelConfig> {
  console.log(chalk.cyan('\n🚀 Welcome to the Model Speed Creator!\n'))

  const { modelName } = await prompts({
    type: 'text',
    name: 'modelName',
    message: 'What is the name of your model?',
    validate: value => value.length > 0 || 'Model name is required'
  })

  const { createDashboard } = await prompts({
    type: 'confirm',
    name: 'createDashboard',
    message: 'Would you like to create a dashboard page for this model?',
    initial: true
  })

  const { fieldCount } = await prompts({
    type: 'number',
    name: 'fieldCount',
    message: 'How many fields would you like to create?',
    validate: value => value > 0 || 'Must create at least one field'
  })

  const fields: Field[] = []

  for (let i = 0; i < fieldCount; i++) {
    console.log(chalk.yellow(`\n📝 Field ${i + 1}/${fieldCount}`))
    
    const field = await promptField()
    fields.push(field)
  }

  const { addMore } = await prompts({
    type: 'confirm',
    name: 'addMore',
    message: 'Would you like to add more fields?',
    initial: false
  })

  if (addMore) {
    let adding = true
    while (adding) {
      console.log(chalk.yellow(`\n📝 Additional Field`))
      const field = await promptField()
      fields.push(field)

      const { continue: shouldContinue } = await prompts({
        type: 'confirm',
        name: 'continue',
        message: 'Add another field?',
        initial: false
      })
      adding = shouldContinue
    }
  }

  return {
    name: modelName,
    fields,
    createDashboard
  }
}

async function promptField(): Promise<Field> {
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Field name:',
    validate: value => value.length > 0 || 'Field name is required'
  })

  const { type } = await prompts({
    type: 'select',
    name: 'type',
    message: 'Field type:',
    choices: FIELD_TYPES.map(type => ({ title: type, value: type }))
  })

  const isRelation = type === 'Relation'
  let relationModel, relationField, relationOnDelete

  if (isRelation) {
    const relationPrompts = await prompts([
      {
        type: 'text',
        name: 'relationModel',
        message: 'Related model name:',
        validate: value => value.length > 0 || 'Related model is required'
      },
      {
        type: 'text',
        name: 'relationField',
        message: 'Field name in related model:',
        validate: value => value.length > 0 || 'Field name is required'
      },
      {
        type: 'select',
        name: 'relationOnDelete',
        message: 'On delete behavior:',
        choices: [
          { title: 'CASCADE', value: 'CASCADE' },
          { title: 'SET NULL', value: 'SET_NULL' },
          { title: 'RESTRICT', value: 'RESTRICT' }
        ]
      }
    ])
    relationModel = relationPrompts.relationModel
    relationField = relationPrompts.relationField
    relationOnDelete = relationPrompts.relationOnDelete
  }

  const { isRequired } = await prompts({
    type: 'confirm',
    name: 'isRequired',
    message: 'Is this field required?',
    initial: true
  })

  const { isUnique } = await prompts({
    type: 'confirm',
    name: 'isUnique',
    message: 'Should this field be unique?',
    initial: false
  })

  const { hasDefault } = await prompts({
    type: 'confirm',
    name: 'hasDefault',
    message: 'Does this field have a default value?',
    initial: false
  })

  let defaultValue
  if (hasDefault) {
    const { value } = await prompts({
      type: 'text',
      name: 'value',
      message: 'Default value:'
    })
    defaultValue = value
  }

  return {
    name,
    type,
    isRequired,
    isUnique,
    hasDefault,
    defaultValue,
    isRelation,
    relationModel,
    relationField,
    relationOnDelete,
  }
}

function generatePrismaSchema(config: ModelConfig): string {
  const modelName = config.name
  const fields = config.fields.map(field => {
    if (field.isRelation) {
      return [
        `  ${field.name}Id    String${field.isRequired ? '' : '?'}`,
        `  ${field.name}      ${field.relationModel}    @relation(fields: [${field.name}Id], references: [id]${field.relationOnDelete ? `, onDelete: ${field.relationOnDelete}` : ''})`
      ].join('\n')
    }

    const type = field.type
    const modifiers = [
      field.isRequired ? '' : '?',
      field.isUnique ? ' @unique' : '',
      field.hasDefault ? ` @default(${field.defaultValue})` : ''
    ].join('')

    return `  ${field.name}    ${type}${modifiers}`
  })

  return `model ${modelName} {
  id          String    @id @default(cuid())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
${fields.join('\n')}
}`
}

function generateZodSchema(config: ModelConfig): string {
  const fields = config.fields.map(field => {
    if (field.isRelation) {
      return `  ${field.name}Id: z.string()`
    }

    let zodType = 'z.string()'
    switch (field.type) {
      case 'Int':
        zodType = 'z.number().int()'
        break
      case 'Float':
        zodType = 'z.number()'
        break
      case 'Boolean':
        zodType = 'z.boolean()'
        break
      case 'DateTime':
        zodType = 'z.date()'
        break
      case 'Json':
        zodType = 'z.any()'
        break
      case 'BigInt':
        zodType = 'z.bigint()'
        break
      case 'Decimal':
        zodType = 'z.number()'
        break
    }

    if (!field.isRequired) {
      zodType += '.optional()'
    }

    return `  ${field.name}: ${zodType}`
  })

  return `${fields.join(',\n')}`
}

async function updatePrismaSchema(schema: string) {
  const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma')
  const currentSchema = fs.readFileSync(schemaPath, 'utf-8')
  
  // Add new model before the last model
  const updatedSchema = currentSchema + '\n' + schema

  // Format with prettier
  const formattedSchema = await format(updatedSchema, {
    parser: 'prisma',
    semi: false,
    singleQuote: true,
  })

  fs.writeFileSync(schemaPath, formattedSchema)
}

async function createModel() {
  try {
    const config = await getModelConfig()

    // Preview
    console.log(chalk.cyan('\n📋 Preview:\n'))
    
    console.log(chalk.yellow('Prisma Schema:'))
    const prismaSchema = generatePrismaSchema(config)
    console.log(prismaSchema)
    
    console.log(chalk.yellow('\nZod Schema Fields:'))
    const zodSchema = generateZodSchema(config)
    console.log(zodSchema)

    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: 'Does this look correct? Would you like to proceed?',
      initial: true
    })

    if (!confirm) {
      console.log(chalk.red('❌ Operation cancelled'))
      return
    }

    // Update Prisma schema
    await updatePrismaSchema(prismaSchema)
    console.log(chalk.green('✅ Updated Prisma schema'))

    // Create resource
    const zodFields = generateZodSchema(config)
    await execAsync(`pnpm tsx scripts/create-model.ts --name=${config.name} --fields="${zodFields}"`)
    console.log(chalk.green('✅ Created resource files'))

    // Create dashboard pages if requested
    if (config.createDashboard) {
      await execAsync(
        `pnpm tsx scripts/create-page.ts --name=${config.name} --route=${config.name.toLowerCase()}s --title="${config.name}s" --description="Manage your ${config.name.toLowerCase()}s"`
      )
      console.log(chalk.green('✅ Created dashboard pages'))
    }

    // Run Prisma generate
    await execAsync('pnpm prisma generate')
    console.log(chalk.green('✅ Generated Prisma client'))

    console.log(chalk.cyan('\n🎉 All done! Next steps:'))
    console.log('1. Review the generated files')
    console.log('2. Push your model to the database:')
    console.log(chalk.dim('   pnpm tsx scripts/push-model.ts'))
    console.log('3. Customize the generated components as needed')

  } catch (error) {
    console.error(chalk.red('Error:'), error)
    process.exit(1)
  }
}

createModel() 