import { type ResourceDefinition } from '@/lib/resource'

export const productDefinition: ResourceDefinition = {
  name: 'Product',
  fields: {
    name: {
      type: 'string',
      label: 'Name',
      description: 'The name of the product',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
      },
    },
    price: {
      type: 'number',
      label: 'Price',
      description: 'The price of the product in USD',
      required: true,
      validation: {
        minimum: 0,
        maximum: 1000000,
      },
    },
    description: {
      type: 'string',
      label: 'Description',
      description: 'A detailed description of the product',
      validation: {
        maxLength: 1000,
      },
    },
    category: {
      type: 'string',
      label: 'Category',
      description: 'The category this product belongs to',
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Food', 'Other'],
    },
    inStock: {
      type: 'boolean',
      label: 'In Stock',
      description: 'Whether the product is currently in stock',
      default: true,
    },
    tags: {
      type: 'array',
      label: 'Tags',
      description: 'Tags to help categorize and search for the product',
      items: {
        type: 'string',
      },
    },
  },
  display: {
    pageSize: 10,
    columns: ['name', 'price', 'category', 'inStock'],
    groups: [
      {
        label: 'Basic Information',
        fields: ['name', 'price', 'category'],
      },
      {
        label: 'Additional Details',
        fields: ['description', 'inStock', 'tags'],
      },
    ],
  },
  endpoints: {
    base: '/api/products',
  },
  hooks: {
    beforeCreate: async (data) => {
      // Add created timestamp
      return {
        ...data,
        createdAt: new Date().toISOString(),
      }
    },
    beforeUpdate: async (data) => {
      // Add updated timestamp
      return {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    },
    afterCreate: async (data) => {
      // Could trigger notifications, analytics, etc.
      console.log('Product created:', data)
    },
    afterUpdate: async (data) => {
      // Could trigger notifications, analytics, etc.
      console.log('Product updated:', data)
    },
    afterDelete: async (id) => {
      // Could trigger cleanup tasks, notifications, etc.
      console.log('Product deleted:', id)
    },
  },
}