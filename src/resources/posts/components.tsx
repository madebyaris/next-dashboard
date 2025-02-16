'use client'

import { type Post, updatePostSchema } from './schema'
import { DataTable } from '@/components/ui/data-table'
import { StatsWidget } from '@/components/widgets'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ColumnDef } from '@tanstack/react-table'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { config } from '.'
import { useTransition } from 'react'

const convertToColumnDefs = (columns: typeof config.list.columns): ColumnDef<Post>[] => {
  return columns.map(col => ({
    accessorKey: String(col.key),
    header: col.label,
    cell: ({ row }) => {
      const value = row.original[col.key as keyof Post]
      
      if (col.type === 'actions' && col.actions) {
        return (
          <div className="flex gap-2">
            {col.actions.map((action, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                size="sm"
                onClick={() => action.onClick(row.original)}
              >
                <action.icon className="h-4 w-4" />
                <span className="sr-only">{action.label}</span>
              </Button>
            ))}
          </div>
        )
      }
      
      if (col.type === 'badge') {
        const variant = col.color?.[String(value)] as 'default' | 'success' | 'destructive'
        return (
          <Badge variant={variant}>
            {col.valueLabel?.[String(value)] || String(value)}
          </Badge>
        )
      }
      if (col.format) {
        return col.format(value)
      }
      return String(value || '')
    },
  }))
}

export const PostList = ({ data }: { data: Post[] }) => {
  return (
    <div className="space-y-4">
      {config.list.actions?.create && (
        <div className="flex justify-end">
          <Button asChild>
            <a href={config.list.actions.create.href}>
              <config.list.actions.create.icon className="mr-2 h-4 w-4" />
              {config.list.actions.create.label}
            </a>
          </Button>
        </div>
      )}
      <DataTable
        columns={convertToColumnDefs(config.list.columns)}
        data={data}
        searchKey="title"
        pageSize={10}
      />
    </div>
  )
}

export const PostForm = ({ 
  defaultValues,
  onSubmit 
}: { 
  defaultValues?: Partial<Post>
  onSubmit: (data: FormData) => Promise<void>
}) => {
  const [isPending, startTransition] = useTransition()
  const form = useForm<Partial<Post>>({
    defaultValues: {
      title: '',
      content: '',
      published: false,
      ...defaultValues,
    },
  })

  async function handleSubmit(data: Partial<Post>) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    
    startTransition(async () => {
      await onSubmit(formData)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {config.form.sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof Post}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      {field.type === 'text' && (
                        <FormControl>
                          <Input
                            placeholder={field.placeholder}
                            {...formField}
                            value={String(formField.value || '')}
                          />
                        </FormControl>
                      )}
                      {field.type === 'editor' && (
                        <FormControl>
                          <Textarea
                            placeholder={field.placeholder}
                            {...formField}
                            value={String(formField.value || '')}
                          />
                        </FormControl>
                      )}
                      {field.type === 'switch' && (
                        <FormControl>
                          <Switch
                            checked={Boolean(formField.value)}
                            onCheckedChange={formField.onChange}
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const PostStats = ({ data }: { data: Record<string, number> }) => {
  const stats = config.widgets?.[0]?.stats.map(stat => ({
    label: stat.label,
    value: data[stat.name],
    icon: stat.icon,
    trend: stat.trend,
  }))

  if (!stats) return null

  return <StatsWidget stats={stats} />
} 