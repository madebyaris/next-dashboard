import { DashboardShell } from '@/components/dashboard/shell'
import { StudentForm } from '@/resources/student/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { student } from '@/resources/student'
import { type Student } from '@/resources/student/schema'

type PageParams = { params: { studentId: string } }

export default async function EditStudentPage({ params }: PageParams) {
  const { studentId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await student.actions.getById(studentId)
  if (!item) {
    redirect('/dashboard/students')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      studentId: formData.get('studentId') as string,
      dateOfBirth: new Date(formData.get('dateOfBirth') as string),
      grade: parseInt(formData.get('grade') as string),
      major: formData.get('major') as string,
      gpa: parseFloat(formData.get('gpa') as string),
      enrollmentDate: new Date(formData.get('enrollmentDate') as string),
      status: formData.get('status') as Student['status'],
      isInternational: formData.get('isInternational') === 'true',
    }

    await student.actions.update(studentId, data)
    redirect('/dashboard/students')
  }

  return (
    <DashboardShell
      title="Edit Student"
      description="Edit student details"
    >
      <StudentForm 
        defaultValues={{
          ...item,
          dateOfBirth: new Date(item.dateOfBirth).toISOString().split('T')[0],
          enrollmentDate: new Date(item.enrollmentDate).toISOString().split('T')[0],
        }}
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}