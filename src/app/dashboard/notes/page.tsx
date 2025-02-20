import { Metadata } from 'next'
import { NoteList } from './components'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Manage your notes',
}

export default function NotePage() {
  return <NoteList />
}