import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  authorId: z.string(),
})

export type Post = z.infer<typeof postSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
  author: {
    name: string | null
  }
} 