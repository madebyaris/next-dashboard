import { z } from 'zod'

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean(),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z.object({
    name: z.string().nullable(),
  }),
})

export type Post = z.infer<typeof postSchema>

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  authorId: z.string(),
})

export const updatePostSchema = createPostSchema.partial() 