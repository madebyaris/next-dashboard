'use client'

import { Resource, useResource } from '@/lib/resource'
import { productDefinition } from '@/resources/products'

export default function ProductsPage() {
  const resource = useResource(productDefinition)
  return <Resource resource={resource} mode="list" />
} 