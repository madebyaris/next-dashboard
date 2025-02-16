# **Project Overview**
This project is a modern Next.js 15+ dashboard boilerplate featuring:
- **Resource-based Architecture** for modular and maintainable code
- **Server Actions** for type-safe CRUD operations
- **Authentication** using **NextAuth.js** with role-based access
- **Beautiful UI** using **ShadcnUI** and **Tailwind CSS**

---

## **Application Structure**
### **Core Pages**
- `/`  
  Landing page with project overview and authentication options
- `/auth/login`  
  Login page with email/password authentication
- `/auth/register`  
  Registration page for new users
- `/dashboard`  
  Main dashboard with widgets and statistics

### **Resource Pages**
Each resource (e.g., users, posts, products) follows a consistent structure:
- `/dashboard/[resource]`  
  List view with advanced data table
- `/dashboard/[resource]/new`  
  Create form with validation
- `/dashboard/[resource]/[id]`  
  Edit form with validation and delete option

### **Profile Management**
- `/dashboard/profile`  
  User profile management with settings

---

## **Resource-based Architecture**

### Resource Structure
```
src/resources/[resource]/
├── schema.ts     # Zod schema and types
├── actions.ts    # Server actions for CRUD
├── components.ts # Resource-specific components
├── routes.ts     # Route configuration
└── index.ts      # Resource configuration
```

### Resource Configuration
```typescript
// src/resources/products/index.ts
export const productResource = {
  name: 'Product',
  route: 'products',
  schema: productSchema,
  components: {
    list: ProductList,
    form: ProductForm,
  },
  actions: {
    list,
    create,
    update,
    remove,
  },
}
```

---

## **Authentication with NextAuth.js**
- **Session Strategy**: JWT with role-based access
- **Roles**:
  - `ADMIN`: Full access to all resources
  - `EDITOR`: Create and edit own resources
  - `VIEWER`: Read-only access

### Role-Based Access Control
```typescript
// Example of role-based middleware
export const withRoles = (roles: Role[]) => {
  return async (req: NextRequest) => {
    const session = await getServerSession()
    if (!session || !roles.includes(session.user.role)) {
      return new Response('Unauthorized', { status: 401 })
    }
    return NextResponse.next()
  }
}
```

---

## **Server Actions**

### CRUD Operations
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

### Validation
```typescript
// src/resources/products/schema.ts
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0),
  status: z.enum(['draft', 'published']),
})
```

---

## **CLI Tools**

### Interactive Model Creation
```bash
pnpm model:create
```
Guides you through creating:
- Model schema
- Database fields
- Relations
- Dashboard pages

### Quick Model Creation
```bash
pnpm model:quick --name=Product --fields="name:string,price:number"
```

### Database Updates
```bash
pnpm model:push
```
Selectively push models to database

---

## **Project Setup**

### 1. Environment
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database
```bash
pnpm prisma generate
pnpm prisma db push
```

### 3. Development
```bash
pnpm dev
```

---

## **Best Practices**

### Resource Creation
1. Define schema with Zod
2. Create server actions
3. Implement components
4. Configure resource
5. Add to navigation

### Type Safety
- Use Zod for validation
- Leverage TypeScript
- Implement proper error handling

### Performance
- Use server components
- Implement caching
- Optimize data fetching

### Security
- Validate all inputs
- Implement RBAC
- Use server actions
- Protect sensitive routes

---

## **Development Workflow**

### 1. Create Resource
```bash
pnpm model:create
```

### 2. Customize Components
- Modify list view
- Adjust form fields
- Add custom actions

### 3. Add to Navigation
```typescript
// src/config/navigation.ts
export const navigation = [
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
  },
]
```

### 4. Test & Deploy
- Verify CRUD operations
- Check permissions
- Test responsive design
- Deploy changes