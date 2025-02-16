import { LucideIcon } from 'lucide-react'

export interface Column<T> {
  key: keyof T
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

export interface TableConfig<T> {
  title: string
  columns: Column<T>[]
  filters?: Filter[]
  defaultSort?: {
    key: keyof T
    direction: 'asc' | 'desc'
  }
  pagination?: {
    enabled: boolean
    perPage: number
    perPageOptions: number[]
  }
  selection?: {
    enabled: boolean
  }
}

export class TableBuilder<T> {
  private config: TableConfig<T> = {
    title: '',
    columns: [],
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  public columns(columns: Column<T>[]): this {
    this.config.columns = columns
    return this
  }

  public filters(filters: Filter[]): this {
    this.config.filters = filters
    return this
  }

  public defaultSort(key: keyof T, direction: 'asc' | 'desc'): this {
    this.config.defaultSort = { key, direction }
    return this
  }

  public pagination(config: {
    enabled: boolean
    perPage: number
    perPageOptions: number[]
  }): this {
    this.config.pagination = config
    return this
  }

  public selection(config: { enabled: boolean }): this {
    this.config.selection = config
    return this
  }

  public build(): TableConfig<T> {
    return this.config
  }
}

export const columns = {
  text: <T>(
    key: keyof T,
    label: string,
    options: {
      sortable?: boolean
      searchable?: boolean
      filterable?: boolean
    } = {}
  ): Column<T> => ({
    key,
    label,
    type: 'text',
    ...options,
  }),

  number: <T>(
    key: keyof T,
    label: string,
    options: {
      sortable?: boolean
      format?: (value: number) => string
    } = {}
  ): Column<T> => ({
    key,
    label,
    type: 'number',
    ...options,
  }),

  badge: <T>(
    key: keyof T,
    label: string,
    options: {
      color: Record<string, string>
      valueLabel: Record<string, string>
    }
  ): Column<T> => ({
    key,
    label,
    type: 'badge',
    color: options.color,
    valueLabel: options.valueLabel,
  }),

  actions: <T>(
    key: keyof T,
    actions: {
      icon: LucideIcon
      label: string
      onClick: (row: T) => void
      visible?: (row: T) => boolean
    }[]
  ): Column<T> => ({
    key,
    label: '',
    type: 'actions',
    actions,
  }),
}

export function createTable<T>(): TableBuilder<T> {
  return new TableBuilder<T>()
} 