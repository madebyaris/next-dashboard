'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { productResource } from '@/resources/products'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      await productResource.createApiHandlers().create(data)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return productResource.createLayout({
    children: productResource.createForm({
      onSubmit: handleSubmit,
      isSubmitting,
    }),
  })
} 