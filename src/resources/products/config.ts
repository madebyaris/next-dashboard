import { Role } from '@prisma/client'
import { type JsonSchema } from '@jsonforms/core'

export interface ResourceConfig<T> {
  name: string
  path: string
  api: string
  schema: JsonSchema
  uiSchema: any
  permissions: {
    create: Role[]
    read: Role[]
    update: Role[]
    delete: Role[]
  }
  options: {
    defaultSort?: keyof T
    defaultSortDir?: 'asc' | 'desc'
    searchFields?: (keyof T)[]
    filterFields?: (keyof T)[]
    pageSize?: number
  }
  actions?: {
    beforeCreate?: (data: Partial<T>) => Promise<Partial<T>>
    afterCreate?: (data: T) => Promise<void>
    beforeUpdate?: (data: Partial<T>) => Promise<Partial<T>>
    afterUpdate?: (data: T) => Promise<void>
    beforeDelete?: (id: string) => Promise<void>
    afterDelete?: (id: string) => Promise<void>
  }
}

export interface Product {
  id: string
  name: string
  price: number
  description?: string
  status: 'draft' | 'published' | 'archived'
  category: 'electronics' | 'clothing' | 'food' | 'other'
  inStock: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export const productConfig: ResourceConfig<Product> = {
  name: 'Product',
  path: '/dashboard/products',
  api: '/api/products',
  permissions: {
    create: [Role.ADMIN, Role.EDITOR],
    read: [Role.ADMIN, Role.EDITOR, Role.VIEWER],
    update: [Role.ADMIN, Role.EDITOR],
    delete: [Role.ADMIN],
  },
  options: {
    defaultSort: 'createdAt',
    defaultSortDir: 'desc',
    searchFields: ['name', 'description'],
    filterFields: ['status', 'category', 'inStock'],
    pageSize: 10,
  },
  schema: {
    type: 'object',
    required: ['name', 'price', 'status'],
    properties: {
      name: {
        type: 'string',
        title: 'Product Name',
        description: 'Name of the product',
        minLength: 1,
        maxLength: 100,
      },
      price: {
        type: 'number',
        title: 'Price',
        description: 'Product price',
        minimum: 0,
      },
      description: {
        type: 'string',
        title: 'Description',
        description: 'Product description',
        maxLength: 500,
      },
      status: {
        type: 'string',
        title: 'Status',
        description: 'Product status',
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
      },
      category: {
        type: 'string',
        title: 'Category',
        description: 'Product category',
        enum: ['electronics', 'clothing', 'food', 'other'],
        default: 'other',
      },
      inStock: {
        type: 'boolean',
        title: 'In Stock',
        description: 'Whether the product is in stock',
        default: true,
      },
    },
  },
  uiSchema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
        options: {
          placeholder: 'Enter product name',
        },
      },
      {
        type: 'Control',
        scope: '#/properties/price',
        options: {
          placeholder: '0.00',
        },
      },
      {
        type: 'Control',
        scope: '#/properties/description',
        options: {
          multi: true,
          placeholder: 'Enter product description',
        },
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/status',
          },
          {
            type: 'Control',
            scope: '#/properties/category',
          },
        ],
      },
      {
        type: 'Control',
        scope: '#/properties/inStock',
        options: {
          toggle: true,
        },
      },
    ],
  },
  actions: {
    beforeCreate: async (data) => {
      // You can transform or validate data before creation
      return data
    },
    afterCreate: async (data) => {
      // You can perform actions after creation (e.g., notifications)
      console.log('Product created:', data)
    },
    beforeUpdate: async (data) => {
      // You can transform or validate data before update
      return data
    },
    afterUpdate: async (data) => {
      // You can perform actions after update
      console.log('Product updated:', data)
    },
    beforeDelete: async (id) => {
      // You can perform checks before deletion
      console.log('About to delete product:', id)
    },
    afterDelete: async (id) => {
      // You can perform cleanup after deletion
      console.log('Product deleted:', id)
    },
  },
} 