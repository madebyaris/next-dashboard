'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { type Student } from './schema'

export async function list() {
  try {
    const students = await db.student.findMany()
    return students
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}

export async function getById(id: string) {
  try {
    return await db.student.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return null
  }
}

export async function create(data: Student) {
  try {
    await db.student.create({
      data,
    })
    revalidatePath('/dashboard/students')
  } catch (error) {
    console.error('Error creating student:', error)
    throw error
  }
}

export async function update(id: string, data: Student) {
  try {
    await db.student.update({
      where: { id },
      data,
    })
    revalidatePath('/dashboard/students')
  } catch (error) {
    console.error('Error updating student:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    await db.student.delete({
      where: { id },
    })
    revalidatePath('/dashboard/students')
  } catch (error) {
    console.error('Error deleting student:', error)
    throw error
  }
}