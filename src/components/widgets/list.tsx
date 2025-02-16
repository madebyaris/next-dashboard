'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ListWidgetProps {
  title: string
  items: {
    title: string
    subtitle: string
    value: string | number
    icon: LucideIcon
    badge?: {
      label: string
      color: string
    }
  }[]
  className?: string
}

export function ListWidget({ title, items, className }: ListWidgetProps) {
  return (
    <div className={cn('p-6 bg-card rounded-lg border', className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right font-medium">{item.value}</div>
                {item.badge && (
                  <div
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      item.badge.color === 'green' && 'bg-green-100 text-green-700',
                      item.badge.color === 'blue' && 'bg-blue-100 text-blue-700',
                      item.badge.color === 'red' && 'bg-red-100 text-red-700'
                    )}
                  >
                    {item.badge.label}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 