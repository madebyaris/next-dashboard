import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

export type ColumnType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'image'
  | 'badge'
  | 'icon'
  | 'actions'
  | 'custom'

export interface TableColumn<T = any> {
  key: string
  label: string
  type: ColumnType
  sortable?: boolean
  searchable?: boolean
  filterable?: boolean
  hidden?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row: T) => ReactNode
  badge?: {
    color?: Record<string | number, string>
    label?: Record<string | number, string>
  }
  icon?: {
    icon?: Record<string | number, LucideIcon>
    color?: Record<string | number, string>
  }
  actions?: {
    icon: LucideIcon
    label: string
    onClick: (row: T) => void
    visible?: (row: T) => boolean
    disabled?: (row: T) => boolean
  }[]
}

export interface TableFilter {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number'
  options?: { label: string; value: any }[]
}

export interface TableAction {
  icon?: LucideIcon
  label: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  onClick: (selected: string[]) => void
  visible?: (selected: string[]) => boolean
  disabled?: (selected: string[]) => boolean
}

export interface TableConfig<T = any> {
  title?: string
  description?: string
  columns: TableColumn<T>[]
  filters?: TableFilter[]
  actions?: TableAction[]
  bulkActions?: TableAction[]
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  pagination?: {
    enabled?: boolean
    perPage?: number
    perPageOptions?: number[]
  }
  selection?: {
    enabled?: boolean
    preserveSelected?: boolean
  }
  refreshInterval?: number
  emptyState?: {
    icon?: LucideIcon
    title?: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
}

export class TableBuilder<T = any> {
  private config: TableConfig<T> = {
    columns: [],
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  public description(description: string): this {
    this.config.description = description
    return this
  }

  public columns(columns: TableColumn<T>[]): this {
    this.config.columns = columns
    return this
  }

  public filters(filters: TableFilter[]): this {
    this.config.filters = filters
    return this
  }

  public actions(actions: TableAction[]): this {
    this.config.actions = actions
    return this
  }

  public bulkActions(actions: TableAction[]): this {
    this.config.bulkActions = actions
    return this
  }

  public defaultSort(key: string, direction: 'asc' | 'desc'): this {
    this.config.defaultSort = { key, direction }
    return this
  }

  public pagination(config: TableConfig['pagination']): this {
    this.config.pagination = config
    return this
  }

  public selection(config: TableConfig['selection']): this {
    this.config.selection = config
    return this
  }

  public refreshInterval(interval: number): this {
    this.config.refreshInterval = interval
    return this
  }

  public emptyState(config: TableConfig['emptyState']): this {
    this.config.emptyState = config
    return this
  }

  public build(): TableConfig<T> {
    return this.config
  }
}

export function createTable<T = any>(): TableBuilder<T> {
  return new TableBuilder<T>()
}

// Helper functions for common column types
export const columns = {
  text: (key: string, label: string, config: Partial<Omit<TableColumn, 'key' | 'label' | 'type'>> = {}): TableColumn => ({
    key,
    label,
    type: 'text',
    ...config,
  }),

  number: (key: string, label: string, config: Partial<Omit<TableColumn, 'key' | 'label' | 'type'>> = {}): TableColumn => ({
    key,
    label,
    type: 'number',
    align: 'right',
    ...config,
  }),

  boolean: (key: string, label: string, config: Partial<Omit<TableColumn, 'key' | 'label' | 'type'>> = {}): TableColumn => ({
    key,
    label,
    type: 'boolean',
    align: 'center',
    ...config,
  }),

  date: (key: string, label: string, config: Partial<Omit<TableColumn, 'key' | 'label' | 'type'>> = {}): TableColumn => ({
    key,
    label,
    type: 'date',
    ...config,
  }),

  badge: (
    key: string,
    label: string,
    options: { color: Record<string, string>; label: Record<string, string> },
    config: Partial<Omit<TableColumn, 'key' | 'label' | 'type' | 'badge'>> = {}
  ): TableColumn => ({
    key,
    label,
    type: 'badge',
    badge: options,
    align: 'center',
    ...config,
  }),

  actions: (
    key: string,
    actions: TableColumn['actions'],
    config: Partial<Omit<TableColumn, 'key' | 'label' | 'type' | 'actions'>> = {}
  ): TableColumn => ({
    key,
    label: '',
    type: 'actions',
    actions,
    align: 'right',
    width: '1%',
    ...config,
  }),
} 