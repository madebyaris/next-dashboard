import { StatsWidget, ChartWidget, ListWidget } from '@/components/widgets'
import { LucideIcon } from 'lucide-react'

export type WidgetType = 'stats' | 'chart' | 'list'

export interface WidgetConfig {
  type: WidgetType
  config: any
}

export interface StatsConfig {
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

export interface ChartConfig {
  title: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
  className?: string
}

export interface ListConfig {
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

export const widgets = {
  stats: (
    config: Omit<StatsConfig, 'className'>,
    options: {
      width?: string
    } = {}
  ): WidgetConfig => ({
    type: 'stats',
    config: {
      ...config,
      className: options.width ? `w-${options.width}` : undefined,
    },
  }),

  chart: (
    config: {
      type: 'line' | 'bar' | 'pie'
      data: {
        labels: string[]
        datasets: {
          label: string
          data: number[]
        }[]
      }
    },
    options: {
      title: string
      width?: string
    }
  ): WidgetConfig => ({
    type: 'chart',
    config: {
      title: options.title,
      data: config.data,
      className: options.width ? `w-${options.width}` : undefined,
    },
  }),

  list: (
    config: {
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
    },
    options: {
      title: string
      width?: string
    }
  ): WidgetConfig => ({
    type: 'list',
    config: {
      title: options.title,
      items: config.items,
      className: options.width ? `w-${options.width}` : undefined,
    },
  }),
} 