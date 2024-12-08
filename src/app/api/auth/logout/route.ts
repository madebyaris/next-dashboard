import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // Clear the auth token cookie
  cookies().delete('auth-token')
  
  return NextResponse.json({ success: true })
}
