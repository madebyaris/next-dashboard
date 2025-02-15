# Authentication

## Overview
The authentication system is built using NextAuth.js, providing secure, flexible, and scalable authentication with support for multiple providers, role-based access control, and session management.

## Features

### 1. Core Features
- [x] Email/Password authentication
- [x] OAuth providers (Google, GitHub)
- [x] Role-based access control
- [x] Session management
- [x] Protected routes
- [x] Middleware protection
- [x] Token refresh
- [x] Remember me
- [x] Password reset
- [x] Email verification

### 2. Security
- [x] Password hashing
- [x] CSRF protection
- [x] Rate limiting
- [x] Session invalidation
- [x] Secure cookie handling
- [x] HTTP-only cookies
- [x] XSS protection
- [x] Secure headers

### 3. User Management
- [x] User registration
- [x] Profile management
- [x] Role management
- [x] Permission management
- [x] Account linking
- [x] Account deletion
- [x] Session management
- [x] Activity logging

## Implementation

### 1. NextAuth Configuration
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      }
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        }
      }
      return token
    },
  },
}
```

### 2. Middleware Protection
```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
```

### 3. Role-Based Guards
```typescript
// src/lib/auth/guards.ts
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  return session
}

export async function withRole(role: string) {
  const session = await requireAuth()
  
  if (session.user.role !== role) {
    redirect('/dashboard')
  }
  
  return session
}
```

## Components

### 1. Auth Provider
```typescript
// src/components/providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 2. Login Form
```typescript
// src/components/auth/login-form.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.boolean().default(false),
})

export function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'
  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })
  
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })
      
      if (result?.error) {
        form.setError('root', { message: 'Invalid credentials' })
        return
      }
      
      window.location.href = from
    } catch (error) {
      form.setError('root', { message: 'Something went wrong' })
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

## Usage Examples

### 1. Protected Route
```typescript
// src/app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth/guards'

export default async function DashboardPage() {
  const session = await requireAuth()
  
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  )
}
```

### 2. Admin Route
```typescript
// src/app/admin/page.tsx
import { requireAdmin } from '@/lib/auth/guards'

export default async function AdminPage() {
  const session = await requireAdmin()
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  )
}
```

### 3. Client-Side Protection
```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function AdminComponent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }
  
  if (session.user.role !== 'ADMIN') {
    router.push('/dashboard')
    return null
  }
  
  return <div>Admin Only Content</div>
}
```

## Best Practices

1. **Security**
   - Use HTTPS in production
   - Implement proper password hashing
   - Use secure session management
   - Implement rate limiting
   - Follow OAuth best practices
   - Use HTTP-only cookies
   - Implement CSRF protection

2. **User Experience**
   - Clear error messages
   - Proper loading states
   - Remember user preferences
   - Smooth redirects
   - Progressive enhancement
   - Proper form validation

3. **Performance**
   - Optimize token size
   - Implement proper caching
   - Use efficient database queries
   - Minimize client-side code
   - Implement proper error handling

4. **Maintenance**
   - Use TypeScript
   - Write tests
   - Document code
   - Monitor errors
   - Log important events
   - Keep dependencies updated

## Testing

### 1. Unit Tests
```typescript
describe('Auth Guards', () => {
  it('should redirect unauthenticated users', async () => {
    const redirect = jest.fn()
    
    await requireAuth()
    
    expect(redirect).toHaveBeenCalledWith('/auth/login')
  })
})
```

### 2. Integration Tests
```typescript
describe('Login Flow', () => {
  it('should authenticate user with valid credentials', async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email: 'test@example.com',
      password: 'password',
    })
    
    expect(result?.error).toBeUndefined()
  })
})
```

## Future Improvements

1. **Enhanced Security**
   - [ ] Two-factor authentication
   - [ ] Hardware key support
   - [ ] Biometric authentication
   - [ ] Session management UI
   - [ ] Advanced rate limiting

2. **User Management**
   - [ ] User impersonation
   - [ ] Advanced role management
   - [ ] Team management
   - [ ] Organization support
   - [ ] Audit logging

3. **Integration**
   - [ ] More OAuth providers
   - [ ] SAML support
   - [ ] LDAP integration
   - [ ] Custom auth flows
   - [ ] API key management
