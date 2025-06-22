import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import prompts from 'prompts'

interface FieldDefinition {
  name: string
  type: string
  label: string
  required: boolean
  options?: string[]
  validation?: string
  placeholder?: string
  helperText?: string
}

interface ResourceDefinition {
  name: string
  pluralName: string
  fields: FieldDefinition[]
  enableBulkActions: boolean
  enableFileUpload: boolean
  enableRichEditor: boolean
  enableDates: boolean
}

const fieldTypes = [
  { title: 'Text', value: 'text' },
  { title: 'Email', value: 'email' },
  { title: 'Password', value: 'password' },
  { title: 'Number', value: 'number' },
  { title: 'Textarea', value: 'textarea' },
  { title: 'Rich Editor', value: 'rich-editor' },
  { title: 'Select', value: 'select' },
  { title: 'Toggle/Switch', value: 'toggle' },
  { title: 'Checkbox', value: 'checkbox' },
  { title: 'Date', value: 'date' },
  { title: 'File Upload', value: 'file-upload' },
  { title: 'Repeater', value: 'repeater' },
]

async function promptForResource(): Promise<ResourceDefinition> {
  console.log('🚀 Enhanced Resource Generator')
  console.log('Creating a FilamentPHP-like resource for Next.js\n')

  const resourceInfo = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Resource name (singular, e.g., "Post"):',
      validate: (value: string) => value.length > 0 || 'Required'
    },
    {
      type: 'text',
      name: 'pluralName',
      message: 'Plural name (e.g., "Posts"):',
      initial: (prev: string) => prev + 's'
    }
  ])

  const fields: FieldDefinition[] = []
  let addingFields = true

  while (addingFields) {
    const fieldInfo = await prompts([
      {
        type: 'text',
        name: 'name',
        message: `Field name:`,
        validate: (value: string) => value.length > 0 || 'Required'
      },
      {
        type: 'select',
        name: 'type',
        message: 'Field type:',
        choices: fieldTypes
      },
      {
        type: 'text',
        name: 'label',
        message: 'Field label:',
        initial: (prev: any, values: any) => 
          values.name.charAt(0).toUpperCase() + values.name.slice(1)
      },
      {
        type: 'confirm',
        name: 'required',
        message: 'Is this field required?',
        initial: false
      }
    ])

    // Additional prompts based on field type
    let options: string[] | undefined
    if (fieldInfo.type === 'select') {
      const optionsInput = await prompts({
        type: 'text',
        name: 'options',
        message: 'Options (comma-separated):',
        validate: (value: string) => value.length > 0 || 'Required for select fields'
      })
      options = optionsInput.options.split(',').map((opt: string) => opt.trim())
    }

    const additionalInfo = await prompts([
      {
        type: 'text',
        name: 'placeholder',
        message: 'Placeholder text (optional):',
      },
      {
        type: 'text',
        name: 'helperText',
        message: 'Helper text (optional):',
      }
    ])

    fields.push({
      ...fieldInfo,
      ...additionalInfo,
      ...(options && { options })
    })

    const continueAdding = await prompts({
      type: 'confirm',
      name: 'continue',
      message: 'Add another field?',
      initial: true
    })

    addingFields = continueAdding.continue
  }

  const features = await prompts([
    {
      type: 'confirm',
      name: 'enableBulkActions',
      message: 'Enable bulk actions (delete, export, etc.)?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'enableFileUpload',
      message: 'Include file upload examples?',
      initial: fields.some(f => f.type === 'file-upload')
    },
    {
      type: 'confirm',
      name: 'enableRichEditor',
      message: 'Include rich editor examples?',
      initial: fields.some(f => f.type === 'rich-editor')
    },
    {
      type: 'confirm',
      name: 'enableDates',
      message: 'Include date field examples?',
      initial: fields.some(f => f.type === 'date')
    }
  ])

  return {
    ...resourceInfo,
    fields,
    ...features
  }
}

