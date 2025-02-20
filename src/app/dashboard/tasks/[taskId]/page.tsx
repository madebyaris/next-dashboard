import { DashboardShell } from '@/components/dashboard/shell'
import { TaskForm } from '@/resources/task/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { task } from '@/resources/task'

type PageParams = { params: { taskId: string } }

export default async function EditTaskPage({ params }: PageParams) {
  const { taskId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await task.actions.getById(taskId)
  if (!item) {
    redirect('/dashboard/tasks')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await task.actions.update(taskId, data)
    redirect('/dashboard/tasks')
  }

  return (
    <DashboardShell
      title="Edit Task"
      description="Edit task"
    >
      <TaskForm 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}