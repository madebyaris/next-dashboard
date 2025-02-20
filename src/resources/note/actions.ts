'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type Note } from './schema'

export async function list() {
  try {
    const items = await db.note.findMany()
    return items
  } catch (error) {
    console.error('Error fetching notes:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.note.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching note:', error)
    return null
  }
}

export async function create(data: Note) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data
    await db.note.create({
      data: rest,
    })
    revalidatePath('/dashboard/notes')
  } catch (error) {
    console.error('Error creating note:', error)
    throw error
  }
}

export async function update(id: string, data: Note) {
  try {
    const { createdAt, updatedAt, ...rest } = data
    await db.note.update({
      where: { id },
      data: rest,
    })
    revalidatePath('/dashboard/notes')
  } catch (error) {
    console.error('Error updating note:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.note.delete({
      where: { id },
    })
    revalidatePath('/dashboard/notes')
  } catch (error) {
    console.error('Error deleting note:', error)
    throw error
  }
}