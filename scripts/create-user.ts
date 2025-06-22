#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import prompts from 'prompts'
import chalk from 'chalk'

const prisma = new PrismaClient()

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
})

async function createUser() {
  console.log(chalk.blue.bold('👤 Create New User\n'))

  const args = process.argv.slice(2)
  let userData: Record<string, string> = {}

  // Parse command line arguments if provided
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    if (key.startsWith('--')) {
      userData[key.slice(2)] = value
    }
  })

  // If no command line args, use interactive prompts
  if (Object.keys(userData).length === 0) {
    const responses = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'Enter user name:',
        initial: 'Test User',
        validate: (value: string) => value.length > 0 ? true : 'Name is required'
      },
      {
        type: 'text',
        name: 'email',
        message: 'Enter email address:',
        initial: 'test@example.com',
        validate: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value) ? true : 'Please enter a valid email'
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password:',
        validate: (value: string) => value.length >= 6 ? true : 'Password must be at least 6 characters'
      },
      {
        type: 'select',
        name: 'role',
        message: 'Select user role:',
        choices: [
          { title: 'Admin (Full access)', value: 'ADMIN' },
          { title: 'Editor (Can create/edit)', value: 'EDITOR' },
          { title: 'Viewer (Read only)', value: 'VIEWER' },
        ],
        initial: 2 // Default to VIEWER
      }
    ])

    if (!responses.name || !responses.email || !responses.password) {
      console.log(chalk.yellow('Operation cancelled.'))
      process.exit(0)
    }

    userData = responses
  }

  try {
    // Validate user data
    const validatedData = userSchema.parse(userData)

    console.log(chalk.yellow('\nCreating user...'))

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      console.error(chalk.red('❌ User with this email already exists'))
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

    console.log(chalk.green('\n✅ User created successfully!'))
    console.log(chalk.cyan('\nUser Details:'))
    console.log(`${chalk.bold('ID:')} ${user.id}`)
    console.log(`${chalk.bold('Name:')} ${user.name}`)
    console.log(`${chalk.bold('Email:')} ${user.email}`)
    console.log(`${chalk.bold('Role:')} ${user.role}`)
    console.log(`${chalk.bold('Created:')} ${user.createdAt.toLocaleString()}`)

    console.log(chalk.blue('\n🚀 You can now login with these credentials!'))
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(chalk.red('❌ Validation error:'))
      error.errors.forEach(err => {
        console.error(chalk.red(`  - ${err.path.join('.')}: ${err.message}`))
      })
    } else {
      console.error(chalk.red('❌ Error creating user:'), error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Show usage if --help is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(chalk.blue.bold('👤 Create User Script\n'))
  console.log('Usage:')
  console.log('  Interactive mode: pnpm create-user')
  console.log('  Command line:     pnpm create-user --name="John Doe" --email="john@example.com" --password="secret123" --role="ADMIN"')
  console.log('')
  console.log('Roles:')
  console.log('  ADMIN  - Full access to all features')
  console.log('  EDITOR - Can create and edit content')
  console.log('  VIEWER - Read-only access')
  process.exit(0)
}

createUser() 