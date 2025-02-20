import { DashboardShell } from '@/components/dashboard/shell'
import { StudentForm } from '@/resources/student/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { student } from '@/resources/student'

type PageParams = Promise<{ studentId: string }>

export default async function EditStudentPage({ params }: { params: PageParams }) {
  const { studentId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await student.actions.getById(studentId)

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      published: formData.get('published') === 'true',
    }

    await student.actions.update(studentId, data)
  }

  return (
    <DashboardShell
      title="Edit Students"
      description="Edit your students"
    >
      <StudentForm 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}