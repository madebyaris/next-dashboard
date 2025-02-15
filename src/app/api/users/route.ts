import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, AUTH_ERROR, FORBIDDEN_ERROR, VALIDATION_ERROR } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
})

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (session.user.role !== 'ADMIN') return errorResponse(FORBIDDEN_ERROR, 403)

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return successResponse(users)
  } catch (error) {
    console.error('[USERS_GET]', error)
    return errorResponse('Failed to fetch users')
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (session.user.role !== 'ADMIN') return errorResponse(FORBIDDEN_ERROR, 403)

    const json = await request.json()
    const validatedData = userCreateSchema.parse(json)

    const user = await prisma.user.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return successResponse(user, 'User created successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(VALIDATION_ERROR, 400)
    }
    console.error('[USERS_POST]', error)
    return errorResponse('Failed to create user')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (session.user.role !== 'ADMIN') return errorResponse(FORBIDDEN_ERROR, 403)

    const json = await request.json()
    const { id, ...data } = json
    const validatedData = userUpdateSchema.parse(data)

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return successResponse(user, 'User updated successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(VALIDATION_ERROR, 400)
    }
    console.error('[USERS_PUT]', error)
    return errorResponse('Failed to update user')
  }
} 