import { LucideIcon } from 'lucide-react'
import { z } from 'zod'

export interface NavigationItem {
  title: string
  path: string
  icon: LucideIcon
  roles?: string[]
  children?: NavigationItem[]
}

export interface Field {
  name: string
  type: 'text' | 'editor' | 'switch' | 'select' | 'number'
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
}

export interface FormSection {
  title: string
  description?: string
  fields: Field[]
}

export interface Column<T = any> {
  key: string
  label: string
  type: 'text' | 'number' | 'badge' | 'actions'
  sortable?: boolean
  searchable?: boolean
  filterable?: boolean
  format?: (value: any) => string
  color?: Record<string, string>
  valueLabel?: Record<string, string>
  actions?: {
    icon: LucideIcon
    label: string
    onClick: (row: T) => void
    visible?: (row: T) => boolean
  }[]
}

export interface Filter {
  key: string
  label: string
  type: 'select' | 'text' | 'number' | 'date'
  options?: { label: string; value: any }[]
}

export interface Stat {
  name: string
  label: string
  value: () => Promise<number>
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
    label: string
  }
}

export interface Widget {
  type: 'stats'
  stats: Stat[]
}

export interface ResourceConfig<T> {
  name: string
  path: string
  navigation: NavigationItem
  schema: z.ZodType<T>
  list: {
    columns: Column[]
    filters?: Filter[]
    defaultSort?: {
      field: keyof T
      direction: 'asc' | 'desc'
    }
    actions?: {
      create?: {
        icon: LucideIcon
        label: string
        href: string
      }
    }
  }
  form: {
    sections: FormSection[]
  }
  widgets?: Widget[]
  actions: {
    list: () => Promise<any>
    create: (data: any) => Promise<any>
    update: (id: string, data: any) => Promise<any>
    delete: (id: string) => Promise<any>
    [key: string]: (...args: any[]) => Promise<any>
  }
}

export function defineResource<T>(config: ResourceConfig<T>) {
  return config
} 