import { DashboardShell } from '@/components/dashboard/shell'
import { ProductForm } from '@/resources/product/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { product } from '@/resources/product'
import { type Product } from '@/resources/product/schema'

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      status: formData.get('status') as Product['status'],
    }

    await product.actions.create(data)
    redirect('/dashboard/products')
  }

  return (
    <DashboardShell
      title="Create Product"
      description="Create a new product"
    >
      <ProductForm onSubmit={handleSubmit} />
    </DashboardShell>
  )
}