# Next.js Dashboard - Developer Instructions

## Development Workflow

### 1. Creating a New Resource

1. Create the resource schema:
```typescript
// src/resources/products/schema.ts
import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  price: z.number().min(0, 'Price must be positive'),
  status: z.enum(['draft', 'published']),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Product = z.infer<typeof productSchema>
```

2. Define resource routes:
```typescript
// src/resources/products/routes.ts
export const routes = {
  list: '/dashboard/products',
  new: '/dashboard/products/new',
  edit: (id: string) => `/dashboard/products/${id}`,
  api: {
    list: '/api/products',
    create: '/api/products',
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
  }
} as const
```

3. Implement resource actions:
```typescript
// src/resources/products/actions.ts
import { routes } from './routes'
import type { Product } from './schema'

export async function list() {
  const response = await fetch(routes.api.list)
  const data = await response.json()
  return data
}

export async function create(data: Omit<Product, 'id'>) {
  const response = await fetch(routes.api.create, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function edit(id: string) {
  window.location.href = routes.edit(id)
}

export async function delete_(id: string) {
  await fetch(routes.api.delete(id), { method: 'DELETE' })
}
```

4. Create resource components:
```typescript
// src/resources/products/components/table.tsx
import { DataTable } from '@/components/ui/data-table'
import { products } from '..'
import type { Product } from '../schema'

interface ProductTableProps {
  data: Product[]
}

export function Table({ data }: ProductTableProps) {
  return (
    <DataTable
      columns={products.table.columns}
      data={data}
      searchKey="title"
      pageSize={10}
    />
  )
}
```

5. Define the resource:
```typescript
// src/resources/products/index.ts
import { FileText } from 'lucide-react'
import { productSchema, type Product } from './schema'
import { routes } from './routes'
import * as productActions from './actions'
import { defineResource } from '../config'
import { columns } from '@/builders/table'

const { delete_, ...actions } = productActions

export const products = defineResource<Product>({
  name: 'products',
  path: routes.list,
  navigation: {
    title: 'Products',
    icon: FileText,
    path: routes.list,
    roles: ['ADMIN', 'EDITOR'],
  },
  schema: productSchema,
  table: {
    columns: [
      columns.text('title', 'Title', { sortable: true, searchable: true }),
      columns.text('description', 'Description'),
      columns.number('price', 'Price', { sortable: true }),
      columns.badge('status', 'Status', {
        color: {
          draft: 'gray',
          published: 'green',
        },
      }),
      columns.actions('id', [
        {
          icon: FileText,
          label: 'Edit',
          onClick: (row: Product) => actions.edit(row.id),
        },
        {
          icon: Trash2,
          label: 'Delete',
          onClick: (row: Product) => delete_(row.id),
        },
      ]),
    ],
  },
  actions: {
    ...actions,
    delete: delete_,
  },
})
```

### 2. Creating a Dashboard Widget

1. Create a new widget component:
```typescript
// src/components/widgets/ProductStats.tsx
import { createWidget } from '@/builders/widget'
import { Card } from '@/components/ui/card'

export const ProductStats = createWidget('product-stats')
  .title('Product Statistics')
  .description('Overview of product performance')
  .data(async () => {
    const stats = await db.product.aggregate({
      _count: true,
      _avg: { price: true }
    })
    return stats
  })
  .render(({ data, isLoading }) => {
    if (isLoading) return <ProductStatsLoading />
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Stat label="Total Products" value={data._count} />
            <Stat label="Average Price" value={formatCurrency(data._avg.price)} />
          </div>
        </CardContent>
      </Card>
    )
  })
```

2. Add the widget to a dashboard:
```typescript
// src/app/(dashboard)/page.tsx
import { ProductStats } from '@/components/widgets/ProductStats'

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ProductStats />
      {/* Other widgets */}
    </div>
  )
}
```

### 3. Adding Authentication Rules

1. Define roles and permissions:
```typescript
// src/config/auth.ts
export const roles = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const

export const permissions = {
  'products.create': [roles.ADMIN, roles.EDITOR],
  'products.update': [roles.ADMIN, roles.EDITOR],
  'products.delete': [roles.ADMIN],
  'products.view': [roles.ADMIN, roles.EDITOR, roles.VIEWER]
}
```

2. Protect your routes:
```typescript
// src/middleware.ts
import { withAuth } from '@/lib/auth'

export default withAuth(
  // Your protected routes
  ['/dashboard/:path*', '/settings/:path*'],
  // Public routes
  ['/auth/login', '/auth/register']
)
```

3. Use in components:
```typescript
import { usePermission } from '@/hooks/auth'

export function ProductActions() {
  const canCreate = usePermission('products.create')
  const canDelete = usePermission('products.delete')
  
  return (
    <div>
      {canCreate && <Button>Create Product</Button>}
      {canDelete && <Button variant="destructive">Delete</Button>}
    </div>
  )
}
```

### 4. Customizing the Theme

1. Update your theme configuration:
```typescript
// src/config/theme.ts
import { createTheme } from '@/builders/theme'

export const theme = createTheme()
  .colors({
    primary: {
      DEFAULT: '#0070f3',
      foreground: '#ffffff'
    }
  })
  .fonts({
    sans: ['Inter', 'sans-serif']
  })
  .spacing({
    content: '1rem',
    gutter: '2rem'
  })
```

2. Use theme values in components:
```typescript
import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-content shadow-sm',
        className
      )}
      {...props}
    />
  )
}
```

### 5. Best Practices

1. **Type Safety**
   - Always use TypeScript
   - Define interfaces for all data structures
   - Use Zod for runtime validation

2. **Component Structure**
   - Keep components small and focused
   - Use composition over inheritance
   - Implement loading states for all async components

3. **State Management**
   - Use React Query for server state
   - Use Context for global UI state
   - Keep component state minimal

4. **Performance**
   - Implement proper loading states
   - Use pagination for large datasets
   - Optimize images and assets
   - Implement caching strategies

5. **Error Handling**
   - Use error boundaries
   - Implement proper error states
   - Log errors appropriately

6. **Testing**
   - Write unit tests for utilities
   - Write integration tests for components
   - Test error states and edge cases

### 6. Common Issues

1. **Authentication Issues**
   - Check NextAuth configuration
   - Verify environment variables
   - Check role permissions

2. **Database Issues**
   - Run migrations
   - Check connection string
   - Verify schema changes

3. **Build Issues**
   - Clear `.next` directory
   - Update dependencies
   - Check TypeScript errors

### 7. Deployment

1. **Environment Setup**
   - Set all required environment variables
   - Configure database connection
   - Set up authentication providers

2. **Build Process**
   ```bash
   pnpm build
   ```

3. **Database Migration**
   ```bash
   pnpm prisma migrate deploy
   ```

4. **Start Server**
   ```bash
   pnpm start
   ```

### 8. Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Review security advisories
   - Update documentation

2. **Monitoring**
   - Set up error tracking
   - Monitor performance
   - Track usage metrics

3. **Backup**
   - Regular database backups
   - Version control
   - Documentation updates 