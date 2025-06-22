import { FileText, Pencil, Trash2, Plus, Download, Archive } from 'lucide-react'
import { postSchema, type post } from './schema'
import * as actions from './actions'
import { defineResource } from '../config'

const { delete_, ...otherActions } = actions

export const config = defineResource<post>({
  name: 'posts',
  path: '/dashboard/posts',
  navigation: {
    title: 'posts',
    icon: FileText,
    path: '/dashboard/posts',
    roles: ['ADMIN', 'EDITOR'],
  },
  schema: postSchema,
  list: {
    columns: [
      {
        key: 'post',
        label: 'Post',
        type: 'text',
        sortable: true,
        
      },
      {
        key: 'id',
        label: 'Actions',
        type: 'actions',
        actions: [
          {
            icon: Pencil,
            label: 'Edit',
            onClick: (row: post) => {
              window.location.href = `/dashboard/posts/${row.id}`
            },
          },
          {
            icon: Trash2,
            label: 'Delete',
            onClick: async (row: post) => {
              if (confirm('Are you sure you want to delete this post?')) {
                await delete_(row.id)
                window.location.reload()
              }
            },
          },
        ],
      },
    ],
    enableSelection: true,
    bulkActions: [
      {
        label: 'Delete Selected',
        icon: Trash2,
        onClick: async (selectedposts: post[]) => {
          if (confirm(`Delete ${selectedposts.length} posts?`)) {
            for (const item of selectedposts) {
              await delete_(item.id)
            }
            window.location.reload()
          }
        },
        variant: 'destructive' as const,
      },
      {
        label: 'Export',
        icon: Download,
        onClick: (selectedposts: post[]) => {
          const csv = selectedposts.map(item => 
            [item.post].join(',')
          ).join('\n')
          const blob = new Blob([csv], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'posts.csv'
          a.click()
        },
      },
    ],
    actions: {
      create: {
        icon: Plus,
        label: 'New post',
        href: '/dashboard/posts/new',
      },
    },
  },
  form: {
    sections: [
      {
        title: 'General Information',
        description: 'Enter the basic information for this post',
        fields: [
          {
                    "name": "post",
                    "type": "text",
                    "label": "Post",
                    "required": false,
                    "placeholder": "post"
          }
        ],
      },
    ],
  },
  actions: {
    ...otherActions,
    delete: delete_,
  },
})

export const posts = config
export { postSchema, type post } from './schema'