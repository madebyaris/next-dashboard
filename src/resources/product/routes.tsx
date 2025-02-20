'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Product } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type ProductWithId = Product & { id: string }

export const columns: ColumnDef<ProductWithId>[] = [
    {
      accessorKey: 'name',
      header: 'name',
    },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = `/dashboard/products/${item.id}`
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              if (!confirm('Are you sure?')) return
              await fetch(`/api/products/${item.id}`, {
                method: 'DELETE',
              })
              window.location.reload()
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]