# Resources

Resources are the core building blocks of the dashboard. Each resource represents a data type (e.g., posts, users, products) and includes all necessary configurations and components.

## Structure

A resource consists of:

```
resources/[resource]/
├── actions.ts      # CRUD operations
├── components/     # Resource-specific components
├── index.ts        # Resource definition
├── routes.ts       # Route configuration
└── schema.ts       # Data schema
```

## Configuration

### Schema Definition
```typescript
// schema.ts
import { z } from 'zod'

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string(),
  published: z.boolean(),
  createdAt: z.date()
})

export type Post = z.infer<typeof postSchema>
```

### Routes Configuration
```typescript
// routes.ts
export const routes = {
  list: '/dashboard/posts',
  new: '/dashboard/posts/new',
  edit: (id: string) => `/dashboard/posts/${id}`,
  api: {
    list: '/api/posts',
    create: '/api/posts',
    update: (id: string) => `/api/posts/${id}`,
    delete: (id: string) => `/api/posts/${id}`
  }
} as const
```

### Actions Implementation
```typescript
// actions.ts
import { routes } from './routes'
import type { Post } from './schema'

export async function list() {
  const response = await fetch(routes.api.list)
  return response.json()
}

export async function create(data: Omit<Post, 'id'>) {
  const response = await fetch(routes.api.create, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function edit(id: string) {
  window.location.href = routes.edit(id)
}

export async function delete_(id: string) {
  await fetch(routes.api.delete(id), { method: 'DELETE' })
}
```

### Resource Definition
```typescript
// index.ts
import { FileText } from 'lucide-react'
import { postSchema, type Post } from './schema'
import { routes } from './routes'
import * as postActions from './actions'
import { defineResource } from '../config'
import { columns } from '@/builders/table'

const { delete_, ...actions } = postActions

export const posts = defineResource<Post>({
  name: 'posts',
  path: routes.list,
  navigation: {
    title: 'Posts',
    icon: FileText,
    path: routes.list,
    roles: ['ADMIN', 'EDITOR']
  },
  schema: postSchema,
  table: {
    columns: [
      columns.text('title', 'Title', { sortable: true }),
      columns.badge('status', 'Status'),
      columns.actions('id', [
        {
          icon: FileText,
          label: 'Edit',
          onClick: (row) => actions.edit(row.id)
        }
      ])
    ]
  },
  actions: {
    ...actions,
    delete: delete_
  }
})
```

## Components

### Table Component
```typescript
// components/table.tsx
import { DataTable } from '@/components/ui/data-table'
import { posts } from '..'
import type { Post } from '../schema'

interface PostTableProps {
  data: Post[]
}

export function Table({ data }: PostTableProps) {
  return (
    <DataTable
      columns={posts.table.columns}
      data={data}
      searchKey="title"
      pageSize={10}
    />
  )
}
```

### List Page
```typescript
// app/dashboard/posts/page.tsx
import { Suspense } from 'react'
import { posts } from '@/resources/posts'
import { DashboardShell } from '@/components/dashboard/shell'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Table } from '@/resources/posts/components'

export default async function PostsPage() {
  const data = await posts.actions.list()

  return (
    <DashboardShell
      title={posts.navigation.title}
      description="Manage your posts"
      action={
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Table data={data.items} />
      </Suspense>
    </DashboardShell>
  )
} 