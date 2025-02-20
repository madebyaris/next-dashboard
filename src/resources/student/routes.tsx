'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Student } from './schema'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as actions from './actions'

type StudentWithId = Student & { id: string }

export const columns: ColumnDef<StudentWithId>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'studentId',
    header: 'Student ID',
  },
  {
    accessorKey: 'grade',
    header: 'Grade',
  },
  {
    accessorKey: 'major',
    header: 'Major',
  },
  {
    accessorKey: 'gpa',
    header: 'GPA',
    cell: ({ getValue }) => {
      const gpa = getValue() as number
      return gpa.toFixed(2)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
      return (
        <Badge 
          variant={
            status === 'ACTIVE' 
              ? 'success' 
              : status === 'INACTIVE' 
                ? 'secondary' 
                : 'destructive'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isInternational',
    header: 'International',
    cell: ({ getValue }) => {
      const isInternational = getValue() as boolean
      return (
        <Badge variant={isInternational ? 'default' : 'secondary'}>
          {isInternational ? 'Yes' : 'No'}
        </Badge>
      )
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
          console.error('Error deleting student:', error)
          alert('Failed to delete student')
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = `/dashboard/students/${item.id}`
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