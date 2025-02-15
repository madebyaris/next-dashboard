import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, AUTH_ERROR, FORBIDDEN_ERROR, VALIDATION_ERROR } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const postCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

const postUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const authorId = searchParams.get('authorId')

    const where = {
      ...(published !== null && { published: published === 'true' }),
      ...(authorId && { authorId }),
      // Viewers can only see published posts
      ...(session.user.role === 'VIEWER' && { published: true }),
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse(posts)
  } catch (error) {
    console.error('[POSTS_GET]', error)
    return errorResponse('Failed to fetch posts')
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (!['ADMIN', 'EDITOR'].includes(session.user.role || '')) {
      return errorResponse(FORBIDDEN_ERROR, 403)
    }

    const json = await request.json()
    const validatedData = postCreateSchema.parse(json)

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return successResponse(post, 'Post created successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(VALIDATION_ERROR, 400)
    }
    console.error('[POSTS_POST]', error)
    return errorResponse('Failed to create post')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)

    const json = await request.json()
    const { id, ...data } = json
    const validatedData = postUpdateSchema.parse(data)

    // Get the post to check ownership
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return errorResponse('Post not found', 404)
    }

    // Only allow ADMIN or the post author to update
    if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
      return errorResponse(FORBIDDEN_ERROR, 403)
    }

    const post = await prisma.post.update({
      where: { id },
      data: validatedData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return successResponse(post, 'Post updated successfully')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(VALIDATION_ERROR, 400)
    }
    console.error('[POSTS_PUT]', error)
    return errorResponse('Failed to update post')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Post ID is required', 400)
    }

    // Get the post to check ownership
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return errorResponse('Post not found', 404)
    }

    // Only allow ADMIN or the post author to delete
    if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
      return errorResponse(FORBIDDEN_ERROR, 403)
    }

    await prisma.post.delete({
      where: { id },
    })

    return successResponse(null, 'Post deleted successfully')
  } catch (error) {
    console.error('[POSTS_DELETE]', error)
    return errorResponse('Failed to delete post')
  }
}
