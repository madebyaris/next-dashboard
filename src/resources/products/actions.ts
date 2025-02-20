import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { type Product, type ProductCreateInput, type ProductUpdateInput, productSchema } from './schema'

export async function getProducts(options: {
  page?: number
  limit?: number
  search?: string
} = {}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const { page = 1, limit = 10, search = '' } = options
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({
      where: {
        userId: session.user.id,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
    }),
  ])

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProduct(id: string): Promise<Product> {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const product = await prisma.product.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!product) throw new Error('Product not found')
  return product
}

export async function createProduct(data: ProductCreateInput): Promise<Product> {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const validated = productSchema.parse(data)

  return prisma.product.create({
    data: {
      ...validated,
      userId: session.user.id,
    },
  })
}

export async function updateProduct(id: string, data: ProductUpdateInput): Promise<Product> {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const validated = productSchema.partial().parse(data)

  return prisma.product.update({
    where: { id, userId: session.user.id },
    data: validated,
  })
}

export async function deleteProduct(id: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  await prisma.product.delete({
    where: { id, userId: session.user.id },
  })
} 