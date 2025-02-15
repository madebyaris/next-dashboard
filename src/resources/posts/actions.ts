'use server'

import { routes } from './routes'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { type Post, createPostSchema, updatePostSchema } from './schema'

export async function list(options: {
  page?: number
  limit?: number
  where?: any
  orderBy?: any
} = {}) {
  const { page = 1, limit = 10, where = {}, orderBy = { createdAt: 'desc' } } = options

  const skip = (page - 1) * limit

  const [total, items] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: {
          select: {
            name: true,
          },
        },
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

export async function getById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  return post
}

export async function create(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) {
  const validated = createPostSchema.parse(data)

  const post = await prisma.post.create({
    data: validated,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  revalidatePath(routes.list)
  redirect(routes.list)
}

export async function update(id: string, data: Partial<Post>) {
  const validated = updatePostSchema.parse(data)

  const post = await prisma.post.update({
    where: { id },
    data: validated,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  revalidatePath(routes.list)
  redirect(routes.list)
}

export async function delete_(id: string) {
  await prisma.post.delete({
    where: { id },
  })

  revalidatePath(routes.list)
}

export async function edit(id: string) {
  redirect(routes.edit(id))
}

export async function archive(id: string) {
  await update(id, { published: false })
}

export async function getStats() {
  const [total, published] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
  ])

  return {
    totalPosts: total,
    publishedPosts: published,
    draftPosts: total - published,
  }
} 