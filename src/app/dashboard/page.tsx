'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Users, FileText, Settings } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentPosts } from '@/components/dashboard/recent-posts'
import { RecentUsers } from '@/components/dashboard/recent-users'
import { DashboardLoading } from '@/components/dashboard/loading'
import { ErrorState } from '@/components/dashboard/error-state'

interface DashboardStats {
  stats: {
    totalUsers: number
    totalPosts: number
    totalSettings: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch dashboard stats')
        }
        
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    fetchStats()
  }, [])

  if (status === 'loading' || !stats) {
    return <DashboardLoading />
  }

  if (error) {
    return <ErrorState title={error} retry={() => window.location.reload()} />
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.name || 'User'}
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={stats.stats.totalUsers}
          icon={Users}
          description="Registered users"
        />
        <StatsCard
          title="Total Posts"
          value={stats.stats.totalPosts}
          icon={FileText}
          description="Published and draft posts"
        />
        <StatsCard
          title="Active Settings"
          value={stats.stats.totalSettings}
          icon={Settings}
          description="System and user settings"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentPosts />
        <RecentUsers />
      </div>
    </div>
  )
}
