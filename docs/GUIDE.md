# Developer Guide

## Overview

This guide explains the core concepts, architecture, and development workflow of our Next.js dashboard project. It's designed to help you understand how to extend and maintain the codebase effectively.

## Core Concepts

### Resource-based Architecture

Our project uses a resource-based architecture where each resource (e.g., users, posts, products) is self-contained with its own:

```
src/resources/[resource]/
├── schema.ts     # Zod schema and types
├── actions.ts    # Server actions for CRUD
├── components.ts # Resource-specific components
├── routes.ts     # Route configuration
└── index.ts      # Resource configuration
```

### Server Actions

We use Next.js server actions for all CRUD operations, providing:
- Type safety
- Server-side validation
- Optimistic updates
- Error handling

Example:
```typescript
// src/resources/products/actions.ts
export async function create(data: ProductCreateInput) {
  const session = await getServerSession()
  if (!session) throw new Error('Unauthorized')

  return prisma.product.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })
}
```

### Type Safety

We maintain type safety through:
- Zod schemas for validation
- TypeScript for static typing
- Generated Prisma types
- Type-safe server actions

Example:
```typescript
// src/resources/products/schema.ts
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0),
  status: z.enum(['draft', 'published']),
})

export type Product = z.infer<typeof productSchema>
```

## Development Tools

### CLI Tools

1. Create Model (Interactive)
```bash
pnpm model:create
```
- Guides through model creation
- Generates all necessary files
- Updates database schema

2. Quick Model Creation
```bash
pnpm model:quick --name=Product --fields="name:string,price:number"
```
- Fast creation for simple models
- Supports all Zod types
- Auto-generates validation

3. Push Model to Database
```bash
pnpm model:push
```
- Selective model pushing
- Safe schema updates
- Preserves existing data

### Code Generation

Our CLI tools generate:
1. Prisma schema
2. Zod validation
3. TypeScript types
4. CRUD actions
5. React components
6. Route configuration

## Adding a New Resource

### 1. Create the Resource

```bash
pnpm model:create
```

Follow the prompts to specify:
- Resource name
- Fields and types
- Relations
- Validation rules

### 2. Customize Components

1. List View
```typescript
// src/resources/products/components.tsx
export function ProductList() {
  const products = useProducts()
  
  return (
    <DataTable
      columns={productColumns}
      data={products}
      filters={productFilters}
    />
  )
}
```

2. Form
```typescript
// src/resources/products/components.tsx
export function ProductForm() {
  const form = useForm<Product>({
    schema: productSchema,
  })
  
  return (
    <Form
      form={form}
      onSubmit={createProduct}
    >
      <FormField name="name" label="Name" />
      <FormField name="price" label="Price" type="number" />
    </Form>
  )
}
```

### 3. Add Navigation

```typescript
// src/config/navigation.ts
export const navigation = [
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
    role: ['ADMIN', 'EDITOR'],
  },
]
```

## Best Practices

### Performance

1. Use Server Components
```typescript
// src/resources/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}
```

2. Implement Caching
```typescript
// src/resources/products/actions.ts
export const getProducts = cache(async () => {
  return prisma.product.findMany()
})
```

3. Optimize Data Loading
```typescript
// src/resources/products/loading.tsx
export default function Loading() {
  return <ProductListSkeleton />
}
```

### Security

1. Validate Input
```typescript
// src/resources/products/actions.ts
export async function create(input: unknown) {
  const data = productSchema.parse(input)
  // Proceed with validated data
}
```

2. Check Permissions
```typescript
// src/resources/products/actions.ts
export async function update(id: string, data: ProductUpdateInput) {
  const session = await getServerSession()
  if (!session) throw new Error('Unauthorized')
  
  const product = await prisma.product.findUnique({ where: { id } })
  if (product.userId !== session.user.id) {
    throw new Error('Forbidden')
  }
  
  // Proceed with update
}
```

3. Protect Routes
```typescript
// src/middleware.ts
export const config = {
  matcher: ['/dashboard/:path*'],
}

export function middleware(request: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.redirect('/login')
  }
}
```

### Testing

1. Component Tests
```typescript
// src/resources/products/__tests__/components.test.tsx
describe('ProductList', () => {
  it('renders products correctly', () => {
    render(<ProductList products={mockProducts} />)
    expect(screen.getByText('Product 1')).toBeInTheDocument()
  })
})
```

2. Action Tests
```typescript
// src/resources/products/__tests__/actions.test.ts
describe('createProduct', () => {
  it('creates a product successfully', async () => {
    const product = await createProduct(mockProductData)
    expect(product).toMatchObject(mockProductData)
  })
})
```

## Deployment

1. Build
```bash
pnpm build
```

2. Database Migration
```bash
pnpm prisma migrate deploy
```

3. Start
```bash
pnpm start
```

## Troubleshooting

### Common Issues

1. Type Errors
- Run `pnpm prisma generate`
- Check Zod schema matches Prisma schema
- Verify component props

2. Database Errors
- Check connection string
- Verify schema changes
- Run `pnpm prisma db push`

3. Build Errors
- Clear `.next` directory
- Update dependencies
- Check for circular dependencies

### Getting Help

1. Check documentation
2. Search issue tracker
3. Ask in Discord community
4. Create detailed bug report
