import type { Prisma } from '@prisma/client'

// Base response type
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// User types
export type SafeUser = Omit<Prisma.UserGetPayload<{}>, 'password'> & {
  password?: never
}

export interface UsersResponse extends ApiResponse {
  data?: SafeUser[]
}

export interface UserResponse extends ApiResponse {
  data?: SafeUser
}

// Post types
export interface PostWithAuthor extends Prisma.PostGetPayload<{
  include: { author: true }
}> {
  author: SafeUser
}

export interface PostsResponse extends ApiResponse {
  data?: PostWithAuthor[]
}

export interface PostResponse extends ApiResponse {
  data?: PostWithAuthor
}

// Pagination types
export interface PaginatedResponse<T> extends ApiResponse {
  data?: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

// Search types
export interface SearchParams extends PaginationParams {
  query?: string
  filters?: Record<string, string | number | boolean>
}

// Settings types
export interface UserSettings {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  notifications?: {
    email?: boolean
    push?: boolean
  }
}

export interface SettingsResponse extends ApiResponse {
  data?: UserSettings
} 