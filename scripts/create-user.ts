import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
})

async function createUser() {
  const args = process.argv.slice(2)
  const userData: Record<string, string> = {}

  // Parse command line arguments
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    if (key.startsWith('--')) {
      userData[key.slice(2)] = value
    }
  })

  try {
    // Validate user data
    const validatedData = userSchema.parse(userData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      console.error('User with this email already exists')
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    console.log('User created successfully:')
    console.log(JSON.stringify(user, null, 2))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    } else {
      console.error('Error creating user:', error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createUser() 