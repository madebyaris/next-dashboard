import { LucideIcon } from 'lucide-react'
import { z } from 'zod'

export interface NavigationItem {
  title: string
  path: string
  icon: LucideIcon
  roles?: string[]
  children?: NavigationItem[]
}

export interface ResourceConfig<T> {
  name: string
  path: string
  navigation: NavigationItem
  schema: z.ZodType<T>
  table: {
    columns: any[]
    filters?: any[]
    defaultSort?: {
      field: keyof T
      direction: 'asc' | 'desc'
    }
  }
  widgets?: any[]
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