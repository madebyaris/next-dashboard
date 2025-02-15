import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentPosts } from '@/components/dashboard/recent-posts'
import { RecentUsers } from '@/components/dashboard/recent-users'
import { Users, FileText, Eye } from 'lucide-react'

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
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Total number of registered users"
        />
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          description="Total number of posts created"
        />
        <StatsCard
          title="Published Posts"
          value={stats.publishedPosts}
          icon={Eye}
          description="Number of posts published"
        />
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
