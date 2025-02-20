'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { productResource } from '@/resources/products'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const product = await productResource.createApiHandlers().getOne(params.id)
        setData(product)
      } catch (error) {
        console.error('Failed to load product:', error)
        alert('Failed to load product')
        router.push('/dashboard/products')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id, router])

  const handleSubmit = async (updatedData: any) => {
    try {
      setIsSubmitting(true)
      await productResource.createApiHandlers().update(params.id, updatedData)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return productResource.createLayout({
      children: <div>Loading...</div>,
    })
  }

  return productResource.createLayout({
    children: productResource.createForm({
      initialData: data,
      onSubmit: handleSubmit,
      isSubmitting,
    }),
  })
} 