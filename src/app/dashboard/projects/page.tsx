import { Metadata } from 'next'
import { ProjectList } from './components'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Manage your projects',
}

export default function ProjectPage() {
  return <ProjectList />
}