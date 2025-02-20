import { Field } from './types'

export const templates = {
  schema: (name: string, fields: string) => `import { z } from 'zod'

export const ${name}Schema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
${fields}
})

export type ${name} = z.infer<typeof ${name}Schema>`,

  actions: (name: string) => `'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type ${name} } from './schema'

export async function list() {
  try {
    const items = await db.${name.toLowerCase()}.findMany()
    return items
  } catch (error) {
    console.error('Error fetching ${name.toLowerCase()}s:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.${name.toLowerCase()}.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching ${name.toLowerCase()}:', error)
    return null
  }
}

export async function create(data: ${name}) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data
    await db.${name.toLowerCase()}.create({
      data: rest,
    })
    revalidatePath('/dashboard/${name.toLowerCase()}s')
  } catch (error) {
    console.error('Error creating ${name.toLowerCase()}:', error)
    throw error
  }
}

export async function update(id: string, data: ${name}) {
  try {
    const { createdAt, updatedAt, ...rest } = data
    await db.${name.toLowerCase()}.update({
      where: { id },
      data: rest,
    })
    revalidatePath('/dashboard/${name.toLowerCase()}s')
  } catch (error) {
    console.error('Error updating ${name.toLowerCase()}:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.${name.toLowerCase()}.delete({
      where: { id },
    })
    revalidatePath('/dashboard/${name.toLowerCase()}s')
  } catch (error) {
    console.error('Error deleting ${name.toLowerCase()}:', error)
    throw error
  }
}`,

  components: (name: string, fields: Field[]) => {
    const formFields = fields.map(field => {
      let component = ''
      switch (field.type) {
        case 'Boolean':
          component = `
            <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">${field.name}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />`
          break
        case 'Enum':
          const enumValues = field.enumValues || []
          component = `
            <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>${field.name}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ${field.name.toLowerCase()}" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      ${enumValues.map(value => `<SelectItem value="${value}">${value.charAt(0).toUpperCase() + value.slice(1)}</SelectItem>`).join('\n')}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />`
          break
        case 'Int':
          component = `
            <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>${field.name}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Enter ${field.name.toLowerCase()}"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />`
          break
        case 'Float':
          component = `
            <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>${field.name}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter ${field.name.toLowerCase()}"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />`
          break
        default:
          component = `
            <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>${field.name}</FormLabel>
                  <FormControl>
                    ${field.name.includes('description') || field.name.includes('features') ? 
                      `<Textarea 
                        placeholder="Enter ${field.name.toLowerCase()}"
                        {...field}
                        value={field.value || ''}
                      />` :
                      `<Input 
                        placeholder="Enter ${field.name.toLowerCase()}"
                        {...field}
                        value={field.value || ''}
                      />`
                    }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />`
      }
      return component
    }).join('\n')

    return `'use client'

import { type ${name} } from './schema'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ${name}Schema } from './schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

interface ${name}FormProps {
  defaultValues?: Partial<${name}>
  onSubmit: (data: FormData) => Promise<{ success: boolean } | void>
}

export function ${name}Form({ defaultValues, onSubmit }: ${name}FormProps) {
  const router = useRouter()
  const form = useForm<${name}>({
    resolver: zodResolver(${name}Schema),
    defaultValues: {
      ${fields.map(field => {
        switch (field.type) {
          case 'Boolean':
            return `${field.name}: false`
          case 'Int':
          case 'Float':
            return `${field.name}: 0`
          case 'Enum':
            return `${field.name}: '${field.enumValues?.[0] || ''}'`
          default:
            return `${field.name}: ''`
        }
      }).join(',\n      ')},
      ...defaultValues,
    },
  })

  const handleSubmit = async (values: ${name}) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    
    try {
      await onSubmit(formData)
      router.push('/dashboard/${name.toLowerCase()}s')
      router.refresh()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                ${formFields}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save ${name}</Button>
        </div>
      </form>
    </Form>
  )
}`
  },

  routes: (name: string, fields: Field[]) => {
    const columns = fields.map(field => {
      let column = ''
      switch (field.type) {
        case 'Boolean':
          column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
      cell: ({ getValue }) => {
        const value = getValue() as boolean
        return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
      },
    }`
          break
        case 'Enum':
          if (field.name === 'status' || field.name === 'condition') {
            column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
      cell: ({ getValue }) => {
        const value = getValue() as string
        const variants = {
          ${field.enumValues?.map(v => `'${v}': '${
            v === 'available' || v === 'new' ? 'success' :
            v === 'sold' || v === 'used' ? 'secondary' :
            'default'
          }'`).join(',\n          ')}
        } as const
        return (
          <Badge variant={variants[value]}>
            {value === 'certified' ? 'Certified Pre-Owned' : value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        )
      },
    }`
          } else {
            column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
      cell: ({ getValue }) => {
        const value = getValue() as string
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
    }`
          }
          break
        case 'Float':
          if (field.name === 'price') {
            column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
      cell: ({ getValue }) => {
        const value = getValue() as number
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value)
      },
    }`
          } else if (field.name === 'mileage') {
            column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
      cell: ({ getValue }) => {
        const value = getValue() as number
        return \`\${value.toLocaleString()} km\`
      },
    }`
          } else {
            column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
      cell: ({ getValue }) => {
        const value = getValue() as number
        return value.toLocaleString()
      },
    }`
          }
          break
        default:
          if (!field.name.includes('description') && !field.name.includes('features')) {
            column = `
    {
      accessorKey: '${field.name}',
      header: '${field.name}',
    }`
          }
      }
      return column
    }).filter(Boolean).join(',')

    return `'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type ${name} } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as actions from './actions'

