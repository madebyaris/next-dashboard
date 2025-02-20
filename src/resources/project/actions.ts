'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type Project } from './schema'

export async function list() {
  try {
    const items = await db.project.findMany()
    return items
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.project.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function create(data: Project) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data
    await db.project.create({
      data: rest,
    })
    revalidatePath('/dashboard/projects')
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function update(id: string, data: Project) {
  try {
    const { createdAt, updatedAt, ...rest } = data
    await db.project.update({
      where: { id },
      data: rest,
    })
    revalidatePath('/dashboard/projects')
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.project.delete({
      where: { id },
    })
    revalidatePath('/dashboard/projects')
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}