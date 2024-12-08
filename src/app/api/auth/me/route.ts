import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const token = cookies().get('auth-token')

    if (!token) {
      return NextResponse.json(null)
    }

    // Verify token
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return NextResponse.json(null)
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(null)
  }
}
