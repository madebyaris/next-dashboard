# Next.js Dashboard - Beginner's Guide

This guide will help you understand how to create dashboard pages and implement CRUD (Create, Read, Update, Delete) operations in this Next.js dashboard template.

## Table of Contents
- [Creating a New Dashboard Page](#creating-a-new-dashboard-page)
- [Implementing CRUD Operations](#implementing-crud-operations)
- [Common Components](#common-components)
- [Best Practices](#best-practices)
- [CLI Tools](#cli-tools)

## Creating a New Dashboard Page

### 1. Basic Page Structure
Create a new file in `src/app/dashboard/your-feature/page.tsx`:

```tsx
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Your Feature',
  description: 'Description of your feature',
}

export default function YourFeaturePage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Your Feature"
        text="Manage your feature here."
      >
        <Button>Add New</Button>
      </DashboardHeader>

      {/* Your content here */}
    </div>
  )
}
```

### 2. Adding Data Fetching
Add server-side data fetching using Prisma:

```tsx
import { prisma } from '@/lib/prisma'

async function getData() {
  return await prisma.yourModel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function YourFeaturePage() {
  const data = await getData()
  
  return (
    // Your JSX
  )
}
```

### 3. Adding Loading State
Create a loading state in `loading.tsx`:

```tsx
import { DashboardLoading } from '@/components/dashboard/loading'

export default function Loading() {
  return <DashboardLoading />
}
```

## Implementing CRUD Operations

### 1. Create Operation

First, create the form component (`src/components/your-feature/form.tsx`):

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // Add more fields as needed
})

export function YourFeatureForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/your-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('Failed to create')
      
      router.push('/dashboard/your-feature')
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </form>
    </Form>
  )
}
```

### 2. Read Operation

Create a table component (`src/components/your-feature/table.tsx`):

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

export function YourFeatureTable({ items }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/your-feature/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete')
      
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/your-feature/${item.id}/edit`)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting === item.id}
                  >
                    {isDeleting === item.id ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### 3. API Routes

Create API routes for CRUD operations (`src/app/api/your-feature/route.ts`):

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const items = await prisma.yourModel.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('[ITEMS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const item = await prisma.yourModel.create({
      data: json,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('[ITEMS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
```

## Common Components

### 1. Empty State
Use the empty state component when no data is available:

```tsx
import { EmptyState } from '@/components/dashboard/empty-state'
import { PlusCircle } from 'lucide-react'

<EmptyState
  title="No items found"
  description="Get started by creating a new item."
  icon={PlusCircle}
  action={
    <Button onClick={() => router.push('/dashboard/your-feature/new')}>
      Create Item
    </Button>
  }
/>
```

### 2. Error State
Handle errors gracefully:

```tsx
import { ErrorState } from '@/components/dashboard/error-state'

<ErrorState
  title="Something went wrong"
  description="Failed to load items. Please try again."
  action={
    <Button onClick={() => router.refresh()}>
      Retry
    </Button>
  }
/>
```

## Best Practices

1. **Data Validation**
   - Always validate data on both client and server
   - Use Zod schemas for type-safe validation
   - Handle all possible error cases

```typescript
// validation/your-feature.ts
import * as z from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
})
```

2. **Error Handling**
   - Use try-catch blocks for async operations
   - Show meaningful error messages to users
   - Log errors on the server

3. **Loading States**
   - Show loading indicators during async operations
   - Disable buttons while submitting
   - Use optimistic updates when possible

4. **Authentication**
   - Protect all API routes
   - Check user permissions
   - Handle unauthorized access gracefully

5. **Code Organization**
   - Keep components small and focused
   - Use shared components when possible
   - Follow the file structure conventions

Remember to:
- Always handle loading and error states
- Implement proper validation
- Add proper TypeScript types
- Follow the established coding patterns
- Test your changes before committing

## CLI Tools

### Creating Users via Terminal

The dashboard includes a CLI tool for creating users directly from the terminal. This is particularly useful for:
- Creating the initial admin user
- Batch user creation
- System automation

#### Usage

```bash
pnpm create-user --name="User Name" --email="user@example.com" --password="password" --role="ROLE"
```

#### Parameters

| Parameter    | Description                                      | Required | Default |
|-------------|--------------------------------------------------|----------|---------|
| --name      | User's full name                                 | Yes      | -       |
| --email     | User's email address                             | Yes      | -       |
| --password  | User's password (minimum 6 characters)           | Yes      | -       |
| --role      | User's role (ADMIN, EDITOR, or VIEWER)          | No       | VIEWER  |

### Creating Dashboard Pages

Generate new dashboard pages with a standardized structure using the CLI tool:

```bash
pnpm create-page --name="feature" --route="feature" --title="Feature Management" --description="Manage your features here"
```

#### Parameters

| Parameter    | Description                                      | Required | Default |
|-------------|--------------------------------------------------|----------|---------|
| --name      | Page component name (camelCase)                  | Yes      | -       |
| --route     | URL route path                                   | Yes      | -       |
| --title     | Page title                                       | Yes      | -       |
| --description| Page description                                | No       | -       |

#### Generated Files

The command creates a new directory in `src/app/dashboard/[route]` with:

1. `page.tsx`: Main page component with:
   - Page header with title and description
   - Add button
   - Loading state handling
   - Empty state component

2. `loading.tsx`: Loading state component

3. `error.tsx`: Error handling component

#### Example Usage

1. Create a products page:
```bash
pnpm create-page --name="products" --route="products" --title="Products" --description="Manage your products"
```

2. Create a settings page:
```bash
pnpm create-page --name="settings" --route="settings" --title="Settings" --description="Configure your dashboard"
```

This will create:
```
src/app/dashboard/products/
├── page.tsx
├── loading.tsx
└── error.tsx
```

The generated page includes:
- Role-based access control
- Loading states
- Error handling
- Empty state
- Standard layout structure
