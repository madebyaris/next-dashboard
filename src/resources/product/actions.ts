'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type Product } from './schema'

export async function list() {
  try {
    const items = await db.product.findMany()
    return items
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.product.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function create(data: Product) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data
    await db.product.create({
      data: rest,
    })
    revalidatePath('/dashboard/products')
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function update(id: string, data: Product) {
  try {
    const { createdAt, updatedAt, ...rest } = data
    await db.product.update({
      where: { id },
      data: rest,
    })
    revalidatePath('/dashboard/products')
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.product.delete({
      where: { id },
    })
    revalidatePath('/dashboard/products')
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}