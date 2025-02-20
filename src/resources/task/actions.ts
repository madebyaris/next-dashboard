'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type Task } from './schema'

export async function list() {
  try {
    const items = await db.task.findMany()
    return items
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.task.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    return null
  }
}

export async function create(data: Task) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data
    await db.task.create({
      data: rest,
    })
    revalidatePath('/dashboard/tasks')
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export async function update(id: string, data: Task) {
  try {
    const { createdAt, updatedAt, ...rest } = data
    await db.task.update({
      where: { id },
      data: rest,
    })
    revalidatePath('/dashboard/tasks')
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.task.delete({
      where: { id },
    })
    revalidatePath('/dashboard/tasks')
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}