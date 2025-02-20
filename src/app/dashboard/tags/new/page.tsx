import { DashboardShell } from '@/components/dashboard/shell'
import { TagForm } from '@/resources/tag/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { tag } from '@/resources/tag'

export default async function NewTagPage() {
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
    await tag.actions.create(data)
    redirect('/dashboard/tags')
  }

  return (
    <DashboardShell
      title="Create Tag"
      description="Create a new tag"
    >
      <TagForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}