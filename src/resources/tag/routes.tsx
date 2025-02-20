'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Tag } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as actions from './actions'

type TagWithId = Tag & { id: string }

export const columns: ColumnDef<TagWithId>[] = [
    {
      accessorKey: 'name',
      header: 'name',
    },
    {
      accessorKey: 'color',
      header: 'color',
    },
    {
      accessorKey: 'type',
      header: 'type',
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
          console.error('Error deleting tag:', error)
          alert('Failed to delete tag')
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = `/dashboard/tags/${item.id}`
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