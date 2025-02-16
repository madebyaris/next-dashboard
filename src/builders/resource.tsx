'use client'

import { type ResourceConfig, type Column } from '@/resources/config'
import { DataTable } from '@/components/ui/data-table'
import { StatsWidget } from '@/components/widgets'
import { useForm, type FieldValues, type Path, type DefaultValues } from 'react-hook-form'
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
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

function convertToColumnDef<T>(columns: Column<T>[]): ColumnDef<T, unknown>[] {
  return columns.map((col): ColumnDef<T, unknown> => ({
    id: col.key,
    accessorKey: col.key,
    header: col.label,
    cell: ({ row }) => {
      const value = row.getValue(col.key)
      
      if (col.type === 'badge' && typeof value === 'string') {
        const color = (col.color?.[value] || 'default') as BadgeVariant
        const label = col.valueLabel?.[value] || value
        return <Badge variant={color}>{label}</Badge>
      }

      if (col.type === 'actions' && col.actions) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {col.actions.map((action, index) => (
                action.visible?.(row.original) !== false && (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(row.original)}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                )
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }

      if (col.format) {
        return col.format(value)
      }

      return value as string
    },
    enableSorting: col.sortable,
    enableColumnFilter: col.filterable,
  }))
}

export function createResourceRenderer<T extends FieldValues>(resource: ResourceConfig<T>) {
  return {
    List({ data }: { data: T[] }) {
      return (
        <DataTable
          columns={convertToColumnDef(resource.list.columns)}
          data={data}
          searchKey="title"
          pageSize={10}
        />
      )
    },

    Form({ 
      defaultValues,
      onSubmit 
    }: { 
      defaultValues?: DefaultValues<T>
      onSubmit: (data: T) => Promise<void>
    }) {
      const form = useForm<T>({
        resolver: zodResolver(resource.schema),
        defaultValues,
      })

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {resource.form.sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.fields.map((field) => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name as Path<T>}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {field.type === 'text' && (
                              <Input
                                placeholder={field.placeholder}
                                {...formField}
                                value={String(formField.value || '')}
                              />
                            )}
                            {field.type === 'editor' && (
                              <Textarea
                                placeholder={field.placeholder}
                                {...formField}
                                value={String(formField.value || '')}
                              />
                            )}
                            {field.type === 'switch' && (
                              <Switch
                                checked={Boolean(formField.value)}
                                onCheckedChange={formField.onChange}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )
    },

    Stats({ data }: { data: Record<string, number> }) {
      const stats = resource.widgets?.[0]?.stats.map(stat => ({
        label: stat.label,
        value: data[stat.name],
        icon: stat.icon,
        trend: stat.trend,
      }))

      if (!stats) return null

      return <StatsWidget stats={stats} />
    }
  }
} 