'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, 
  FileText, 
  LogOut,
  LayoutDashboard,
  Settings
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: typeof LayoutDashboard
  roles: ('ADMIN' | 'EDITOR' | 'VIEWER')[]
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Posts',
    href: '/dashboard/posts',
    icon: FileText,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
]

interface DashboardNavProps {
  userRole: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <aside className="hidden w-64 border-r bg-gray-50/40 dark:bg-gray-800/40 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </div>
    </aside>
  )
} 