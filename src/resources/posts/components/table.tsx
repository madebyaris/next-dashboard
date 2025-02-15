'use client'

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