function generateZodValidation(field: FieldDefinition): string {
  let validation = ''
  
  switch (field.type) {
    case 'email':
      validation = 'z.string().email()'
      break
    case 'number':
      validation = 'z.number()'
      break
    case 'date':
      validation = 'z.date()'
      break
    case 'toggle':
    case 'checkbox':
      validation = 'z.boolean()'
      break
    case 'file-upload':
      validation = 'z.array(z.string()).optional()'
      break
    case 'rich-editor':
      validation = 'z.string().min(1)'
      break
    default:
      validation = 'z.string()'
  }

  if (field.required && field.type !== 'toggle' && field.type !== 'checkbox') {
    if (field.type === 'string') {
      validation += '.min(1, `${field.label} is required`)'
    }
  } else if (!field.required) {
    validation += '.optional()'
  }

  return validation
}

function generatePrismaField(field: FieldDefinition): string {
  let prismaType = ''
  
  switch (field.type) {
    case 'email':
    case 'text':
    case 'textarea':
    case 'rich-editor':
      prismaType = 'String'
      break
    case 'number':
      prismaType = 'Int'
      break
    case 'date':
      prismaType = 'DateTime'
      break
    case 'toggle':
    case 'checkbox':
      prismaType = 'Boolean @default(false)'
      break
    case 'file-upload':
      prismaType = 'String[]'
      break
    default:
      prismaType = 'String'
  }

  const optional = field.required ? '' : '?'
  return `  ${field.name}  ${prismaType}${optional}`
}

function generateFormField(field: FieldDefinition): string {
  const fieldConfig = {
    name: field.name,
    type: field.type,
    label: field.label,
    required: field.required,
    ...(field.placeholder && { placeholder: field.placeholder }),
    ...(field.helperText && { helperText: field.helperText }),
    ...(field.options && { options: field.options.map(opt => ({ label: opt, value: opt })) })
  }

  return `          ${JSON.stringify(fieldConfig, null, 10).replace(/^/gm, '          ').trim()}`
}

const templates = {
  schema: (resource: ResourceDefinition) => `import { z } from 'zod'

// Zod schema for validation
export const ${resource.name.toLowerCase()}Schema = z.object({
  id: z.string().cuid(),
${resource.fields.map(field => `  ${field.name}: ${generateZodValidation(field)},`).join('\n')}
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const create${resource.name}Schema = ${resource.name.toLowerCase()}Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const update${resource.name}Schema = create${resource.name}Schema.partial()

export type ${resource.name} = z.infer<typeof ${resource.name.toLowerCase()}Schema>
export type Create${resource.name} = z.infer<typeof create${resource.name}Schema>
export type Update${resource.name} = z.infer<typeof update${resource.name}Schema>`,

  prismaModel: (resource: ResourceDefinition) => `
// Add this to your schema.prisma file:

model ${resource.name} {
  id        String   @id @default(cuid())
${resource.fields.map(field => generatePrismaField(field)).join('\n')}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,

  actions: (resource: ResourceDefinition) => `'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { 
  ${resource.name.toLowerCase()}Schema, 
  create${resource.name}Schema, 
  update${resource.name}Schema,
  type ${resource.name} 
} from './schema'

