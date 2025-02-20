import * as actions from './actions'
import * as components from './components'
import { TaskSchema } from './schema'
import { Package } from 'lucide-react'

export const task = {
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
            name: 'title',
            type: 'string',
            label: 'title',
            placeholder: 'Enter title',
          },
          {
            name: 'description',
            type: 'string',
            label: 'description',
            placeholder: 'Enter description',
          },
          {
            name: 'status',
            type: 'enum',
            label: 'status',
            placeholder: 'Enter status',
          }
        ],
      },
    ],
  },
  schema: TaskSchema,
  navigation: {
    title: 'Tasks',
    path: '/dashboard/tasks',
    icon: Package,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
}