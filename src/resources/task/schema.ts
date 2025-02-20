import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string().min(1, 'title is required'),
  description: z.string().min(1, 'description is required'),
  status: z.enum(['todo', 'in-progress', 'done'])
})

export type Task = z.infer<typeof TaskSchema>