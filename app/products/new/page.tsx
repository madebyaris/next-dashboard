'use client'

import { Resource, useResource } from '@/lib/resource'
import { productDefinition } from '@/resources/products'

export default function NewProductPage() {
  const resource = useResource(productDefinition)
  return <Resource resource={resource} mode="create" />
} 