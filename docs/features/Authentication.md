# Authentication Guide

This guide covers implementing authentication in your Next.js dashboard using NextAuth.js.

## Basic Setup

1. **Install Dependencies**:
```bash
npm install next-auth @prisma/client bcryptjs
npm install -D @types/bcryptjs
```

2. **Configure NextAuth.js**:

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error('User not found')
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      return token
    },
  },
}
```

3. **Create API Route**:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

## Protected Routes

1. **Middleware for Route Protection**:

```typescript
// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
  ],
}
```

2. **Protected API Routes**:

```typescript
// lib/api-middlewares.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function withAuth(handler: Function) {
  return async function (req: Request, ...args: any[]) {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return handler(req, ...args)
  }
}

// Usage in API route:
import { withAuth } from '@/lib/api-middlewares'

export const GET = withAuth(async (req: Request) => {
  // Your protected API logic here
})
```

## Login Form

```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (!result?.error) {
        router.push(callbackUrl)
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full p-2 border rounded-md"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          className="w-full p-2 border rounded-md"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

## Session Management

1. **Client-Side Session**:

```tsx
'use client'

import { useSession } from 'next-auth/react'

export function ProfileButton() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="flex items-center gap-2">
      <span>{session.user.name}</span>
      <button onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  )
}
```

2. **Server-Side Session**:

```tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  )
}
```

## Best Practices

1. **Password Hashing**:
```typescript
import { hash } from 'bcryptjs'

async function hashPassword(password: string) {
  return await hash(password, 12)
}

// Usage when creating user
const hashedPassword = await hashPassword(password)
await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
  },
})
```

2. **Error Handling**:
```typescript
export async function login(
  credentials: Record<'email' | 'password', string>
) {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      ...credentials,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

3. **Session Types**:
```typescript
// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
  }
}
```

4. **Protected API Wrapper**:
```typescript
export function withProtectedApi(handler: Function) {
  return async function (req: Request, ...args: any[]) {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session) {
        return new NextResponse('Unauthorized', { status: 401 })
      }

      // Add user info to request
      const reqWithUser = Object.assign(req, { user: session.user })
      
      return handler(reqWithUser, ...args)
    } catch (error) {
      console.error('[API_ERROR]', error)
      return new NextResponse('Internal Error', { status: 500 })
    }
  }
}
```
