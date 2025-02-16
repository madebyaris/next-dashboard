'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
    label: string
  }
}

interface StatsWidgetProps {
  stats: Stat[]
}

export function StatsWidget({ stats }: StatsWidgetProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            {stat.trend && (
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-medium',
                    stat.trend.direction === 'up'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  {stat.trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.trend.label}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 