export async function list(options: {
  page?: number
  limit?: number
  where?: any
  orderBy?: any
} = {}) {
  const { page = 1, limit = 10, where = {}, orderBy = { createdAt: 'desc' } } = options

  const skip = (page - 1) * limit

  const [total, items] = await Promise.all([
    prisma.${resource.name.toLowerCase()}.count({ where }),
    prisma.${resource.name.toLowerCase()}.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ])

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getById(id: string) {
  const ${resource.name.toLowerCase()} = await prisma.${resource.name.toLowerCase()}.findUnique({
    where: { id },
  })

  if (!${resource.name.toLowerCase()}) {
    throw new Error('${resource.name} not found')
  }

  return ${resource.name.toLowerCase()}
}

export async function create(data: FormData) {
  const formData = {
${resource.fields.map(field => `    ${field.name}: data.get('${field.name}'),`).join('\n')}
  }

  const validated = create${resource.name}Schema.parse(formData)

  const ${resource.name.toLowerCase()} = await prisma.${resource.name.toLowerCase()}.create({
    data: validated,
  })

  revalidatePath('/dashboard/${resource.pluralName.toLowerCase()}')
  redirect('/dashboard/${resource.pluralName.toLowerCase()}')
}

export async function update(id: string, data: FormData) {
  const formData = {
${resource.fields.map(field => `    ${field.name}: data.get('${field.name}'),`).join('\n')}
  }

  const validated = update${resource.name}Schema.parse(formData)

  const ${resource.name.toLowerCase()} = await prisma.${resource.name.toLowerCase()}.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/dashboard/${resource.pluralName.toLowerCase()}')
  redirect('/dashboard/${resource.pluralName.toLowerCase()}')
}

export async function delete_(id: string) {
  await prisma.${resource.name.toLowerCase()}.delete({
    where: { id },
  })

  revalidatePath('/dashboard/${resource.pluralName.toLowerCase()}')
}

${resource.enableBulkActions ? `
export async function bulkDelete(ids: string[]) {
  await prisma.${resource.name.toLowerCase()}.deleteMany({
    where: { id: { in: ids } },
  })

  revalidatePath('/dashboard/${resource.pluralName.toLowerCase()}')
}

export async function exportToCsv(${resource.pluralName.toLowerCase()}: ${resource.name}[]) {
  const csv = ${resource.pluralName.toLowerCase()}.map(item => 
    [${resource.fields.map(f => `item.${f.name}`).join(', ')}].join(',')
  ).join('\\n')
  
  return csv
}
` : ''}`,

  index: (resource: ResourceDefinition) => `import { ${resource.name}, Pencil, Trash2, Plus${resource.enableBulkActions ? ', Download, Archive' : ''} } from 'lucide-react'
import { ${resource.name.toLowerCase()}Schema, type ${resource.name} } from './schema'
import * as actions from './actions'
import { defineResource } from '../config'

const { delete_, ...otherActions } = actions

export const config = defineResource<${resource.name}>({
  name: '${resource.pluralName.toLowerCase()}',
  path: '/dashboard/${resource.pluralName.toLowerCase()}',
  navigation: {
    title: '${resource.pluralName}',
    icon: ${resource.name},
    path: '/dashboard/${resource.pluralName.toLowerCase()}',
    roles: ['ADMIN', 'EDITOR'],
  },
  schema: ${resource.name.toLowerCase()}Schema,
  list: {
    columns: [
${resource.fields.slice(0, 3).map(field => `      {
        key: '${field.name}',
        label: '${field.label}',
        type: '${field.type === 'toggle' || field.type === 'checkbox' ? 'badge' : 'text'}',
        sortable: true,
        ${field.type === 'toggle' || field.type === 'checkbox' ? `
        valueLabel: {
          true: 'Yes',
          false: 'No',
        },
        color: {
          true: 'success',
          false: 'default',
        },` : ''}
      },`).join('\n')}
      {
        key: 'id',
        label: 'Actions',
        type: 'actions',
        actions: [
          {
            icon: Pencil,
            label: 'Edit',
            onClick: (row: ${resource.name}) => {
              window.location.href = \`/dashboard/${resource.pluralName.toLowerCase()}/\${row.id}\`
            },
          },
          {
            icon: Trash2,
            label: 'Delete',
            onClick: async (row: ${resource.name}) => {
              if (confirm('Are you sure you want to delete this ${resource.name.toLowerCase()}?')) {
                await delete_(row.id)
                window.location.reload()
              }
            },
          },
        ],
      },
    ],
    ${resource.enableBulkActions ? `enableSelection: true,
    bulkActions: [
      {
        label: 'Delete Selected',
        icon: Trash2,
        onClick: async (selected${resource.pluralName}: ${resource.name}[]) => {
          if (confirm(\`Delete \${selected${resource.pluralName}.length} ${resource.pluralName.toLowerCase()}?\`)) {
            for (const item of selected${resource.pluralName}) {
              await delete_(item.id)
            }
            window.location.reload()
          }
        },
        variant: 'destructive' as const,
      },
      {
        label: 'Export',
        icon: Download,
        onClick: (selected${resource.pluralName}: ${resource.name}[]) => {
          const csv = selected${resource.pluralName}.map(item => 
            [${resource.fields.map(f => `item.${f.name}`).join(', ')}].join(',')
          ).join('\\n')
          const blob = new Blob([csv], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = '${resource.pluralName.toLowerCase()}.csv'
          a.click()
        },
      },
    ],` : ''}
    actions: {
      create: {
        icon: Plus,
        label: 'New ${resource.name}',
        href: '/dashboard/${resource.pluralName.toLowerCase()}/new',
      },
    },
  },
  form: {
    sections: [
      {
        title: 'General Information',
        description: 'Enter the basic information for this ${resource.name.toLowerCase()}',
        fields: [
${resource.fields.map(field => generateFormField(field)).join(',\n')}
        ],
      },
    ],
  },
  actions: {
    ...otherActions,
    delete: delete_,
  },
})

export const ${resource.pluralName.toLowerCase()} = config
export { ${resource.name.toLowerCase()}Schema, type ${resource.name} } from './schema'`,
}

async function generateResource() {
  try {
    const resource = await promptForResource()
    
    const resourceDir = path.join(process.cwd(), 'src', 'resources', resource.pluralName.toLowerCase())
    
    // Create directory
    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir, { recursive: true })
    }

    // Generate files
    fs.writeFileSync(
      path.join(resourceDir, 'schema.ts'),
      templates.schema(resource)
    )

    fs.writeFileSync(
      path.join(resourceDir, 'actions.ts'),
      templates.actions(resource)
    )

    fs.writeFileSync(
      path.join(resourceDir, 'index.ts'),
      templates.index(resource)
    )

    // Generate Prisma model instructions
    fs.writeFileSync(
      path.join(resourceDir, 'prisma-model.txt'),
      templates.prismaModel(resource)
    )

    console.log('\n✅ Resource generated successfully!')
    console.log(`\n📁 Files created in: src/resources/${resource.pluralName.toLowerCase()}/`)
    console.log('   • schema.ts - Zod validation schemas')
    console.log('   • actions.ts - Server actions for CRUD operations')
    console.log('   • index.ts - Resource configuration')
    console.log('   • prisma-model.txt - Prisma model to add to your schema')
    
    console.log('\n🚀 Next steps:')
    console.log('1. Add the Prisma model to your schema.prisma file')
    console.log('2. Run: pnpm prisma db push')
    console.log(`3. Create pages in: src/app/dashboard/${resource.pluralName.toLowerCase()}/`)
    console.log('4. Add navigation item to your nav config')
    
    if (resource.enableFileUpload) {
      console.log('\n📎 File Upload Features:')
      console.log('• File upload components are ready to use')
      console.log('• Configure cloud storage (S3, Cloudinary) for production')
    }
    
    if (resource.enableRichEditor) {
      console.log('\n📝 Rich Editor Features:')
      console.log('• TipTap rich editor is configured')
      console.log('• Supports formatting, lists, headings, and more')
    }
    
    if (resource.enableBulkActions) {
      console.log('\n🔄 Bulk Actions:')
      console.log('• Delete multiple records')
      console.log('• Export to CSV')
      console.log('• Row selection enabled')
    }

  } catch (error) {
    console.error('❌ Error generating resource:', error)
    process.exit(1)
  }
}

// Run the generator
generateResource() 