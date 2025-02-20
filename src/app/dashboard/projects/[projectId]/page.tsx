import { DashboardShell } from '@/components/dashboard/shell'
import { ProjectForm } from '@/resources/project/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { project } from '@/resources/project'

type PageParams = { params: { projectId: string } }

export default async function EditProjectPage({ params }: PageParams) {
  const { projectId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await project.actions.getById(projectId)
  if (!item) {
    redirect('/dashboard/projects')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await project.actions.update(projectId, data)
    redirect('/dashboard/projects')
  }

  return (
    <DashboardShell
      title="Edit Project"
      description="Edit project"
    >
      <ProjectForm 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}