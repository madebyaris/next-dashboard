'use client'

import { Resource, useResource } from '@/lib/resource'
import { productDefinition } from '@/resources/products'

interface Props {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: Props) {
  const resource = useResource(productDefinition)
  return <Resource resource={resource} mode="edit" id={params.id} />
} 