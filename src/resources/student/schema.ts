import { z } from 'zod'

const dateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string') {
    return new Date(arg)
  }
  return arg
}, z.date())

export const StudentSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  studentId: z.string().min(1, 'Student ID is required'),
  dateOfBirth: dateSchema,
  grade: z.number().int(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'ON_LEAVE']),
  major: z.string(),
  gpa: z.number().min(0).max(4),
  enrollmentDate: dateSchema,
  isInternational: z.boolean(),
})

export type Student = z.infer<typeof StudentSchema>