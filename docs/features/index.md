# Features Overview

## Core Features

### 1. Authentication
- [x] Email/Password authentication
- [x] OAuth providers (Google, GitHub)
- [x] Role-based access control
- [x] Protected routes
- [x] Session management

[View Authentication Documentation](./Authentication.md)

```typescript
// Example: Protected Route
import { requireAuth } from '@/lib/auth/guards'

export default async function DashboardPage() {
  const session = await requireAuth()
  return <div>Welcome, {session.user.name}</div>
}
```

### 2. Form Builder
- [x] Dynamic form generation
- [x] Field validation
- [x] Conditional fields
- [x] Custom components
- [x] Auto-save support

[View Forms Documentation](./Forms.md)

```typescript
// Example: Create Form
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

### 3. Data Table
- [x] Sorting and filtering
- [x] Pagination
- [x] Row selection
- [x] Custom cell rendering
- [x] Bulk actions

[View Data Table Documentation](./DataTable.md)

```typescript
// Example: Create Table
const table = createTable<Product>()
  .column({
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true
  })
  .pagination({
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  })
  .build()
```

## Quick Start

### 1. Authentication Setup

1. Configure NextAuth:
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      // ... credentials config
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  // ... other options
}
```

2. Protect routes:
```typescript
// src/middleware.ts
export default withAuth(
  function middleware(req) {
    // ... middleware logic
  }
)
```

### 2. Form Creation

1. Define schema:
```typescript
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(['draft', 'published'])
})
```

2. Create form:
```typescript
const productForm = createForm()
  .title('Product')
  .section({
    fields: [
      fields.text('name', 'Name'),
      fields.number('price', 'Price'),
      fields.select('status', 'Status', [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' }
      ])
    ]
  })
  .validation(productSchema)
  .build()
```

3. Use in component:
```typescript
export function ProductForm() {
  return (
    <Form
      config={productForm}
      onSubmit={async (data) => {
        await createProduct(data)
      }}
    />
  )
}
```

### 3. Table Implementation

1. Define columns:
```typescript
const columns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ value }) => (
      <Badge variant={value}>{value}</Badge>
    )
  }
]
```

2. Create table:
```typescript
const productsTable = createTable<Product>()
  .columns(columns)
  .pagination({
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  })
  .selection({
    enabled: true,
    actions: [
      {
        label: 'Delete',
        onClick: handleBulkDelete
      }
    ]
  })
  .build()
```

3. Use in component:
```typescript
export function ProductsTable() {
  const { data, loading } = useProducts()
  
  return (
    <DataTable
      config={productsTable}
      data={data}
      loading={loading}
    />
  )
}
```

## Common Patterns

### 1. Resource Creation
```typescript
// src/resources/products/index.ts
export const products = {
  schema: productSchema,
  form: productForm,
  table: productsTable,
  api: {
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    list: listProducts
  }
}
```

### 2. Protected Resources
```typescript
// src/app/dashboard/products/page.tsx
import { requireAuth } from '@/lib/auth/guards'
import { products } from '@/resources/products'

export default async function ProductsPage() {
  const session = await requireAuth()
  
  return (
    <DashboardShell>
      <DataTable
        config={products.table}
        data={await products.api.list()}
      />
    </DashboardShell>
  )
}
```

### 3. Form Submission
```typescript
// src/app/dashboard/products/new/page.tsx
export default function NewProductPage() {
  const router = useRouter()
  
  return (
    <Form
      config={products.form}
      onSubmit={async (data) => {
        await products.api.create(data)
        router.push('/dashboard/products')
      }}
    />
  )
}
```

## Best Practices

### 1. Authentication
- Always use HTTPS in production
- Implement proper password hashing
- Use secure session management
- Follow OAuth best practices

### 2. Forms
- Group related fields in sections
- Provide clear validation messages
- Implement auto-save for long forms
- Use appropriate field types

### 3. Tables
- Use server-side operations for large datasets
- Implement proper error states
- Add helpful empty states
- Optimize rendering performance

## CLI Tools

### Create Resource
```bash
pnpm create-resource --name="Product" --fields="
  name: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(['draft', 'published'])
"
```

### Create Page
```bash
pnpm create-page --name="products" --resource="Product" --type="list"
```

### Create Form
```bash
pnpm create-form --name="ProductForm" --resource="Product"
```

## Troubleshooting

### Authentication Issues
1. Check environment variables
2. Verify OAuth configuration
3. Check session settings
4. Review middleware configuration

### Form Issues
1. Validate schema definition
2. Check field conditions
3. Verify form submission
4. Review validation rules

### Table Issues
1. Check data structure
2. Verify column configuration
3. Review sorting/filtering logic
4. Check pagination settings 