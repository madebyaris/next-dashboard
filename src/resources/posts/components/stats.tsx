'use client'

import { StatsWidget } from '@/components/widgets'
import { widgets } from '..'

interface PostStatsProps {
  data: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
  }
}

export function Stats({ data }: PostStatsProps) {
  const stats = [
    {
      ...widgets[0],
      value: data.totalPosts,
    },
    {
      ...widgets[1],
      value: data.publishedPosts,
    },
    {
      ...widgets[2],
      value: data.draftPosts,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatsWidget key={index} {...stat} />
      ))}
    </div>
  )
} 