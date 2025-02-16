import { FileText, PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { postSchema, type Post } from './schema'
import { routes } from './routes'
import * as postActions from './actions'
import { defineResource } from '../config'
import { type Column } from '@/builders/table'

const { delete_, ...actions } = postActions

const columns: Column<Post>[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    sortable: true,
    searchable: true,
  },
  {
    key: 'author',
    label: 'Author',
    type: 'text',
    sortable: true,
    filterable: true,
    format: (value) => value?.name || 'Unknown',
  },
  {
    key: 'published',
    label: 'Status',
    type: 'badge',
    valueLabel: {
      true: 'Published',
      false: 'Draft',
    },
    color: {
      true: 'success',
      false: 'default',
    },
  },
  {
    key: 'id',
    label: 'Actions',
    type: 'actions',
    actions: [
      {
        icon: Pencil,
        label: 'Edit',
        onClick: (row: Post) => {
          window.location.href = `/dashboard/posts/${row.id}`
        },
      },
      {
        icon: Trash2,
        label: 'Delete',
        onClick: (row: Post) => {
          if (confirm('Are you sure you want to delete this post?')) {
            delete_(row.id)
            window.location.reload()
          }
        },
      },
    ],
  },
]

export const config = defineResource<Post>({
  name: 'posts',
  path: routes.list,
  navigation: {
    title: 'Posts',
    icon: FileText,
    path: routes.list,
    roles: ['ADMIN', 'EDITOR'],
  },
  schema: postSchema,
  list: {
    columns,
    actions: {
      create: {
        icon: PlusCircle,
        label: 'New Post',
        href: '/dashboard/posts/new',
      },
    },
  },
  form: {
    sections: [
      {
        title: 'Basic Information',
        description: 'Enter the basic information for this post',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
            placeholder: 'Enter post title',
            required: true,
          },
          {
            name: 'content',
            type: 'editor',
            label: 'Content',
            placeholder: 'Write your post content here',
            required: true,
          },
          {
            name: 'published',
            type: 'switch',
            label: 'Published',
          },
        ],
      },
    ],
  },
  actions: {
    ...actions,
    delete: delete_,
  },
})

export const posts = config

export { postSchema, type Post } from './schema'
export { routes } from './routes' 