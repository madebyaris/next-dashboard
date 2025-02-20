import { Metadata } from 'next'
import { StudentList } from './components'

export const metadata: Metadata = {
  title: 'Students',
  description: 'Manage your students',
}

export default function StudentPage() {
  return <StudentList />
}