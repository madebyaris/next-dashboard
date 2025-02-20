import * as actions from './actions'
import * as components from './components'
import { TagSchema } from './schema'
import { Package } from 'lucide-react'

export const tag = {
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
            name: 'color',
            type: 'string',
            label: 'color',
            placeholder: 'Enter color',
          },
          {
            name: 'type',
            type: 'enum',
            label: 'type',
            placeholder: 'Enter type',
          }
        ],
      },
    ],
  },
  schema: TagSchema,
  navigation: {
    title: 'Tags',
    path: '/dashboard/tags',
    icon: Package,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
}