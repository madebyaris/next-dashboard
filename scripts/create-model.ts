#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import chalk from 'chalk'
import { templates } from './templates'
import { type Field } from './types'

const modelSchema = z.object({
  name: z.string().min(1, 'Model name is required'),
  fields: z.string().min(1, 'Fields are required'),
})

function createDirectoryIfNotExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function parseFields(fields: string): Field[] {
  // Convert Zod schema string to Field array
  const lines = fields.split('\n')
  return lines.map(line => {
    const [name, type] = line.split(':').map(s => s.trim())
    const isRequired = !type.includes('optional')
    const isUnique = type.includes('unique')
    const hasDefault = type.includes('default')
    
    let fieldType = 'String'
    if (type.includes('number')) fieldType = 'number'
    if (type.includes('boolean')) fieldType = 'Boolean'
    if (type.includes('date')) fieldType = 'DateTime'
    
    return {
      name,
      type: fieldType,
      isRequired,
      isUnique,
      hasDefault,
      isRelation: false,
    }
  })
}

function createModel() {
  try {
    const args = process.argv.slice(2)
    const modelData: Record<string, string> = {}

    // Parse command line arguments
    args.forEach(arg => {
      const [key, value] = arg.split('=')
      if (key.startsWith('--')) {
        modelData[key.slice(2)] = value
      }
    })

    // Validate model data
    const validatedData = modelSchema.parse(modelData)
    const { name, fields } = validatedData
    const parsedFields = parseFields(fields)

    // Create resource directory
    const resourceDir = path.join(process.cwd(), 'src', 'resources', name.toLowerCase())
    createDirectoryIfNotExists(resourceDir)

    // Create page directories
    const pageDir = path.join(process.cwd(), 'src', 'app', 'dashboard', `${name.toLowerCase()}s`)
    createDirectoryIfNotExists(pageDir)
    createDirectoryIfNotExists(path.join(pageDir, 'new'))
    createDirectoryIfNotExists(path.join(pageDir, `[${name.toLowerCase()}Id]`))

    // Create resource files
    const files = [
      { name: 'schema.ts', content: templates.schema(name, fields) },
      { name: 'actions.ts', content: templates.actions(name) },
      { name: 'components.tsx', content: templates.components(name, parsedFields) },
      { name: 'routes.tsx', content: templates.routes(name, parsedFields) },
      { name: 'index.ts', content: templates.index(name, parsedFields) },
    ]

    // Create page files
    const pageFiles = [
      { path: path.join(pageDir, 'page.tsx'), content: templates.page(name) },
      { path: path.join(pageDir, 'new', 'page.tsx'), content: templates.newPage(name) },
      { path: path.join(pageDir, `[${name.toLowerCase()}Id]`, 'page.tsx'), content: templates.editPage(name) },
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

    console.log(chalk.green('\nResource created successfully:'))
    console.log(`Files created in ${chalk.cyan(`src/resources/${name.toLowerCase()}/`)}`)
    console.log('\nFiles created:')
    files.forEach(({ name: fileName }) => {
      console.log(chalk.dim(`- ${fileName}`))
    })
    pageFiles.forEach(({ path: filePath }) => {
      console.log(chalk.dim(`- ${filePath}`))
    })

    console.log(chalk.cyan('\nNext steps:'))
    console.log('1. Update the schema fields in schema.ts')
    console.log('2. Customize the form fields in index.ts')
    console.log('3. Add the columns configuration in routes.tsx')
    console.log('4. Run pnpm prisma generate to update types')

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(chalk.red('Validation error:'), error.errors)
    } else {
      console.error(chalk.red('Error creating model:'), error)
    }
    process.exit(1)
  }
}

createModel() 