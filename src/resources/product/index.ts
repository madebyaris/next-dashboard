import * as actions from './actions'
import * as components from './components'
import { columns } from './routes'
import { ProductSchema } from './schema'
import { Package } from 'lucide-react'

export const product = {
  actions,
  components,
  list: {
    columns,
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
          }
        ],
      },
    ],
  },
  schema: ProductSchema,
  navigation: {
    title: 'Products',
    path: '/dashboard/products',
    icon: Package,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
}