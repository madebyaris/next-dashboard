# Next.js Dashboard - Developer Instructions

## Development Workflow

### 1. Creating a New Resource

1. Use the CLI to generate the model:
```bash
pnpm create-model --name="Product" --fields="
  name: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(['active', 'inactive'])
"
```

2. Create the resource configuration:
```typescript
// src/resources/products/index.ts
import { createResource } from '@/builders/resource'
import { z } from 'zod'

export const products = createResource('products')
  .title('Products')
  .description('Manage your products')
  .schema(z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be positive'),
    status: z.enum(['active', 'inactive'])
  }))
  .table(table => table
    .column('name', 'Name')
    .column('price', 'Price', { format: 'currency' })
    .column('status', 'Status', { type: 'badge' })
  )
  .form(form => form
    .section('Basic Information')
    .field('name', 'text')
    .field('price', 'number')
    .field('status', 'select', {
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    })
  )
```

3. Add the resource to your navigation:
```typescript
// src/config/navigation.ts
import { products } from '@/resources/products'

export const navigation = [
  {
    title: 'Products',
    href: products.getPath(),
    icon: Package
  }
]
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