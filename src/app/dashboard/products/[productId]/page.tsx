import { DashboardShell } from '@/components/dashboard/shell'
import { ProductForm } from '@/resources/product/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { product } from '@/resources/product'

type PageParams = { params: { productId: string } }

export default async function EditProductPage({ params }: PageParams) {
  const { productId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await product.actions.getById(productId)
  if (!item) {
    redirect('/dashboard/products')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = Object.fromEntries(formData.entries())
    await product.actions.update(productId, data)
    redirect('/dashboard/products')
  }

  return (
    <DashboardShell
      title="Edit Product"
      description="Edit product"
    >
      <ProductForm 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
  )
}