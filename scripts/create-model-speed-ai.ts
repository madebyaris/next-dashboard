#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { templates } from './templates'
import { type Field, type ModelConfig } from './types'

const execAsync = promisify(exec)

function parseModelDescription(description: string): ModelConfig {
  // Extract model name
  const nameMatch = description.match(/Create a (\w+) model with:/i)
  const name = nameMatch ? nameMatch[1] : ''

  // Extract fields
  const fields: Field[] = []
  const fieldPattern = /- (\w+) \((.*?)\)/g
  let match

  while ((match = fieldPattern.exec(description)) !== null) {
    const [, fieldName, fieldSpec] = match
    const specs = fieldSpec.toLowerCase().split(',').map(s => s.trim())

    const field: Field = {
      name: fieldName,
      type: 'String',
      isRequired: specs.includes('required'),
      isUnique: specs.includes('unique'),
      hasDefault: specs.some(s => s.startsWith('default:')),
      isRelation: specs.some(s => s.includes('relation')),
    }

    // Handle field type
    if (specs.includes('int')) field.type = 'Int'
    if (specs.includes('float')) field.type = 'Float'
    if (specs.includes('boolean')) field.type = 'Boolean'
    if (specs.includes('datetime')) field.type = 'DateTime'
    if (specs.includes('json')) field.type = 'Json'
    if (specs.includes('decimal')) field.type = 'Decimal'
    if (specs.includes('bigint')) field.type = 'BigInt'

    // Handle enums
    const enumMatch = specs.find(s => s.includes('enum:'))
    if (enumMatch) {
      field.type = 'Enum'
      field.enumValues = enumMatch
        .split(':')[1]
        .split('/')
        .map(v => v.trim())
    }

    // Handle relations
    if (field.isRelation) {
      const relationMatch = specs.find(s => s.includes('relation'))?.match(/relation to (\w+)/)
      if (relationMatch) {
        field.relationModel = relationMatch[1]
        field.relationField = fieldName.toLowerCase() + 's'
        field.relationOnDelete = specs.includes('cascade') ? 'CASCADE' : 
                               specs.includes('null') ? 'SET_NULL' : 'RESTRICT'
      }
    }

    // Handle default values
    const defaultMatch = specs.find(s => s.startsWith('default:'))
    if (defaultMatch) {
      field.defaultValue = defaultMatch.split(':')[1].trim()
    }

    fields.push(field)
  }

  return {
    name,
    fields,
    createDashboard: true
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
      case 'Decimal':
        zodType = 'z.number()'
        break
      case 'BigInt':
        zodType = 'z.bigint()'
        break
      case 'Enum':
        if (field.enumValues) {
          zodType = `z.enum([${field.enumValues.map((v: string) => `'${v}'`).join(', ')}])`
        }
        break
    }

    if (field.type === 'Int' || field.type === 'Float') {
      if (field.name === 'year') {
        zodType = `z.number().int().min(1900, 'Year must be after 1900')`
      } else if (field.name.includes('price') || field.name.includes('amount')) {
        zodType = `z.number().min(0, '${field.name} must be positive')`
      }
    }

    if (field.isRequired) {
      if (field.type === 'String') {
        zodType = `z.string().min(1, '${field.name} is required')`
      }
    }

    if (field.hasDefault && field.defaultValue) {
      zodType += `.default(${field.defaultValue})`
    }

    return `  ${field.name}: ${zodType}`
  }).join(',\n')
}

async function createModel() {
  try {
    // Get description from command line arguments
    const description = process.argv.slice(2).join(' ')
    if (!description) {
      console.error(chalk.red('Error: Model description is required'))
      console.log(chalk.yellow('\nUsage:'))
      console.log('pnpm create-model-speed-ai "Create a Product model with: - name (string, required)"')
      process.exit(1)
    }

    // Parse the model description
    console.log(chalk.cyan('\n📝 Step 1/5: Parsing model description...'))
    const config = parseModelDescription(description)
    
    if (!config.name) {
      console.error(chalk.red('Error: Could not determine model name from description'))
      process.exit(1)
    }
    console.log(chalk.dim(`• Model name: ${config.name}`))
    console.log(chalk.dim(`• Fields detected: ${config.fields.length}`))

    console.log(chalk.cyan('\n🔧 Step 2/5: Generating schema...'))
    const zodSchema = generateZodSchema(config.fields)
    console.log(chalk.dim('• Schema generated with validations'))

    // Create directories
    console.log(chalk.cyan('\n📁 Step 3/5: Creating directories...'))
    const resourceDir = path.join(process.cwd(), 'src', 'resources', config.name.toLowerCase())
    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir, { recursive: true })
      console.log(chalk.dim(`• Created resource directory: ${config.name.toLowerCase()}`))
    }

    const pageDir = path.join(process.cwd(), 'src', 'app', 'dashboard', `${config.name.toLowerCase()}s`)
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true })
      fs.mkdirSync(path.join(pageDir, 'new'), { recursive: true })
      fs.mkdirSync(path.join(pageDir, `[${config.name.toLowerCase()}Id]`), { recursive: true })
      console.log(chalk.dim(`• Created page directories: ${config.name.toLowerCase()}s/*`))
    }

    // Create files
    console.log(chalk.cyan('\n📄 Step 4/5: Creating files...'))
    
    // Create resource files
    console.log(chalk.dim('\nResource files:'))
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

    // Create resource files
    console.log(chalk.dim('\nResource files:'))
    for (const { name: fileName, content } of files) {
      const filePath = path.join(resourceDir, fileName)
      fs.writeFileSync(filePath, content)
      console.log(chalk.dim(`• Created ${fileName}`))
    }

    // Create page files
    console.log(chalk.dim('\nPage files:'))
    for (const { path: filePath, content } of pageFiles) {
      fs.writeFileSync(filePath, content)
      const fileName = filePath.split('/').pop()
      console.log(chalk.dim(`• Created ${fileName}`))
    }

    console.log(chalk.green('\n✨ Model created successfully!'))

    // Run verification
    console.log(chalk.cyan('\n🔍 Step 5/5: Running verification...'))
    try {
      const verifyPromise = execAsync(`pnpm verify-model ${config.name}`)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Verification timed out after 10 seconds')), 10000)
      })

      const { stdout } = await Promise.race([verifyPromise, timeoutPromise]) as { stdout: string }
      
      if (stdout.includes('All checks passed')) {
        console.log(chalk.green('\n✅ Verification completed successfully!'))
      } else {
        console.log(chalk.yellow('\n⚠️ Verification completed with warnings:'))
        console.log(chalk.dim(stdout))
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('timed out')) {
        console.log(chalk.yellow('\n⚠️ Verification step timed out, but files were created successfully.'))
      } else {
        console.error(chalk.yellow('\n⚠️ Verification found issues that need attention:'))
        if (error instanceof Error) {
          console.error(chalk.dim(error.message))
        } else {
          console.error(chalk.dim('Unknown error occurred during verification'))
        }
      }
    }

    console.log(chalk.cyan('\n📋 Next steps:'))
    console.log('1. Review the generated files in:')
    console.log(chalk.dim(`   src/resources/${config.name.toLowerCase()}/`))
    console.log(chalk.dim(`   src/app/dashboard/${config.name.toLowerCase()}s/`))
    console.log('2. Push your model to the database:')
    console.log(chalk.dim('   pnpm prisma db push'))
    console.log('3. Customize the generated components as needed')
    console.log('\n')

    // Exit successfully
    process.exit(0)

  } catch (error) {
    console.error(chalk.red('Error:'), error)
    process.exit(1)
  }
}

createModel() 