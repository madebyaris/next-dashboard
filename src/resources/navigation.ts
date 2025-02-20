import { LayoutDashboard, Settings, ShoppingBag } from 'lucide-react'
import type { NavigationItem } from './config'
import { Role } from '@prisma/client'

// Add new navigation items here
export interface NavItem {
  title: string
  href: string
  icon?: string
  roles?: Role[]
}

export const navigation: NavigationItem[] = [
  {
    title: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: [Role.ADMIN, Role.EDITOR, Role.VIEWER],
  },
  {
    title: 'Products',
    path: '/dashboard/products',
    icon: ShoppingBag,
    roles: [Role.ADMIN, Role.EDITOR],
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
    roles: [Role.ADMIN],
  },
]

export function getNavigationByRole(role: string) {
  return navigation.filter(item => {
    if (!item.roles) return true
    return item.roles.includes(role)
  })
}

export function isActiveRoute(path: string, currentPath: string) {
  if (path === '/dashboard' && currentPath === '/dashboard') {
    return true
  }
  if (path === '/dashboard') {
    return false
  }
  return currentPath.startsWith(path)
} 