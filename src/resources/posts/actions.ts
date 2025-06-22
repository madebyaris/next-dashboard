'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { 
  postSchema, 
  createpostSchema, 
  updatepostSchema,
  type post 
} from './schema'

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
  })

  if (!post) {
    throw new Error('post not found')
  }

  return post
}

export async function create(data: FormData) {
  const formData = {
    post: data.get('post'),
  }

  const validated = createpostSchema.parse(formData)

  const post = await prisma.post.create({
    data: validated,
  })

  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function update(id: string, data: FormData) {
  const formData = {
    post: data.get('post'),
  }

  const validated = updatepostSchema.parse(formData)

  const post = await prisma.post.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function delete_(id: string) {
  await prisma.post.delete({
    where: { id },
  })

  revalidatePath('/dashboard/posts')
}


export async function bulkDelete(ids: string[]) {
  await prisma.post.deleteMany({
    where: { id: { in: ids } },
  })

  revalidatePath('/dashboard/posts')
}

export async function exportToCsv(posts: post[]) {
  const csv = posts.map(item => 
    [item.post].join(',')
  ).join('\n')
  
  return csv
}
