'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { DashboardLoading } from './loading'
import { ErrorState } from './error-state'

interface User {
  id: string
  name: string | null
  email: string | null
  createdAt: string
}

export function RecentUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.users.list()
        setUsers(data.slice(0, 5)) // Only show 5 most recent users
      } catch (err) {
        setError('Failed to load recent users')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) return <DashboardLoading />
  if (error) return <ErrorState title={error} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {users.map((user) => (
            <div key={user.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <Link 
                  href={`/dashboard/users/${user.id}`}
                  className="text-sm font-medium leading-none hover:underline"
                >
                  {user.name || user.email}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
