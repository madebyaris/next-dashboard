import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostsTable } from '@/components/posts/posts-table'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardLoading } from '@/components/dashboard/loading'
import { ErrorState } from '@/components/dashboard/error-state'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Plus } from 'lucide-react'
import { getPosts } from '@/lib/api'

export const metadata = {
  title: 'Posts Management',
  description: 'Manage your blog posts',
}

async function PostsList() {
  try {
    const posts = await getPosts()

    if (posts.length === 0) {
      return (
        <EmptyState
          title="No posts found"
          description="Create your first post to get started."
          action={
            <Link href="/dashboard/posts/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </Link>
          }
        />
      )
    }

    return <PostsTable posts={posts} onPostDeleted={() => {}} />
  } catch (error) {
    return (
      <ErrorState
        title="Failed to load posts"
        description="There was an error loading your posts. Please try again."
      />
    )
  }
}

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Posts Management"
        text="Create and manage your blog posts."
      >
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </DashboardHeader>

      <Suspense fallback={<DashboardLoading />}>
        <PostsList />
      </Suspense>
    </div>
  )
}
