import { DashboardShell } from '@/components/dashboard/shell'
import { ProjectForm } from '@/resources/project/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { project } from '@/resources/project'

export default async function NewProjectPage() {
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
    await project.actions.create(data)
    redirect('/dashboard/projects')
  }

  return (
    <DashboardShell
      title="Create Project"
      description="Create a new project"
    >
      <ProjectForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}