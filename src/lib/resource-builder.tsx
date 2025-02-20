import { type ReactNode } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { type ResourceConfig } from '@/resources/products/config'
import { type JsonSchema } from '@jsonforms/core'

export class ResourceBuilder<T extends { id: string }> {
  constructor(private config: ResourceConfig<T>) {}

  // Generate a form component for create/edit
  createForm({
    initialData = {},
    onSubmit,
    isSubmitting = false,
  }: {
    initialData?: Partial<T>
    onSubmit: (data: Partial<T>) => Promise<void>
    isSubmitting?: boolean
  }) {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        onSubmit(initialData)
      }} className="space-y-6">
        <JsonForms
          schema={this.config.schema as JsonSchema}
          uischema={this.config.uiSchema}
          data={initialData}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data }) => {
            Object.assign(initialData, data)
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    )
  }

  // Generate a table component for listing
  createTable({
    data,
    pageCount,
    pageIndex,
    pageSize,
    onPaginationChange,
  }: {
    data: T[]
    pageCount: number
    pageIndex: number
    pageSize: number
    onPaginationChange: (pageIndex: number, pageSize: number) => void
  }) {
    const columns = Object.keys(this.config.schema.properties || {}).map((key) => ({
      id: key,
      header: (this.config.schema.properties?.[key] as any)?.title || key,
      cell: (row: T) => {
        const value = row[key as keyof T]
        if (typeof value === 'boolean') return value ? 'Yes' : 'No'
        if (value instanceof Date) return value.toLocaleDateString()
        if (typeof value === 'number' && key === 'price') return `$${value.toFixed(2)}`
        return String(value)
      },
    }))

    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map((column) => (
                  <th key={column.id} className="p-4 text-left font-medium">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b">
                  {columns.map((column) => (
                    <td key={column.id} className="p-4">
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-muted-foreground">
            {pageSize * pageIndex + 1}-{Math.min(pageSize * (pageIndex + 1), pageCount)} of {pageCount} items
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onPaginationChange(pageIndex - 1, pageSize)}
              disabled={pageIndex === 0}
              className="px-3 py-2 bg-muted rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPaginationChange(pageIndex + 1, pageSize)}
              disabled={pageIndex >= Math.ceil(pageCount / pageSize) - 1}
              className="px-3 py-2 bg-muted rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Generate a layout wrapper for resource pages
  createLayout({ children }: { children: ReactNode }) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{this.config.name}s</h1>
        </div>
        {children}
      </div>
    )
  }

  // Generate API handlers for CRUD operations
  createApiHandlers() {
    return {
      create: async (data: Partial<T>) => {
        if (this.config.actions?.beforeCreate) {
          data = await this.config.actions.beforeCreate(data)
        }

        const response = await fetch(this.config.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) throw new Error('Failed to create')
        const result = await response.json()

        if (this.config.actions?.afterCreate) {
          await this.config.actions.afterCreate(result)
        }

        return result
      },

      update: async (id: string, data: Partial<T>) => {
        if (this.config.actions?.beforeUpdate) {
          data = await this.config.actions.beforeUpdate(data)
        }

        const response = await fetch(`${this.config.api}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) throw new Error('Failed to update')
        const result = await response.json()

        if (this.config.actions?.afterUpdate) {
          await this.config.actions.afterUpdate(result)
        }

        return result
      },

      delete: async (id: string) => {
        if (this.config.actions?.beforeDelete) {
          await this.config.actions.beforeDelete(id)
        }

        const response = await fetch(`${this.config.api}/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete')

        if (this.config.actions?.afterDelete) {
          await this.config.actions.afterDelete(id)
        }
      },

      getList: async (options: { page?: number; limit?: number; search?: string } = {}) => {
        const searchParams = new URLSearchParams()
        if (options.page) searchParams.set('page', String(options.page))
        if (options.limit) searchParams.set('limit', String(options.limit))
        if (options.search) searchParams.set('search', options.search)

        const response = await fetch(`${this.config.api}?${searchParams}`)
        if (!response.ok) throw new Error('Failed to fetch list')
        return response.json()
      },

      getOne: async (id: string) => {
        const response = await fetch(`${this.config.api}/${id}`)
        if (!response.ok) throw new Error('Failed to fetch')
        return response.json()
      },
    }
  }
} 