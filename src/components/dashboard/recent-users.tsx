'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecentUsers } from '@/lib/actions/users'

interface User {
  id: string
  name: string | null
  email: string | null
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  createdAt: Date
}

export function RecentUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getRecentUsers()
        setUsers(data)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {users.map((user) => (
            <div key={user.id} className="flex items-center">
              <div className="space-y-1">
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className="font-medium hover:underline"
                >
                  {user.name || user.email || 'Unknown User'}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {user.role.toLowerCase()} • joined{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-sm text-muted-foreground">No users yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
