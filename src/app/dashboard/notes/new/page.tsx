import { DashboardShell } from '@/components/dashboard/shell'
import { NoteForm } from '@/resources/note/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { note } from '@/resources/note'

export default async function NewNotePage() {
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
    await note.actions.create(data)
    redirect('/dashboard/notes')
  }

  return (
    <DashboardShell
      title="Create Note"
      description="Create a new note"
    >
      <NoteForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}