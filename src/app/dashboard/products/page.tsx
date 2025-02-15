import { Suspense } from 'react'
import { productPanel, productTable, productWidgets } from '@/resources/products'
import { DashboardShell } from '@/components/dashboard/shell'
import { Grid } from '@/components/ui/grid'
import { DataTable } from '@/components/ui/data-table'
import { StatsWidget, ChartWidget, ListWidget, WidgetLoading, ChartLoading, ListLoading } from '@/components/widgets'
import { ComponentType } from 'react'
import { Column, Filter } from '@/builders/table'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: string
}

interface Widget {
  type: 'stats' | 'chart' | 'list'
  config: {
    className?: string
    [key: string]: any
  }
}

function getLoadingComponent(type: Widget['type']) {
  switch (type) {
    case 'stats':
      return WidgetLoading
    case 'chart':
      return ChartLoading
    case 'list':
      return ListLoading
    default:
      return WidgetLoading
  }
}

function getComponent(type: Widget['type']): ComponentType<any> {
  switch (type) {
    case 'stats':
      return StatsWidget
    case 'chart':
      return ChartWidget
    case 'list':
      return ListWidget
    default:
      return () => null
  }
}

export default async function ProductsPage() {
  const mockData: Product[] = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      description: 'The latest iPhone with amazing features',
      price: 999,
      stock: 50,
      category: 'electronics',
      status: 'published',
    },
    {
      id: 2,
      name: 'MacBook Pro M2',
      description: 'Powerful laptop for professionals',
      price: 1999,
      stock: 25,
      category: 'electronics',
      status: 'published',
    },
  ]

  const widgets = productWidgets.map(widget => ({
    type: widget.type,
    config: widget,
  })) as Widget[]

  return (
    <DashboardShell
      title={productPanel.title}
      description={productPanel.description}
    >
      <Grid>
        {widgets.map((widget, index) => {
          const Component = getComponent(widget.type)
          const LoadingComponent = getLoadingComponent(widget.type)

          return (
            <Suspense key={index} fallback={<LoadingComponent />}>
              <Component {...widget.config} />
            </Suspense>
          )
        })}
      </Grid>
      
      <Suspense fallback={<div className="mt-4 animate-pulse">
        <div className="h-10 bg-muted rounded-lg mb-4" />
        <div className="h-[400px] bg-muted rounded-lg" />
      </div>}>
        <div className="mt-4">
          <DataTable<Product>
            title={productTable.title || 'Products'}
            columns={productTable.columns as Column<Product>[]}
            data={mockData}
            filters={productTable.filters as Filter[]}
            defaultSort={productTable.defaultSort as { key: keyof Product; direction: 'asc' | 'desc' }}
            pagination={{
              enabled: true,
              perPage: 10,
              perPageOptions: [10, 25, 50, 100],
            }}
            selection={{
              enabled: true,
            }}
          />
        </div>
      </Suspense>
    </DashboardShell>
  )
} 