import { Suspense } from 'react'
import { posts } from '@/resources/posts'
import { DashboardShell } from '@/components/dashboard/shell'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Stats, Table } from '@/resources/posts/components'

export default async function PostsPage() {
  const [postsData, stats] = await Promise.all([
    posts.actions.list(),
    posts.actions.getStats(),
  ])

  return (
    <DashboardShell
      title={posts.navigation.title}
      description="Manage your blog posts"
      action={
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      }
    >
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-card rounded-lg border animate-pulse">
              <div className="space-y-3">
                <div className="h-5 w-1/3 bg-muted rounded" />
                <div className="h-8 w-1/2 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      }>
        <Stats data={stats} />
      </Suspense>
      
      <Suspense fallback={<div className="mt-4 animate-pulse">
        <div className="h-10 bg-muted rounded-lg mb-4" />
        <div className="h-[400px] bg-muted rounded-lg" />
      </div>}>
        <div className="mt-4">
          <Table data={postsData.items} />
        </div>
      </Suspense>
    </DashboardShell>
  )
}
