#!/usr/bin/env node
import { PrismaClient, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import prompts from 'prompts'
import chalk from 'chalk'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
})

async function createUser() {
  try {
    console.log(chalk.cyan('\n👤 Create a new user\n'))

    const response = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'Name:',
      },
      {
        type: 'text',
        name: 'email',
        message: 'Email:',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
      },
      {
        type: 'select',
        name: 'role',
        message: 'Role:',
        choices: [
          { title: 'Admin', value: 'ADMIN' },
          { title: 'Editor', value: 'EDITOR' },
          { title: 'Viewer', value: 'VIEWER' },
        ],
      },
    ])

    // Validate input
    const validatedData = userSchema.parse(response)

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create user
    const prisma = new PrismaClient()
    try {
      const user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: validatedData.role,
        },
      })

      console.log(chalk.green('\n✅ User created successfully!'))
      console.log('\nUser details:')
      console.log(chalk.dim('Name:'), user.name)
      console.log(chalk.dim('Email:'), user.email)
      console.log(chalk.dim('Role:'), user.role)

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error(chalk.red('\nError: Email already exists'))
        } else {
          console.error(chalk.red('\nDatabase error:'), error.message)
        }
      } else if (error instanceof Error) {
        console.error(chalk.red('\nError:'), error.message)
      } else {
        console.error(chalk.red('\nUnknown error occurred'))
      }
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(chalk.red('\nValidation errors:'))
      error.errors.forEach(err => {
        console.error(chalk.red(`- ${err.path.join('.')}: ${err.message}`))
      })
    } else if (error instanceof Error) {
      console.error(chalk.red('\nError:'), error.message)
    } else {
      console.error(chalk.red('\nUnknown error occurred'))
    }
    process.exit(1)
  }
}

createUser() 