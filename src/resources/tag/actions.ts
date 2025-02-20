'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type Tag } from './schema'

export async function list() {
  try {
    const items = await db.tag.findMany()
    return items
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.tag.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching tag:', error)
    return null
  }
}

export async function create(data: Tag) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data
    await db.tag.create({
      data: rest,
    })
    revalidatePath('/dashboard/tags')
  } catch (error) {
    console.error('Error creating tag:', error)
    throw error
  }
}

export async function update(id: string, data: Tag) {
  try {
    const { createdAt, updatedAt, ...rest } = data
    await db.tag.update({
      where: { id },
      data: rest,
    })
    revalidatePath('/dashboard/tags')
  } catch (error) {
    console.error('Error updating tag:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.tag.delete({
      where: { id },
    })
    revalidatePath('/dashboard/tags')
  } catch (error) {
    console.error('Error deleting tag:', error)
    throw error
  }
}