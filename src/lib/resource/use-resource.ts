import { useMemo } from 'react'
import { type ResourceDefinition } from './types'
import { ResourceBuilder } from './builder'

export function useResource(definition: ResourceDefinition) {
  return useMemo(() => new ResourceBuilder(definition).build(), [definition])
}

// Example usage:
// const productResource = useResource({
//   name: 'Product',
//   fields: {
//     name: { type: 'string', required: true },
//     price: { type: 'number', required: true },
//     description: { type: 'string' },
//   },
//   display: {
//     pageSize: 10,
//     columns: ['name', 'price'],
//   },
//   endpoints: {
//     base: '/api/products',
//   },
// }) 