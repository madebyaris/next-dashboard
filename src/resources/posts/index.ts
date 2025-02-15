import { FileText, PlusCircle, Archive, Trash2 } from 'lucide-react'
import { postSchema, type Post } from './schema'
import { routes } from './routes'
import * as postActions from './actions'
import type { StatsWidgetProps } from '@/components/widgets'
import { defineResource } from '../config'
import { columns } from '@/builders/table'

const { delete_, ...actions } = postActions

// Widget configuration
export const widgets: StatsWidgetProps[] = [
  {
    value: 1234,
    label: 'Total Posts',
    icon: FileText,
    trend: {
      value: 12.5,
      direction: 'up' as const,
      label: 'vs last month',
    },
    width: 'full',
  },
  {
    value: 567,
    label: 'Published Posts',
    icon: FileText,
    trend: {
      value: 8.2,
      direction: 'up' as const,
      label: 'vs last month',
    },
    width: 'full',
  },
  {
    value: 123,
    label: 'Draft Posts',
    icon: FileText,
    trend: {
      value: -2.4,
      direction: 'down' as const,
      label: 'vs last month',
    },
    width: 'full',
  },
]

// Resource configuration
export const posts = defineResource<Post>({
  name: 'posts',
  path: routes.list,
  navigation: {
    title: 'Posts',
    icon: FileText,
    path: routes.list,
    roles: ['ADMIN', 'EDITOR'],
  },
  schema: postSchema,
  table: {
    columns: [
      columns.text('title', 'Title', { sortable: true, searchable: true }),
      columns.text('authorId', 'Author', { sortable: true, filterable: true }),
      columns.badge('published', 'Status', {
        color: {
          true: 'green',
          false: 'gray',
        },
        valueLabel: {
          true: 'Published',
          false: 'Draft',
        },
      }),
      columns.actions('id', [
        {
          icon: PlusCircle,
          label: 'Edit',
          onClick: (row: Post) => actions.edit(row.id),
        },
        {
          icon: Archive,
          label: 'Archive',
          onClick: (row: Post) => actions.archive(row.id),
          visible: (row: Post) => row.published,
        },
        {
          icon: Trash2,
          label: 'Delete',
          onClick: (row: Post) => delete_(row.id),
        },
      ]),
    ],
    filters: [
      {
        key: 'published',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'All', value: '' },
          { label: 'Published', value: 'true' },
          { label: 'Draft', value: 'false' },
        ],
      },
    ],
    defaultSort: {
      field: 'createdAt',
      direction: 'desc',
    },
  },
  widgets,
  actions: {
    ...actions,
    delete: delete_,
  },
})

export { postSchema, type Post } from './schema'
export { routes } from './routes'
export { postActions as actions } 