'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Project } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as actions from './actions'

type ProjectWithId = Project & { id: string }

export const columns: ColumnDef<ProjectWithId>[] = [
    {
      accessorKey: 'name',
      header: 'name',
    },
    {
      accessorKey: 'description',
      header: 'description',
    },
    {
      accessorKey: 'startDate',
      header: 'startDate',
      cell: ({ getValue }) => {
        const value = getValue() as string
        return new Date(value).toLocaleDateString()
      },
    },
    {
      accessorKey: 'endDate',
      header: 'endDate',
      cell: ({ getValue }) => {
        const value = getValue() as string
        return new Date(value).toLocaleDateString()
      },
    },
    {
      accessorKey: 'budget',
      header: 'budget',
    },
    {
      accessorKey: 'status',
      header: 'status',
    },
    {
      accessorKey: 'priority',
      header: 'priority',
    },
    {
      accessorKey: 'progress',
      header: 'progress',
    },
    {
      accessorKey: 'isPublic',
      header: 'isPublic',
      cell: ({ getValue }) => {
        const value = getValue() as boolean
        return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
      },
    },
    {
      accessorKey: 'category',
      header: 'category',
    },
    {
      accessorKey: 'tags',
      header: 'tags',
    },
    {
      accessorKey: 'teamSize',
      header: 'teamSize',
    },
    {
      accessorKey: 'manager',
      header: 'manager',
    },
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
          console.error('Error deleting project:', error)
          alert('Failed to delete project')
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = `/dashboard/projects/${item.id}`
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
]