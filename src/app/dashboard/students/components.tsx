'use client'

import { DashboardShell } from '@/components/dashboard/shell'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { student } from '@/resources/student'
import { useEffect, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'

export function StudentList() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnDef<any>[]>([])

  useEffect(() => {
    // Load data
    student.actions.list().then(setData)
    
    // Load columns
    student.list.columns().then(setColumns)
  }, [])

  return (
    <DashboardShell
      title="Students"
      description="Manage your students"
      action={
        <Button asChild>
          <Link href="/dashboard/students/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        pageSize={10}
      />
    </DashboardShell>
  )
} 