import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'

type Role = 'ADMIN' | 'EDITOR' | 'VIEWER'

export interface User {
  id: string
  email: string
  name: string | null
  role: Role
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string | null
    role: Role
  }
  
  interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string | null
    role: Role
  }
}

const authSecret = process.env.NEXTAUTH_SECRET
if (!authSecret) {
  console.warn(
    'Warning: NEXTAUTH_SECRET is not set in environment variables. Using a default secret. Please set NEXTAUTH_SECRET in production.'
  )
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          },
        })

        if (!user || !user.email) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      }
      return session
    },
  },
  secret: authSecret || 'fallback-secret-do-not-use-in-production',
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function login(email: string, password: string): Promise<User> {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

  if (result?.error) {
    throw new Error(result.error)
  }

  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Failed to get user after login')
  }

  return user
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to sign up')
  }

  return login(email, password)
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false })
}
