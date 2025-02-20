import { DashboardShell } from '@/components/dashboard/shell'
import { TaskForm } from '@/resources/task/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { task } from '@/resources/task'

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await task.actions.create(data)
    redirect('/dashboard/tasks')
  }

  return (
    <DashboardShell
      title="Create Task"
      description="Create a new task"
    >
      <TaskForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}