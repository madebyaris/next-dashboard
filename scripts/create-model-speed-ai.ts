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
  const lines = description.split('\n')
  
  lines.forEach(line => {
    const fieldMatch = line.match(/- (\w+) \((.*?)\)/)
    if (!fieldMatch) return

    const [, fieldName, fieldSpec] = fieldMatch
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
    if (specs.includes('number') || specs.includes('float')) field.type = 'Float'
    if (specs.includes('int') || specs.includes('integer')) field.type = 'Int'
    if (specs.includes('boolean') || specs.includes('bool')) field.type = 'Boolean'
    if (specs.includes('datetime') || specs.includes('date')) field.type = 'DateTime'
    if (specs.includes('json')) field.type = 'Json'
    if (specs.includes('decimal')) field.type = 'Decimal'
    if (specs.includes('bigint')) field.type = 'BigInt'

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
  })

  return {
    name,
    fields,
    createDashboard: true
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
    // Get description from command line arguments
    const description = process.argv.slice(2).join(' ')
    if (!description) {
      console.error(chalk.red('Error: Model description is required'))
      console.log(chalk.yellow('\nUsage:'))
      console.log('pnpm create-model-speed-ai "Create a Product model with: - name (string, required)"')
      process.exit(1)
    }

    // Parse the model description
    console.log(chalk.yellow('\nParsing model description...'))
    const config = parseModelDescription(description)
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

    // Run verification
    console.log(chalk.cyan('\n🔍 Running model verification...'))
    await execAsync(`pnpm verify-model ${config.name}`)

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