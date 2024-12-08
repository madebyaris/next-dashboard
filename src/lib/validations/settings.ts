import { z } from "zod"

export const settingCreateSchema = z.object({
  key: z.string().min(1).max(255),
  value: z.string(),
})

export const settingUpdateSchema = z.object({
  value: z.string(),
})
