'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { JsonForms } from '@jsonforms/react'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type ResourceBuilder } from './builder'

interface ResourceProps {
  resource: ReturnType<ResourceBuilder['build']>
  mode: 'list' | 'create' | 'edit'
  id?: string
}

export function Resource({ resource, mode, id }: ResourceProps) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(resource.display?.pageSize || 10)

  // Load data for list view
  const loadList = async () => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams()
      searchParams.set('page', String(pageIndex + 1))
      searchParams.set('limit', String(pageSize))
      if (search) searchParams.set('search', search)

      const response = await fetch(`${resource.endpoints.list}?${searchParams}`)
      if (!response.ok) throw new Error('Failed to load data')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error(`Failed to load ${resource.name}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load single item for edit view
  const loadItem = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(resource.endpoints.update.replace('{id}', id!))
      if (!response.ok) throw new Error('Failed to load data')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error(`Failed to load ${resource.name}:`, error)
      router.push(resource.endpoints.list)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)

      // Apply hooks
      if (mode === 'create' && resource.hooks?.beforeCreate) {
        formData = await resource.hooks.beforeCreate(formData)
      } else if (mode === 'edit' && resource.hooks?.beforeUpdate) {
        formData = await resource.hooks.beforeUpdate(formData)
      }

      // Make API request
      const response = await fetch(
        mode === 'create' 
          ? resource.endpoints.create
          : resource.endpoints.update.replace('{id}', id!),
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) throw new Error('Failed to save')
      const result = await response.json()

      // Apply after hooks
      if (mode === 'create' && resource.hooks?.afterCreate) {
        await resource.hooks.afterCreate(result)
      } else if (mode === 'edit' && resource.hooks?.afterUpdate) {
        await resource.hooks.afterUpdate(result)
      }

      router.push(resource.endpoints.list)
    } catch (error) {
      console.error(`Failed to save ${resource.name}:`, error)
      alert(`Failed to save ${resource.name}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deletion
  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      if (resource.hooks?.beforeDelete) {
        await resource.hooks.beforeDelete(itemId)
      }

      const response = await fetch(
        resource.endpoints.delete.replace('{id}', itemId),
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Failed to delete')

      if (resource.hooks?.afterDelete) {
        await resource.hooks.afterDelete(itemId)
      }

      loadList()
    } catch (error) {
      console.error(`Failed to delete ${resource.name}:`, error)
      alert(`Failed to delete ${resource.name}`)
    }
  }

  // Load data on mount
  useEffect(() => {
    if (mode === 'list') {
      loadList()
    } else if (mode === 'edit' && id) {
      loadItem()
    }
  }, [mode, id, pageIndex, pageSize, search])

  // Render list view
  if (mode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{resource.name}s</h1>
          <Button onClick={() => router.push(`${resource.endpoints.create}`)}>
            Create {resource.name}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {resource.columns.map((column) => (
                    <th key={column.id} className="p-4 text-left font-medium">
                      {column.header}
                    </th>
                  ))}
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    {resource.columns.map((column) => (
                      <td key={column.id} className="p-4">
                        {column.cell({ row: { getValue: (key: string) => item[key] } })}
                      </td>
                    ))}
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`${resource.endpoints.update.replace('{id}', item.id)}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-muted-foreground">
            {pageSize * pageIndex + 1}-{Math.min(pageSize * (pageIndex + 1), data?.total || 0)} of {data?.total || 0} items
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex >= Math.ceil((data?.total || 0) / pageSize) - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render create/edit form
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === 'create' ? `Create ${resource.name}` : `Edit ${resource.name}`}
        </h1>
      </div>

      {mode === 'edit' && isLoading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(data)
        }} className="space-y-6">
          <JsonForms
            schema={resource.schema}
            uischema={resource.uiSchema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setData(data)}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(resource.endpoints.list)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
} 