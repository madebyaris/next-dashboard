import { LayoutDashboard } from 'lucide-react'
import type { NavigationItem } from './config'
import { posts } from './posts'
import { student } from './student'

// Add new navigation items here
export const navigation: NavigationItem[] = [
  {
    title: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
  posts.navigation,
  student.navigation,
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