import { DashboardShell } from '@/components/dashboard/shell'
import { TagForm } from '@/resources/tag/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { tag } from '@/resources/tag'

type PageParams = { params: { tagId: string } }

export default async function EditTagPage({ params }: PageParams) {
  const { tagId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await tag.actions.getById(tagId)
  if (!item) {
    redirect('/dashboard/tags')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await tag.actions.update(tagId, data)
    redirect('/dashboard/tags')
  }

  return (
    <DashboardShell
      title="Edit Tag"
      description="Edit tag"
    >
      <TagForm 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}