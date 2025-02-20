'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Note } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as actions from './actions'

type NoteWithId = Note & { id: string }

export const columns: ColumnDef<NoteWithId>[] = [
    {
      accessorKey: 'title',
      header: 'title',
    },
    {
      accessorKey: 'content',
      header: 'content',
    },
    {
      accessorKey: 'type',
      header: 'type',
    },
    {
      accessorKey: 'isPinned',
      header: 'isPinned',
      cell: ({ getValue }) => {
        const value = getValue() as boolean
        return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
      },
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
          console.error('Error deleting note:', error)
          alert('Failed to delete note')
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = `/dashboard/notes/${item.id}`
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