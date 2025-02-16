'use server'

import { prisma } from '@/lib/prisma'

export async function getRecentUsers() {
  try {
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return users
  } catch (error) {
    console.error('[GET_RECENT_USERS]', error)
    throw new Error('Failed to fetch recent users')
  }
} 