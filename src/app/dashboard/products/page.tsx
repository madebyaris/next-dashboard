import { DashboardShell } from '@/components/dashboard/shell'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { product } from '@/resources/product'

export const metadata = {
  title: 'Products',
  description: 'Manage your products',
}

export default async function ProductPage() {
  const data = await product.actions.list()

  return (
    <DashboardShell
      title="Products"
      description="Manage your products"
      action={
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      }
    >
      <ProductList data={data} />
    </DashboardShell>
  )
}

function ProductList({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={product.list.columns}
      data={data}
      searchKey="name"
      pageSize={10}
    />
  )
}