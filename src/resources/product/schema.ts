import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  status: z.enum(['draft', 'published', 'archived']),
})

export type Product = z.infer<typeof ProductSchema>