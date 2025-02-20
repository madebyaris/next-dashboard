import { DashboardShell } from '@/components/dashboard/shell'
import { StudentForm } from '@/resources/student/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { student } from '@/resources/student'
import { type Student } from '@/resources/student/schema'

export default async function NewStudentPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
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
      dateOfBirth: formData.get('dateOfBirth') as string,
      grade: parseInt(formData.get('grade') as string),
      major: formData.get('major') as string,
      gpa: parseFloat(formData.get('gpa') as string),
      enrollmentDate: formData.get('enrollmentDate') as string,
      status: formData.get('status') as Student['status'],
      isInternational: formData.get('isInternational') === 'true',
    }

    await student.actions.create(data)
    redirect('/dashboard/students')
  }

  return (
    <DashboardShell
      title="Create Student"
      description="Create a new student"
    >
      <StudentForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}