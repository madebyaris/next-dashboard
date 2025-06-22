import { z } from 'zod'

// Zod schema for validation
export const postSchema = z.object({
  id: z.string().cuid(),
  post: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createpostSchema = postSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updatepostSchema = createpostSchema.partial()

export type post = z.infer<typeof postSchema>
export type Createpost = z.infer<typeof createpostSchema>
export type Updatepost = z.infer<typeof updatepostSchema>