import * as actions from './actions'
import * as components from './components'
import { ProjectSchema } from './schema'
import { Package } from 'lucide-react'

export const project = {
  actions,
  components,
  list: {
    columns: () => import('./routes').then(mod => mod.columns),
  },
  form: {
    sections: [
      {
        title: 'General',
        fields: [
          {
            name: 'name',
            type: 'string',
            label: 'name',
            placeholder: 'Enter name',
          },
          {
            name: 'description',
            type: 'string',
            label: 'description',
            placeholder: 'Enter description',
          },
          {
            name: 'startDate',
            type: 'datetime',
            label: 'startDate',
            placeholder: 'Enter startDate',
          },
          {
            name: 'endDate',
            type: 'datetime',
            label: 'endDate',
            placeholder: 'Enter endDate',
          },
          {
            name: 'budget',
            type: 'float',
            label: 'budget',
            placeholder: 'Enter budget',
          },
          {
            name: 'status',
            type: 'enum',
            label: 'status',
            placeholder: 'Enter status',
          },
          {
            name: 'priority',
            type: 'enum',
            label: 'priority',
            placeholder: 'Enter priority',
          },
          {
            name: 'progress',
            type: 'float',
            label: 'progress',
            placeholder: 'Enter progress',
          },
          {
            name: 'isPublic',
            type: 'boolean',
            label: 'isPublic',
            placeholder: 'Enter isPublic',
          },
          {
            name: 'category',
            type: 'string',
            label: 'category',
            placeholder: 'Enter category',
          },
          {
            name: 'tags',
            type: 'string',
            label: 'tags',
            placeholder: 'Enter tags',
          },
          {
            name: 'teamSize',
            type: 'int',
            label: 'teamSize',
            placeholder: 'Enter teamSize',
          },
          {
            name: 'manager',
            type: 'string',
            label: 'manager',
            placeholder: 'Enter manager',
          }
        ],
      },
    ],
  },
  schema: ProjectSchema,
  navigation: {
    title: 'Projects',
    path: '/dashboard/projects',
    icon: Package,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
}