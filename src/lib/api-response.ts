import { NextResponse } from 'next/server'

export type ApiResponse<T = any> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

export const AUTH_ERROR = 'Unauthorized'
export const FORBIDDEN_ERROR = 'Forbidden'
export const NOT_FOUND_ERROR = 'Not found'
export const VALIDATION_ERROR = 'Validation error'
export const SERVER_ERROR = 'Internal server error' 