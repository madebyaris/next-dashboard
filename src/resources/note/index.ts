import * as actions from './actions'
import * as components from './components'
import { NoteSchema } from './schema'
import { Package } from 'lucide-react'

export const note = {
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
            name: 'content',
            type: 'string',
            label: 'content',
            placeholder: 'Enter content',
          },
          {
            name: 'type',
            type: 'enum',
            label: 'type',
            placeholder: 'Enter type',
          },
          {
            name: 'isPinned',
            type: 'boolean',
            label: 'isPinned',
            placeholder: 'Enter isPinned',
          }
        ],
      },
    ],
  },
  schema: NoteSchema,
  navigation: {
    title: 'Notes',
    path: '/dashboard/notes',
    icon: Package,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
}