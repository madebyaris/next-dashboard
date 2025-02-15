# Next.js Dashboard - Developer Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [CLI Tools](#cli-tools)
- [Components](#components)
- [Builders](#builders)
- [API](#api)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/next-dashboard.git
cd next-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/next_dashboard"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. Initialize the database:
```bash
pnpm prisma db push
```

6. Create an admin user:
```bash
pnpm create-user --name="Admin User" --email="admin@example.com" --password="admin123" --role="ADMIN"
```

7. Start the development server:
```bash
pnpm dev
```

### Creating a New Dashboard Page

1. Use the CLI to generate a page:
```bash
pnpm create-page --name="analytics" --route="analytics" --title="Analytics Dashboard"
```

2. Add widgets to your page:
```typescript
// src/app/(dashboard)/analytics/page.tsx
import { createPage } from '@/builders/page'
import { VisitorStats, PageViews, TopPages } from '@/components/widgets'

export default createPage('analytics')
  .title('Analytics Dashboard')
  .description('Track your website performance')
  .layout('dashboard')
  .widgets([
    VisitorStats,
    PageViews,
    TopPages
  ])
  .build()
```

### CRUD Operations

1. Create a new item:
```typescript
import { createResource } from '@/builders/resource'

const products = createResource('products')
  .create(async (data) => {
    const product = await db.product.create({ data })
    return product
  })
```

2. Read items:
```typescript
const products = createResource('products')
  .read(async (query) => {
    const products = await db.product.findMany({
      where: query.filters,
      orderBy: query.sort,
      skip: query.skip,
      take: query.take
    })
    return products
  })
```

3. Update an item:
```typescript
const products = createResource('products')
  .update(async (id, data) => {
    const product = await db.product.update({
      where: { id },
      data
    })
    return product
  })
```

4. Delete an item:
```typescript
const products = createResource('products')
  .delete(async (id) => {
    await db.product.delete({
      where: { id }
    })
  })
```

## Architecture

### Folder Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── ui/             # Base UI components
│   └── widgets/        # Dashboard widgets
├── lib/                # Utility functions
├── builders/           # Builder pattern implementations
├── models/             # Data models and business logic
└── resources/          # Resource configurations
```

### Key Concepts

#### Builder Pattern
The dashboard uses the builder pattern for configurable UI components:

- `PanelBuilder`: Configure dashboard panels
- `FormBuilder`: Build dynamic forms
- `TableBuilder`: Create data tables
- `WidgetBuilder`: Compose dashboard widgets

#### Resource-based Architecture
Resources are defined in `src/resources/` and include:
- Schema definition
- Form configuration
- Table configuration
- Widget configuration

Example:
```typescript
// src/resources/products/index.ts
export const productPanel = createPanel()
  .title('Products')
  .description('Manage your product catalog')
  .build()

export const productForm = createForm()
  .title('Product Details')
  .section({
    title: 'Basic Information',
    fields: [/*...*/]
  })
  .build()
```

## Authentication

### Role-Based Access Control
Three roles are available:
- `ADMIN`: Full access to all features
- `EDITOR`: Can manage content but not users
- `VIEWER`: Read-only access

### Protecting Routes
```typescript
// Middleware protection
export const config = {
  matcher: ['/dashboard/:path*']
}

// Component-level protection
const ProtectedPage = withAuth(Component, ['ADMIN', 'EDITOR'])
```

### Setup

1. Configure NextAuth:
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authConfig } from '@/config/auth'

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
```

2. Protect routes:
```typescript
// src/middleware.ts
import { withAuth } from '@/lib/auth'

export default withAuth(
  ['/dashboard/:path*'],
  ['/auth/login', '/auth/register']
)
```

### Role-Based Access

1. Define roles:
```typescript
export const roles = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const
```

2. Define permissions:
```typescript
export const permissions = {
  'products.create': [roles.ADMIN, roles.EDITOR],
  'products.delete': [roles.ADMIN]
}
```

3. Use in components:
```typescript
import { usePermission } from '@/hooks/auth'

export function DeleteButton() {
  const canDelete = usePermission('products.delete')
  if (!canDelete) return null
  return <Button>Delete</Button>
}
```

## CLI Tools

### Creating Users
```bash
pnpm create-user --name="John Doe" --email="john@example.com" --password="secure123" --role="ADMIN"
```

### Creating Pages
```bash
pnpm create-page --name="analytics" --route="analytics" --title="Analytics Dashboard"
```

### Creating Models
```bash
pnpm create-model --name="Product" --fields="
  name: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(['active', 'inactive'])
"
```

## Components

### Dashboard Shell
```typescript
<DashboardShell
  title="Dashboard"
  description="Welcome to your dashboard"
>
  {/* Content */}
</DashboardShell>
```

### Data Table
```typescript
<DataTable<Product>
  title="Products"
  columns={productTable.columns}
  data={products}
  filters={productTable.filters}
  pagination={{
    enabled: true,
    perPage: 10
  }}
/>
```

### Widgets
```typescript
<Grid>
  <StatsWidget
    value={totalProducts}
    label="Total Products"
    icon={Package}
  />
  <ChartWidget
    title="Sales"
    data={salesData}
  />
  <ListWidget
    title="Top Products"
    items={topProducts}
  />
</Grid>
```

## Builders

### Panel Builder
```typescript
const panel = createPanel()
  .title('Products')
  .description('Manage your products')
  .navigation([
    {
      title: 'Overview',
      path: '/dashboard/products',
      icon: LayoutDashboard
    }
  ])
  .build()
```

### Form Builder
```typescript
const form = createForm()
  .title('Product Details')
  .section({
    title: 'Basic Information',
    fields: [
      fields.text('name', 'Product Name'),
      fields.number('price', 'Price'),
      fields.select('status', 'Status', [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' }
      ])
    ]
  })
  .build()
```

### Table Builder
```typescript
const table = createTable<Product>()
  .title('Products')
  .columns([
    columns.text('name', 'Name', { sortable: true }),
    columns.number('price', 'Price', { 
      format: value => `$${value.toFixed(2)}` 
    }),
    columns.badge('status', 'Status', {
      color: {
        draft: 'gray',
        published: 'green'
      }
    })
  ])
  .build()
```

### Widget Builder
```typescript
const widgets = [
  widgets.stats({
    value: totalProducts,
    label: 'Total Products',
    icon: Package,
    trend: {
      value: 12.5,
      direction: 'up'
    }
  }),
  widgets.chart({
    title: 'Sales Trend',
    type: 'line',
    data: salesData
  })
]
```

## API

### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

### Error Handling
```typescript
try {
  // Your code
} catch (error) {
  if (error instanceof ValidationError) {
    return errorResponse(VALIDATION_ERROR, 400)
  }
  return errorResponse(SERVER_ERROR, 500)
}
```

### Rate Limiting
```typescript
export async function POST(request: Request) {
  const rateLimit = await rateLimit(request, {
    limit: 10,
    windowMs: 60 * 1000 // 1 minute
  })

  if (rateLimit) return rateLimit
  // Your code
}
```

## Best Practices

### Type Safety
- Use TypeScript for all files
- Define interfaces for all data structures
- Use Zod for runtime validation

### Performance
- Use React Suspense for loading states
- Implement pagination for large datasets
- Cache API responses where appropriate

### Security
- Validate all user input
- Use RBAC for access control
- Rate limit API endpoints
- Sanitize data before display

### Code Style
- Use consistent naming conventions
- Write descriptive comments
- Follow the DRY principle
- Use ESLint and Prettier

### Testing
- Write unit tests for utilities
- Test API endpoints
- Test component rendering
- Use mock data for testing

### Error Handling
- Use try-catch blocks
- Log errors appropriately
- Show user-friendly error messages
- Handle edge cases

### State Management
- Use React Context for global state
- Keep component state minimal
- Use React Query for server state
- Implement optimistic updates
