'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsWidgetProps {
  value: string | number
  label: string
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
    label: string
  }
  className?: string
}

export function StatsWidget({
  value,
  label,
  icon: Icon,
  trend,
  className,
}: StatsWidgetProps) {
  return (
    <div className={cn('p-6 bg-card rounded-lg border', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {label}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.value}%
            </span>
            <span className="text-sm text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  )
} 