type ${name}WithId = ${name} & { id: string }

export const columns: ColumnDef<${name}WithId>[] = [${columns},
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original

      const handleDelete = async () => {
        if (!confirm('Are you sure?')) return
        try {
          await actions.remove(item.id)
          window.location.reload()
        } catch (error) {
          console.error('Error deleting ${name.toLowerCase()}:', error)
          alert('Failed to delete ${name.toLowerCase()}')
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = \`/dashboard/${name.toLowerCase()}s/\${item.id}\`
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]`
  },

  index: (name: string, fields: Field[]) => `import * as actions from './actions'
import * as components from './components'
import { ${name}Schema } from './schema'
import { Package } from 'lucide-react'

export const ${name.toLowerCase()} = {
  actions,
  components,
  list: {
    columns: () => import('./routes').then(mod => mod.columns),
  },
  form: {
    sections: [
      {
        title: 'General',
        fields: [
          ${fields.map(field => `{
            name: '${field.name}',
            type: '${field.type.toLowerCase()}',
            label: '${field.name}',
            placeholder: 'Enter ${field.name}',
          }`).join(',\n          ')}
        ],
      },
    ],
  },
  schema: ${name}Schema,
  navigation: {
    title: '${name}s',
    path: '/dashboard/${name.toLowerCase()}s',
    icon: Package,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
}`,

  page: (name: string) => `import { Metadata } from 'next'
import { ${name}List } from './components'

export const metadata: Metadata = {
  title: '${name}s',
  description: 'Manage your ${name.toLowerCase()}s',
}

export default function ${name}Page() {
  return <${name}List />
}`,

  pageComponents: (name: string) => `'use client'

import { DashboardShell } from '@/components/dashboard/shell'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { ${name.toLowerCase()} } from '@/resources/${name.toLowerCase()}'
import { useEffect, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'

export function ${name}List() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnDef<any>[]>([])

  useEffect(() => {
    // Load data
    ${name.toLowerCase()}.actions.list().then(setData)
    
    // Load columns
    ${name.toLowerCase()}.list.columns().then(setColumns)
  }, [])

  return (
    <DashboardShell
      title="${name}s"
      description="Manage your ${name.toLowerCase()}s"
      action={
        <Button asChild>
          <Link href="/dashboard/${name.toLowerCase()}s/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        pageSize={10}
      />
    </DashboardShell>
  )
}`,

  newPage: (name: string) => `import { DashboardShell } from '@/components/dashboard/shell'
import { ${name}Form } from '@/resources/${name.toLowerCase()}/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ${name.toLowerCase()} } from '@/resources/${name.toLowerCase()}'

export default async function New${name}Page() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await ${name.toLowerCase()}.actions.create(data)
    redirect('/dashboard/${name.toLowerCase()}s')
  }

  return (
    <DashboardShell
      title="Create ${name}"
      description="Create a new ${name.toLowerCase()}"
    >
      <${name}Form onSubmit={handleSubmit} />
    </DashboardShell>
  )
}`,

  editPage: (name: string) => `import { DashboardShell } from '@/components/dashboard/shell'
import { ${name}Form } from '@/resources/${name.toLowerCase()}/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ${name.toLowerCase()} } from '@/resources/${name.toLowerCase()}'

type PageParams = { params: { ${name.toLowerCase()}Id: string } }

export default async function Edit${name}Page({ params }: PageParams) {
  const { ${name.toLowerCase()}Id } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await ${name.toLowerCase()}.actions.getById(${name.toLowerCase()}Id)
  if (!item) {
    redirect('/dashboard/${name.toLowerCase()}s')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await ${name.toLowerCase()}.actions.update(${name.toLowerCase()}Id, data)
    redirect('/dashboard/${name.toLowerCase()}s')
  }

  return (
    <DashboardShell
      title="Edit ${name}"
      description="Edit ${name.toLowerCase()}"
    >
      <${name}Form 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}`
} 