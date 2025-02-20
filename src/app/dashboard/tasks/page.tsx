import { Metadata } from 'next'
import { TaskList } from './components'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'Manage your tasks',
}

export default function TaskPage() {
  return <TaskList />
}