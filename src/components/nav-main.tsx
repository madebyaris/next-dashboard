'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { getNavigationByRole, isActiveRoute } from '@/resources/navigation'

export function NavMain() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role || 'VIEWER'
  const navigation = getNavigationByRole(role)

  return (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => (
        <div key={item.title}>
          <Link
            href={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
              isActiveRoute(item.path, pathname) && 'bg-accent'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </div>
      ))}
    </div>
  )
} 