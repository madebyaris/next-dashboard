'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Task } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as actions from './actions'

type TaskWithId = Task & { id: string }

export const columns: ColumnDef<TaskWithId>[] = [
    {
      accessorKey: 'title',
      header: 'title',
    },
    {
      accessorKey: 'description',
      header: 'description',
    },
    {
      accessorKey: 'status',
      header: 'status',
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
          console.error('Error deleting task:', error)
          alert('Failed to delete task')
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = `/dashboard/tasks/${item.id}`
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