'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { DashboardLoading } from './loading'
import { ErrorState } from './error-state'

interface Post {
  id: string
  title: string
  published: boolean
  createdAt: string
  author: {
    name: string
    email: string
  }
}

export function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.posts.list()
        setPosts(data.slice(0, 5)) // Only show 5 most recent posts
      } catch (err) {
        setError('Failed to load recent posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) return <DashboardLoading />
  if (error) return <ErrorState title={error} />

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
                  className="text-sm font-medium leading-none hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  by {post.author.name || post.author.email} ·{' '}
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!post.published && (
                <div className="ml-auto">
                  <span className="text-xs text-muted-foreground">Draft</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
