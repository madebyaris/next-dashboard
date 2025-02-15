'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { DashboardLoading } from './loading'
import { ErrorState } from './error-state'
import { prisma } from '@/lib/prisma'

interface Post {
  id: string
  title: string
  createdAt: Date
  author: {
    name: string | null
  }
}

async function getRecentPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  return posts
}

export async function RecentPosts() {
  const posts = await getRecentPosts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center">
              <div className="space-y-1">
                <Link
                  href={`/dashboard/posts/${post.id}`}
                  className="font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  by {post.author.name || 'Unknown'} •{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
