import { type Role } from '@prisma/client'

export interface Field {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum'
  label: string
  description?: string
  required?: boolean
  default?: any
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    options?: string[]
  }
  ui?: {
    component?: 'input' | 'textarea' | 'select' | 'toggle' | 'date'
    placeholder?: string
    hint?: string
    width?: 'full' | 'half' | 'third'
    group?: string
  }
}

export interface ResourceDefinition {
  // Basic Info
  name: string
  description?: string
  
  // Fields definition
  fields: Record<string, Field>
  
  // Access control
  roles?: {
    create?: Role[]
    read?: Role[]
    update?: Role[]
    delete?: Role[]
  }

  // Display options
  display?: {
    listFields?: string[]
    searchFields?: string[]
    filterFields?: string[]
    sortFields?: string[]
    defaultSort?: string
    defaultSortDir?: 'asc' | 'desc'
    pageSize?: number
    groups?: {
      name: string
      fields: string[]
    }[]
  }

  // Lifecycle hooks
  hooks?: {
    beforeCreate?: (data: any) => Promise<any>
    afterCreate?: (data: any) => Promise<void>
    beforeUpdate?: (data: any) => Promise<any>
    afterUpdate?: (data: any) => Promise<void>
    beforeDelete?: (id: string) => Promise<void>
    afterDelete?: (id: string) => Promise<void>
  }

  // API configuration
  api?: {
    basePath?: string
    endpoints?: {
      list?: string
      create?: string
      update?: string
      delete?: string
    }
  }
} 