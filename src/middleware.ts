import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

interface DecodedToken {
  id: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

const ROLE_ACCESS_MAP = {
  '/dashboard/users': ['ADMIN'],
  '/dashboard/posts': ['ADMIN', 'EDITOR'],
  '/dashboard/profile': ['ADMIN', 'EDITOR', 'VIEWER'],
}

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth-token')
  const path = request.nextUrl.pathname

  // Check if the request is for the dashboard
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verify token and get user role
      const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as DecodedToken
      
      // Check role-based access
      for (const [pattern, roles] of Object.entries(ROLE_ACCESS_MAP)) {
        if (path.startsWith(pattern) && !roles.includes(decoded.role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check if user is already authenticated and trying to access auth pages
  if (token && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
