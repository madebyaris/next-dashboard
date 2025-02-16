import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

export type WidgetType =
  | 'stats'
  | 'chart'
  | 'list'
  | 'table'
  | 'calendar'
  | 'map'
  | 'custom'

export interface WidgetChart {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area'
  data: any
  options?: any
}

export interface WidgetStats {
  value: number | string
  label: string
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
    label?: string
  }
  chart?: {
    data: number[]
    type: 'sparkline' | 'miniChart'
  }
}

export interface WidgetList {
  items: {
    title: string
    subtitle?: string
    value?: string | number
    icon?: LucideIcon
    badge?: {
      label: string
      color?: string
    }
    action?: {
      label: string
      onClick: () => void
    }
  }[]
}

export interface WidgetConfig {
  type: WidgetType
  title?: string
  description?: string
  width?: 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4'
  height?: string
  loading?: boolean
  error?: string
  refresh?: number
  content?: {
    stats?: WidgetStats
    chart?: WidgetChart
    list?: WidgetList
    table?: any
    custom?: ReactNode
  }
  actions?: {
    icon: LucideIcon
    label: string
    onClick: () => void
  }[]
  filters?: {
    key: string
    label: string
    type: 'select' | 'date' | 'daterange'
    options?: { label: string; value: any }[]
    defaultValue?: any
  }[]
}

export class WidgetBuilder {
  private config: WidgetConfig = {
    type: 'custom',
  }

  public type(type: WidgetType): this {
    this.config.type = type
    return this
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  public description(description: string): this {
    this.config.description = description
    return this
  }

  public width(width: WidgetConfig['width']): this {
    this.config.width = width
    return this
  }

  public height(height: string): this {
    this.config.height = height
    return this
  }

  public loading(loading: boolean): this {
    this.config.loading = loading
    return this
  }

  public error(error: string): this {
    this.config.error = error
    return this
  }

  public refresh(interval: number): this {
    this.config.refresh = interval
    return this
  }

  public content(content: WidgetConfig['content']): this {
    this.config.content = content
    return this
  }

  public actions(actions: WidgetConfig['actions']): this {
    this.config.actions = actions
    return this
  }

  public filters(filters: WidgetConfig['filters']): this {
    this.config.filters = filters
    return this
  }

  public build(): WidgetConfig {
    return this.config
  }
}

export function createWidget(): WidgetBuilder {
  return new WidgetBuilder()
}

// Helper functions for common widget types
export const widgets = {
  stats: (config: WidgetStats, widgetConfig: Partial<Omit<WidgetConfig, 'type' | 'content'>> = {}): WidgetConfig => ({
    type: 'stats',
    content: { stats: config },
    ...widgetConfig,
  }),

  chart: (config: WidgetChart, widgetConfig: Partial<Omit<WidgetConfig, 'type' | 'content'>> = {}): WidgetConfig => ({
    type: 'chart',
    content: { chart: config },
    ...widgetConfig,
  }),

  list: (config: WidgetList, widgetConfig: Partial<Omit<WidgetConfig, 'type' | 'content'>> = {}): WidgetConfig => ({
    type: 'list',
    content: { list: config },
    ...widgetConfig,
  }),

  custom: (content: ReactNode, widgetConfig: Partial<Omit<WidgetConfig, 'type' | 'content'>> = {}): WidgetConfig => ({
    type: 'custom',
    content: { custom: content },
    ...widgetConfig,
  }),
} 