# Navigation

The dashboard uses a modular navigation system that is automatically generated from resource configurations.

## Structure

Navigation items are defined in each resource's configuration and automatically combined into a unified navigation structure.

## Configuration

### Resource Navigation
```typescript
// resources/posts/index.ts
export const posts = defineResource<Post>({
  navigation: {
    title: 'Posts',
    icon: FileText,
    path: routes.list,
    roles: ['ADMIN', 'EDITOR']
  }
})
```

### Navigation Types
```typescript
interface NavigationItem {
  title: string
  path: string
  icon: LucideIcon
  roles?: string[]
  children?: NavigationItem[]
}
```

## Features

- Role-based access control
- Icon support
- Nested navigation (groups)
- Active state tracking
- Mobile responsive

## Components

### Main Navigation
```typescript
// components/nav-main.tsx
import { NavigationItem } from '@/resources/config'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MainNavProps {
  items: NavigationItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.path
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
```

### Mobile Navigation
```typescript
// components/nav-mobile.tsx
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { NavigationItem } from '@/resources/config'

interface MobileNavProps {
  items: NavigationItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          {items.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-sm font-medium"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

## Usage

### Dashboard Layout
```typescript
// app/dashboard/layout.tsx
import { MainNav } from '@/components/nav-main'
import { MobileNav } from '@/components/nav-mobile'
import { getNavigation } from '@/lib/navigation'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const navigation = await getNavigation()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center">
          <MobileNav items={navigation} />
          <MainNav items={navigation} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

## Role-Based Access

### Checking Access
```typescript
// lib/auth.ts
export function hasAccess(item: NavigationItem, userRoles: string[]) {
  if (!item.roles) return true
  return item.roles.some(role => userRoles.includes(role))
}
```

### Filtering Navigation
```typescript
// lib/navigation.ts
export function filterNavigation(items: NavigationItem[], userRoles: string[]) {
  return items.filter(item => hasAccess(item, userRoles))
} 