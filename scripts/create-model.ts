import fs from 'fs'
import path from 'path'
import { z } from 'zod'

const modelSchema = z.object({
  name: z.string().min(1, 'Model name is required'),
  fields: z.string().min(1, 'Fields are required'),
})

const templates = {
  schema: (name: string, fields: string) => `import { z } from 'zod'

export const ${name}Schema = z.object({
  ${fields}
})

export type ${name} = z.infer<typeof ${name}Schema>`,

  actions: (name: string) => `import { prisma } from '@/lib/prisma'
import { ${name}Schema, type ${name} } from './schema'

export async function list() {
  return await prisma.${name.toLowerCase()}.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getById(id: string) {
  return await prisma.${name.toLowerCase()}.findUnique({
    where: { id },
  })
}

export async function create(data: Omit<${name}, 'id' | 'createdAt' | 'updatedAt'>) {
  const validated = ${name}Schema.parse(data)

  return await prisma.${name.toLowerCase()}.create({
    data: validated,
  })
}

export async function update(id: string, data: Partial<${name}>) {
  const validated = ${name}Schema.partial().parse(data)

  return await prisma.${name.toLowerCase()}.update({
    where: { id },
    data: validated,
  })
}

export async function remove(id: string) {
  return await prisma.${name.toLowerCase()}.delete({
    where: { id },
  })
}`,

  components: (name: string) => `'use client'

import { type ${name} } from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

interface ${name}FormProps {
  defaultValues?: Partial<${name}>
  onSubmit: (data: FormData) => Promise<void>
}

export function ${name}Form({ defaultValues, onSubmit }: ${name}FormProps) {
  const form = useForm({
    defaultValues,
  })

  return (
    <Form {...form}>
      <form action={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}`,

  routes: (name: string) => `import { type Column } from '@/resources/config'
import { type ${name} } from './schema'
import { Edit, Trash } from 'lucide-react'

export const columns: Column<${name}>[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    sortable: true,
    searchable: true,
  },
  {
    key: 'published',
    label: 'Status',
    type: 'badge',
    sortable: true,
    color: {
      true: 'success',
      false: 'secondary',
    },
    valueLabel: {
      true: 'Published',
      false: 'Draft',
    },
  },
  {
    key: 'actions',
    label: '',
    type: 'actions',
    actions: [
      {
        icon: Edit,
        label: 'Edit',
        onClick: (row) => {
          window.location.href = \`/dashboard/${name.toLowerCase()}/\${row.id}\`
        },
      },
      {
        icon: Trash,
        label: 'Delete',
        onClick: async (row) => {
          if (!confirm('Are you sure?')) return
          await fetch(\`/api/${name.toLowerCase()}/\${row.id}\`, {
            method: 'DELETE',
          })
          window.location.reload()
        },
      },
    ],
  },
]`,

  index: (name: string) => `import * as actions from './actions'
import * as components from './components'
import * as routes from './routes'
import { ${name}Schema } from './schema'

export const ${name.toLowerCase()} = {
  actions,
  components,
  routes,
  schema: ${name}Schema,
  list: {
    columns: routes.columns,
  },
  form: {
    sections: [
      {
        title: 'General',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
            placeholder: 'Enter title',
          },
          {
            name: 'content',
            type: 'editor',
            label: 'Content',
            placeholder: 'Enter content',
          },
          {
            name: 'published',
            type: 'switch',
            label: 'Published',
          },
        ],
      },
    ],
  },
}`,
}

function createDirectoryIfNotExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function createModel() {
  const args = process.argv.slice(2)
  const modelData: Record<string, string> = {}

  // Parse command line arguments
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    if (key.startsWith('--')) {
      modelData[key.slice(2)] = value
    }
  })

  try {
    // Validate model data
    const validatedData = modelSchema.parse(modelData)
    const { name, fields } = validatedData

    // Create resource directory
    const resourceDir = path.join(process.cwd(), 'src', 'resources', name.toLowerCase())
    createDirectoryIfNotExists(resourceDir)

    // Create resource files
    fs.writeFileSync(
      path.join(resourceDir, 'schema.ts'),
      templates.schema(name, fields)
    )

    fs.writeFileSync(
      path.join(resourceDir, 'actions.ts'),
      templates.actions(name)
    )

    fs.writeFileSync(
      path.join(resourceDir, 'components.tsx'),
      templates.components(name)
    )

    fs.writeFileSync(
      path.join(resourceDir, 'routes.ts'),
      templates.routes(name)
    )

    fs.writeFileSync(
      path.join(resourceDir, 'index.ts'),
      templates.index(name)
    )

    console.log('Resource created successfully:')
    console.log(`Files created in src/resources/${name.toLowerCase()}/`)
    console.log('\nFiles created:')
    console.log(`- schema.ts`)
    console.log(`- actions.ts`)
    console.log(`- components.tsx`)
    console.log(`- routes.ts`)
    console.log(`- index.ts`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    } else {
      console.error('Error creating model:', error)
    }
    process.exit(1)
  }
}

createModel() 