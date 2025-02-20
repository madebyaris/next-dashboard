import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string().min(1, 'name is required'),
  description: z.string().min(1, 'description is required'),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.number(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  progress: z.number(),
  isPublic: z.boolean(),
  category: z.string().min(1, 'category is required'),
  tags: z.string(),
  teamSize: z.number().int(),
  manager: z.string().min(1, 'manager is required')
})

export type Project = z.infer<typeof ProjectSchema>