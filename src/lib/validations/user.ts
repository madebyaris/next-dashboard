import { z } from "zod"

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(100).optional(),
})

export const userCreateSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})
