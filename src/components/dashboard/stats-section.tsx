'use client'

import { StatsCard } from './stats-card'
import { Users, FileText, Eye } from 'lucide-react'

interface StatsData {
  totalUsers: number
  totalPosts: number
  publishedPosts: number
}

export function StatsSection({ data }: { data: StatsData }) {
  const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: Users,
      description: 'Total number of registered users',
    },
    {
      title: 'Total Posts',
      value: data.totalPosts,
      icon: FileText,
      description: 'Total number of posts created',
    },
    {
      title: 'Published Posts',
      value: data.publishedPosts,
      icon: Eye,
      description: 'Number of posts published',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
} 