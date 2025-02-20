import { z } from 'zod'

export const NoteSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string().min(1, 'title is required'),
  content: z.string().min(1, 'content is required'),
  type: z.enum(['personal', 'work', 'shopping']),
  isPinned: z.boolean()
})

export type Note = z.infer<typeof NoteSchema>