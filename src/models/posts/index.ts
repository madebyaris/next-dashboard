import { prisma } from '@/lib/prisma'
import { postSchema, type Post } from './types'

export async function getPosts(options: {
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

export async function getPostById(id: string) {
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

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) {
  const validated = postSchema.parse(data)

  return await prisma.post.create({
    data: validated,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function updatePost(id: string, data: Partial<Post>) {
  const validated = postSchema.partial().parse(data)

  return await prisma.post.update({
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
}

export async function deletePost(id: string) {
  return await prisma.post.delete({
    where: { id },
  })
}

export async function getPostStats() {
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