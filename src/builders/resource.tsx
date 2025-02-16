'use client'

import { type ResourceConfig } from '@/resources/config'
import { DataTable } from '@/components/ui/data-table'
import { StatsWidget } from '@/components/widgets'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function createResourceRenderer<T>(resource: ResourceConfig<T>) {
  return {
    List({ data }: { data: T[] }) {
      return (
        <DataTable
          columns={resource.list.columns}
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
      defaultValues?: Partial<T>
      onSubmit: (data: Partial<T>) => Promise<void>
    }) {
      const form = useForm({
        resolver: zodResolver(resource.schema),
        defaultValues: {
          ...defaultValues,
        },
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
                      name={field.name}
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