#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { z } from 'zod'
import prompts from 'prompts'
import { templates } from './templates'
import { type Field } from './types'

interface VerificationResult {
  hasErrors: boolean
  errors: {
    file: string
    issues: string[]
    fix?: () => void
  }[]
}

async function verifyModel(modelName: string): Promise<VerificationResult> {
  const result: VerificationResult = {
    hasErrors: false,
    errors: []
  }

  const resourceDir = path.join(process.cwd(), 'src', 'resources', modelName.toLowerCase())
  const pageDir = path.join(process.cwd(), 'src', 'app', 'dashboard', `${modelName.toLowerCase()}s`)

  let schemaContent = ''

  // 1. Verify schema.ts
  try {
    const schemaPath = path.join(resourceDir, 'schema.ts')
    schemaContent = fs.readFileSync(schemaPath, 'utf-8')
    
    if (!schemaContent.includes('id: z.string().optional()') ||
        !schemaContent.includes('createdAt: z.date().optional()') ||
        !schemaContent.includes('updatedAt: z.date().optional()')) {
      result.hasErrors = true
      result.errors.push({
        file: 'schema.ts',
        issues: ['Missing standard fields (id, createdAt, updatedAt)'],
        fix: () => {
          const updatedSchema = schemaContent.replace(
            'export const',
            'export const ${modelName}Schema = z.object({\n  id: z.string().optional(),\n  createdAt: z.date().optional(),\n  updatedAt: z.date().optional(),\n'
          )
          fs.writeFileSync(schemaPath, updatedSchema)
        }
      })
    }
  } catch (error) {
    result.hasErrors = true
    result.errors.push({
      file: 'schema.ts',
      issues: ['File not found or cannot be read']
    })
    return result
  }

  // 2. Verify components.tsx
  try {
    const componentsPath = path.join(resourceDir, 'components.tsx')
    const componentsContent = fs.readFileSync(componentsPath, 'utf-8')
    
    const issues: string[] = []
    if (!componentsContent.includes('value={field.value || \'\'}')) {
      issues.push('Missing controlled input handling')
    }
    if (!componentsContent.includes('handleSubmit = async (values:')) {
      issues.push('Incorrect form submission handling')
    }
    if (!componentsContent.includes('defaultValues: {')) {
      issues.push('Missing default values')
    }

    if (issues.length > 0) {
      result.hasErrors = true
      result.errors.push({
        file: 'components.tsx',
        issues,
        fix: () => {
          // Re-generate components with correct templates
          const fields = extractFieldsFromSchema(schemaContent)
          const newContent = templates.components(modelName, fields)
          fs.writeFileSync(componentsPath, newContent)
        }
      })
    }
  } catch (error) {
    result.hasErrors = true
    result.errors.push({
      file: 'components.tsx',
      issues: ['File not found or cannot be read']
    })
  }

  // 3. Verify actions.ts
  try {
    const actionsPath = path.join(resourceDir, 'actions.ts')
    const actionsContent = fs.readFileSync(actionsPath, 'utf-8')
    
    const issues: string[] = []
    if (!actionsContent.includes('try {')) {
      issues.push('Missing error handling')
    }
    if (!actionsContent.includes('revalidatePath')) {
      issues.push('Missing path revalidation')
    }
    if (actionsContent.includes('prisma.') && !actionsContent.includes('db.')) {
      issues.push('Using incorrect database client')
    }

    if (issues.length > 0) {
      result.hasErrors = true
      result.errors.push({
        file: 'actions.ts',
        issues,
        fix: () => {
          const newContent = templates.actions(modelName)
          fs.writeFileSync(actionsPath, newContent)
        }
      })
    }
  } catch (error) {
    result.hasErrors = true
    result.errors.push({
      file: 'actions.ts',
      issues: ['File not found or cannot be read']
    })
  }

  // 4. Verify page files
  const pageFiles = [
    { name: 'page.tsx', template: templates.page },
    { name: 'new/page.tsx', template: templates.newPage },
    { name: `[${modelName.toLowerCase()}Id]/page.tsx`, template: templates.editPage }
  ]

  pageFiles.forEach(({ name, template }) => {
    try {
      const pagePath = path.join(pageDir, name)
      const pageContent = fs.readFileSync(pagePath, 'utf-8')
      
      const issues: string[] = []
      if (!pageContent.includes('getServerSession')) {
        issues.push('Missing authentication')
      }
      if (!pageContent.includes('action={')) {
        issues.push('Missing action prop in DashboardShell')
      }

      if (issues.length > 0) {
        result.hasErrors = true
        result.errors.push({
          file: `pages/${name}`,
          issues,
          fix: () => {
            const newContent = template(modelName)
            fs.writeFileSync(pagePath, newContent)
          }
        })
      }
    } catch (error) {
      result.hasErrors = true
      result.errors.push({
        file: `pages/${name}`,
        issues: ['File not found or cannot be read']
      })
    }
  })

  return result
}

function extractFieldsFromSchema(schemaContent: string): Field[] {
  const fields: Field[] = []
  const fieldRegex = /(\w+):\s*z\.(string|number|boolean|date|enum)\(\)/g
  let match

  while ((match = fieldRegex.exec(schemaContent)) !== null) {
    const [, name, type] = match
    if (!['id', 'createdAt', 'updatedAt'].includes(name)) {
      fields.push({
        name,
        type: type === 'number' ? 'Float' : type === 'boolean' ? 'Boolean' : 'String',
        isRequired: !schemaContent.includes(`${name}?.`),
        isUnique: schemaContent.includes(`${name}.*@unique`),
        hasDefault: schemaContent.includes(`${name}.*@default`),
        isRelation: false
      })
    }
  }

  return fields
}

async function main() {
  const args = process.argv.slice(2)
  const modelName = args[0]

  if (!modelName) {
    console.error(chalk.red('Error: Model name is required'))
    console.log(chalk.yellow('\nUsage:'))
    console.log('pnpm verify-model ModelName')
    process.exit(1)
  }

  console.log(chalk.cyan(`\n🔍 Verifying ${modelName} model...\n`))
  
  const result = await verifyModel(modelName)
  
  if (result.hasErrors) {
    console.log(chalk.yellow('Issues found:'))
    result.errors.forEach(({ file, issues }) => {
      console.log(chalk.dim(`\n${file}:`))
      issues.forEach(issue => console.log(chalk.red(`- ${issue}`)))
    })

    const { fix } = await prompts({
      type: 'confirm',
      name: 'fix',
      message: 'Would you like to automatically fix these issues?',
      initial: true
    })

    if (fix) {
      console.log(chalk.cyan('\nFixing issues...'))
      result.errors.forEach(error => error.fix?.())
      console.log(chalk.green('\n✅ Issues fixed successfully!'))
    }
  } else {
    console.log(chalk.green('✅ All checks passed!'))
  }
}

main() 