import { Metadata } from 'next'
import { TagList } from './components'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Manage your tags',
}

export default function TagPage() {
  return <TagList />
}