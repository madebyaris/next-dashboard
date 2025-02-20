import { z } from 'zod'

export const TagSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string().min(1, 'name is required'),
  color: z.string().min(1, 'color is required'),
  type: z.enum(['work', 'personal', 'project'])
})

export type Tag = z.infer<typeof TagSchema>