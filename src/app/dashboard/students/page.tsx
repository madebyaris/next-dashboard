import { DashboardShell } from '@/components/dashboard/shell'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { student } from '@/resources/student'

export const metadata = {
  title: 'Students',
  description: 'Manage your students',
}

export default async function StudentPage() {
  const data = await student.actions.list()

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
      <StudentList data={data} />
    </DashboardShell>
  )
}

function StudentList({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={student.list.columns}
      data={data}
      searchKey="title"
      pageSize={10}
    />
  )
}