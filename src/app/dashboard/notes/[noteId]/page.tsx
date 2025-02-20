import { DashboardShell } from '@/components/dashboard/shell'
import { NoteForm } from '@/resources/note/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { note } from '@/resources/note'

type PageParams = { params: { noteId: string } }

export default async function EditNotePage({ params }: PageParams) {
  const { noteId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await note.actions.getById(noteId)
  if (!item) {
    redirect('/dashboard/notes')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await note.actions.update(noteId, data)
    redirect('/dashboard/notes')
  }

  return (
    <DashboardShell
      title="Edit Note"
      description="Edit note"
    >
      <NoteForm 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}