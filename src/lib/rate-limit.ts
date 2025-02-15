import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  limit: number
  windowMs: number
}

const defaultConfig: RateLimitConfig = {
  limit: 100,
  windowMs: 60 * 1000, // 1 minute
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = defaultConfig
) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const now = Date.now()
  const key = `${ip}:${request.nextUrl.pathname}`

  // Clean up old entries
  Array.from(rateLimitStore.entries()).forEach(([storedKey, data]) => {
    if (data.resetTime < now) {
      rateLimitStore.delete(storedKey)
    }
  })

  const currentLimit = rateLimitStore.get(key)

  if (!currentLimit) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return null
  }

  if (currentLimit.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return null
  }

  currentLimit.count++
  rateLimitStore.set(key, currentLimit)

  if (currentLimit.count > config.limit) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: Math.ceil((currentLimit.resetTime - now) / 1000),
      },
      { status: 429 }
    )
  }

  return null
} 