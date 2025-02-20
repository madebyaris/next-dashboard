'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { productResource } from '@/resources/products'

export default function ProductsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>({ items: [], total: 0 })
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const result = await productResource.createApiHandlers().getList({
        page: pageIndex + 1,
        limit: pageSize,
      })
      setData(result)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on mount and when pagination changes
  useEffect(() => {
    loadData()
  }, [pageIndex, pageSize])

  return productResource.createLayout({
    children: (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => router.push('/dashboard/products/new')}>
            Create Product
          </Button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          productResource.createTable({
            data: data.items,
            pageCount: data.total,
            pageIndex,
            pageSize,
            onPaginationChange: (newPageIndex, newPageSize) => {
              setPageIndex(newPageIndex)
              setPageSize(newPageSize)
            },
          })
        )}
      </div>
    ),
  })
} 