'use server'

import { prisma } from '@/lib/prisma'

export async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error('[GET_RECENT_POSTS]', error)
    throw new Error('Failed to fetch recent posts')
  }
} 