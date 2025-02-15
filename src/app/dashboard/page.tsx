import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/dashboard/page-header'
import { RecentPosts } from '@/components/dashboard/recent-posts'
import { RecentUsers } from '@/components/dashboard/recent-users'
import { DashboardLoading, StatsCardLoading } from '@/components/dashboard/loading'
import { StatsSection } from '@/components/dashboard/stats-section'

async function getStats() {
  const [totalUsers, totalPosts, publishedPosts] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
  ])

  return {
    totalUsers,
    totalPosts,
    publishedPosts,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Dashboard"
        text={`Welcome back, ${session?.user?.name || 'User'}!`}
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={[...Array(3)].map((_, i) => (
          <StatsCardLoading key={i} />
        ))}>
          <StatsSection data={stats} />
        </Suspense>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Loading recent posts...</div>}>
          <RecentPosts />
        </Suspense>
        <Suspense fallback={<div>Loading recent users...</div>}>
          <RecentUsers />
        </Suspense>
      </div>
    </div>
  )
}
