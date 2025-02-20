#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'
import { templates } from './templates'
import { type Field, type ModelConfig } from './types'

const execAsync = promisify(exec)

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

function validate(value: any, type: string): { isValid: boolean; error?: string } {
  try {
    switch (type) {
      case 'Int':
        if (!Number.isInteger(Number(value))) {
          return { isValid: false, error: 'Must be an integer' }
        }
        break
      case 'Float':
        if (isNaN(Number(value))) {
          return { isValid: false, error: 'Must be a number' }
        }
        break
      case 'Boolean':
        if (!['true', 'false'].includes(String(value).toLowerCase())) {
          return { isValid: false, error: 'Must be true or false' }
        }
        break
      case 'DateTime':
        if (isNaN(Date.parse(value))) {
          return { isValid: false, error: 'Must be a valid date' }
        }
        break
    }
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid value for type' }
  }
}

async function getModelConfig(): Promise<ModelConfig> {
  console.log(chalk.cyan('\n🚀 Welcome to the Model Speed Creator!\n'))

  const { modelName } = await prompts({
    type: 'text',
    name: 'modelName',
    message: 'What is the name of your model?',
    validate: value => {
      if (!value) return 'Model name is required'
      if (!/^[A-Z][a-zA-Z]*$/.test(value)) {
        return 'Model name must start with uppercase and contain only letters'
      }
      return true
    }
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
    validate: value => {
      if (!value || value < 1) return 'Must create at least one field'
      if (value > 20) return 'Maximum 20 fields allowed'
      return true
    }
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
    while (adding && fields.length < 20) {
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
    validate: (value: string): string | boolean => {
      if (!value) return 'Field name is required'
      if (!/^[a-z][a-zA-Z]*$/.test(value)) {
        return 'Field name must start with lowercase and contain only letters'
      }
      return true
    }
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
        validate: (value: string): string | boolean => {
          if (!value) return 'Related model is required'
          if (!/^[A-Z][a-zA-Z]*$/.test(value)) {
            return 'Model name must start with uppercase and contain only letters'
          }
          return true
        }
      },
      {
        type: 'text',
        name: 'relationField',
        message: 'Field name in related model:',
        validate: (value: string): string | boolean => {
          if (!value) return 'Field name is required'
          if (!/^[a-z][a-zA-Z]*$/.test(value)) {
            return 'Field name must start with lowercase and contain only letters'
          }
          return true
        }
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
      message: 'Default value:',
      validate: (value: string): string | boolean | Promise<string | boolean> => {
        const validation = validate(value, type)
        return validation.isValid || validation.error || false
      }
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

function createDirectoryIfNotExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function generateZodSchema(fields: Field[]): string {
  return fields.map(field => {
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
    }

    if (!field.isRequired) {
      zodType += '.optional()'
    }

    if (field.hasDefault) {
      zodType += `.default(${field.defaultValue})`
    }

    return `  ${field.name}: ${zodType}`
  }).join(',\n')
}

async function createModel() {
  try {
    // Get model config through prompts
    const config = await getModelConfig()
    const zodSchema = generateZodSchema(config.fields)

    // Create resource directory
    const resourceDir = path.join(process.cwd(), 'src', 'resources', config.name.toLowerCase())
    createDirectoryIfNotExists(resourceDir)

    // Create page directories
    const pageDir = path.join(process.cwd(), 'src', 'app', 'dashboard', `${config.name.toLowerCase()}s`)
    createDirectoryIfNotExists(pageDir)
    createDirectoryIfNotExists(path.join(pageDir, 'new'))
    createDirectoryIfNotExists(path.join(pageDir, `[${config.name.toLowerCase()}Id]`))

    // Create resource files
    const files = [
      { name: 'schema.ts', content: templates.schema(config.name, zodSchema) },
      { name: 'actions.ts', content: templates.actions(config.name) },
      { name: 'components.tsx', content: templates.components(config.name, config.fields) },
      { name: 'routes.tsx', content: templates.routes(config.name, config.fields) },
      { name: 'index.ts', content: templates.index(config.name, config.fields) },
    ]

    // Create page files
    const pageFiles = [
      { path: path.join(pageDir, 'page.tsx'), content: templates.page(config.name) },
      { path: path.join(pageDir, 'new', 'page.tsx'), content: templates.newPage(config.name) },
      { path: path.join(pageDir, `[${config.name.toLowerCase()}Id]`, 'page.tsx'), content: templates.editPage(config.name) },
    ]

    // Write resource files
    files.forEach(({ name: fileName, content }) => {
      const filePath = path.join(resourceDir, fileName)
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
      } else {
        console.warn(chalk.yellow(`Warning: File ${fileName} already exists, skipping...`))
      }
    })

    // Write page files
    pageFiles.forEach(({ path: filePath, content }) => {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
      } else {
        console.warn(chalk.yellow(`Warning: File ${filePath} already exists, skipping...`))
      }
    })

    console.log(chalk.green('\n✨ Model created successfully!'))
    console.log(chalk.cyan('\nNext steps:'))
    console.log('1. Review the generated files')
    console.log('2. Push your model to the database:')
    console.log(chalk.dim('   pnpm prisma db push'))
    console.log('3. Customize the generated components as needed')

  } catch (error) {
    console.error(chalk.red('Error:'), error)
    process.exit(1)
  }
}

createModel() 