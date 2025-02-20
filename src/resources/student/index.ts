import * as actions from './actions'
import * as components from './components'
import { columns } from './routes'
import { StudentSchema } from './schema'
import { GraduationCap } from 'lucide-react'

export const student = {
  actions,
  components,
  list: {
    columns,
  },
  form: {
    sections: [
      {
        title: 'Basic Information',
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter student name',
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter student email',
          },
          {
            name: 'studentId',
            type: 'text',
            label: 'Student ID',
            placeholder: 'Enter student ID',
          },
        ],
      },
      {
        title: 'Academic Information',
        fields: [
          {
            name: 'grade',
            type: 'number',
            label: 'Grade',
            placeholder: 'Enter grade',
          },
          {
            name: 'major',
            type: 'text',
            label: 'Major',
            placeholder: 'Enter major',
          },
          {
            name: 'gpa',
            type: 'number',
            label: 'GPA',
            placeholder: 'Enter GPA',
          },
        ],
      },
      {
        title: 'Additional Information',
        fields: [
          {
            name: 'dateOfBirth',
            type: 'date',
            label: 'Date of Birth',
          },
          {
            name: 'enrollmentDate',
            type: 'date',
            label: 'Enrollment Date',
          },
          {
            name: 'status',
            type: 'select',
            label: 'Status',
            options: [
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Suspended', value: 'SUSPENDED' },
            ],
          },
          {
            name: 'isInternational',
            type: 'switch',
            label: 'International Student',
          },
        ],
      },
    ],
  },
  navigation: {
    title: 'Students',
    path: '/dashboard/students',
    icon: GraduationCap,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
  schema: StudentSchema,
}