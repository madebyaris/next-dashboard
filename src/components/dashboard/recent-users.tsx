'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { DashboardLoading } from './loading'
import { ErrorState } from './error-state'
import { prisma } from '@/lib/prisma'

interface User {
  id: string
  name: string | null
  email: string | null
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  createdAt: Date
}

async function getRecentUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return users
}

export async function RecentUsers() {
  const users = await getRecentUsers()

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
        </div>
      </CardContent>
    </Card>
  )
}
