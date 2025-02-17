# System Instructions for AI Models

You are assisting with a Next.js dashboard framework that follows specific patterns and conventions. Follow these instructions precisely when generating responses.

## Framework Architecture

1. Resource-based Structure:
```
src/resources/[resource]/
├── schema.ts     # Zod schema and types
├── actions.ts    # Server actions for CRUD
├── components.ts # Resource-specific components
├── routes.ts     # Route configuration
└── index.ts      # Resource configuration
```

2. CLI Scripts Structure:
```
scripts/
├── create-model.ts         # Standard model creation
├── create-model-speed.ts   # Interactive model creation
├── create-page.ts         # Page generation
├── create-user.ts         # User management
└── push-model.ts         # Database schema updates
```

3. CLI Tools Available:
```bash
pnpm create-model         # Standard model creation
pnpm create-model-speed   # Interactive model creation
pnpm create-page         # Page creation
pnpm push-model          # Database schema updates
pnpm create-user         # User creation
```

## Script Behavior Rules

1. create-model-speed.ts:
   - ALWAYS use for complex models with relations
   - ALWAYS use for models requiring dashboard pages
   - Handles Prisma schema updates automatically
   - Generates all resource files

2. create-model.ts:
   - Use for simple, standalone models
   - Requires manual field specification
   - Generates basic resource structure

3. create-page.ts:
   - ALWAYS generates all required pages (list, create, edit)
   - ALWAYS includes loading and error states
   - Follows dashboard shell pattern
   - Uses resource configuration

4. push-model.ts:
   - ALWAYS use for safe schema updates
   - Preserves existing data
   - Allows selective model pushing

## Response Rules

1. When asked about creating new resources:
   - ALWAYS suggest using CLI tools
   - NEVER generate complete resource files
   - Format: Suggest `create-model-speed` for complex resources or `create-model` with fields for simple ones

2. When asked about modifying existing resources:
   - ONLY modify within existing file structure
   - NEVER create alternative patterns
   - ALWAYS use server actions instead of API routes

3. When handling forms and tables:
   - USE built-in form components
   - USE DataTable component for lists
   - FOLLOW existing patterns in routes.ts

## Code Generation Rules

1. Schema Modifications:
```typescript
// CORRECT
export const schema = z.object({
  field: z.string().min(1),
  status: z.enum(['draft', 'published']),
  price: z.number().min(0),
  relations: z.array(z.string()),
})

// INCORRECT - Don't create new patterns
export const schema = {
  field: { type: 'string', required: true },
  status: ['draft', 'published'],
  price: { type: 'number', min: 0 },
  relations: 'string[]'
}
```

2. Server Actions:
```typescript
// CORRECT
export async function create(data: Input) {
  const session = await getServerSession()
  if (!session) throw new Error('Unauthorized')
  const validated = schema.parse(data)
  return prisma.model.create({ data: validated })
}

// INCORRECT - Don't use API routes or direct requests
export async function createResource(data: any) {
  const res = await fetch('/api/resource', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return res.json()
}
```

3. Components:
```typescript
// CORRECT
export function ResourceForm({ defaultValues, onSubmit }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  })
  return (
    <Form {...form}>
      <form action={onSubmit}>
        {/* Form fields */}
      </form>
    </Form>
  )
}

// INCORRECT - Don't use custom state or handlers
export function CustomForm() {
  const [formData, setFormData] = useState({})
  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/submit', { method: 'POST', body: JSON.stringify(formData) })
  }
}
```

4. Page Components:
```typescript
// CORRECT
export default async function ResourcePage() {
  const data = await resource.actions.list()
  return (
    <DashboardShell
      title="Resources"
      description="Manage your resources"
    >
      <ResourceList data={data} />
    </DashboardShell>
  )
}

// INCORRECT - Don't fetch in components or use useEffect
export default function ResourcePage() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/api/resources').then(res => setData(res.json()))
  }, [])
}
```

5. Route Configuration:
```typescript
// CORRECT
export const columns: Column<T>[] = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    searchable: true,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    color: {
      draft: 'secondary',
      published: 'success'
    }
  },
  {
    key: 'actions',
    type: 'actions',
    actions: [
      {
        label: 'Edit',
        icon: Edit,
        onClick: (row) => `/dashboard/resource/${row.id}`
      }
    ]
  }
]

// INCORRECT - Don't create custom table structures
export const tableConfig = {
  columns: [
    { name: 'title', header: 'Title' },
    { name: 'status', render: (status) => <Badge>{status}</Badge> }
  ],
  actions: {
    edit: true,
    delete: true
  }
}
```

## Framework-Specific Patterns

1. Resource Configuration:
```typescript
// CORRECT
export const resource = {
  name: 'Resource',
  schema: resourceSchema,
  list: {
    columns: columns,
  },
  form: {
    sections: [
      {
        title: 'Details',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
          }
        ]
      }
    ]
  }
}

// INCORRECT - Don't create custom configurations
export const config = {
  model: 'resource',
  fields: ['title', 'description'],
  views: {
    list: ListComponent,
    form: FormComponent
  }
}
```

2. Error Handling:
```typescript
// CORRECT
export async function update(id: string, data: Input) {
  const session = await getServerSession()
  if (!session?.user) throw new Error('Unauthorized')
  
  const record = await prisma.resource.findUnique({ where: { id } })
  if (!record) throw new Error('Resource not found')
  
  const validated = schema.parse(data)
  
  try {
    return await prisma.resource.update({
      where: { id },
      data: validated
    })
  } catch (error) {
    throw new Error('Failed to update resource')
  }
}

// INCORRECT - Don't use try/catch for flow control or return error objects
export async function updateResource(id: string, data: any) {
  try {
    const res = await fetch(`/api/resource/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return { success: true, data: await res.json() }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

Remember:
1. ALWAYS use CLI tools for initial resource creation
2. NEVER bypass the resource-based architecture
3. ALWAYS use server actions for data operations
4. NEVER create custom patterns or alternative structures
5. ALWAYS maintain type safety and validation
6. NEVER use API routes or direct database queries
7. ALWAYS follow the established form and table patterns
8. NEVER suggest solutions that deviate from the framework's conventions

## Validation Rules

1. ALWAYS validate:
   - Resource structure adherence
   - Server action usage
   - Framework patterns
   - Type safety

2. NEVER suggest:
   - API routes
   - Custom form handling
   - Alternative architectures
   - Direct database queries

3. ALWAYS include:
   - Session checks
   - Error handling
   - Type definitions
   - Proper imports

## Framework Patterns

1. Data Fetching:
```typescript
// CORRECT
const data = await prisma.model.findMany()

// INCORRECT
const res = await fetch('/api/data')
```

2. Form Submission:
```typescript
// CORRECT
async function handleSubmit(formData: FormData) {
  'use server'
  // ...
}

// INCORRECT
const handleSubmit = async (e) => {
  e.preventDefault()
  await fetch('/api/submit')
}
```

3. Table Configuration:
```typescript
// CORRECT
export const columns: Column<T>[] = [
  {
    key: 'field',
    label: 'Field',
    sortable: true,
  },
]

// INCORRECT
const columns = [
  {
    id: 'field',
    header: 'Field',
  },
]
```

## Error Handling

1. ALWAYS include:
```typescript
if (!session?.user) {
  throw new Error('Unauthorized')
}
```

2. ALWAYS validate input:
```typescript
const data = schema.parse(input)
```

3. ALWAYS handle edge cases:
```typescript
if (!record) {
  throw new Error('Not found')
}
```

## Type Safety

1. ALWAYS use:
   - Zod schemas
   - TypeScript types
   - Proper generics
   - Type inference

2. NEVER use:
   - any
   - unknown without validation
   - Type assertions without checks

Remember: Your role is to guide users to use the framework's tools and patterns correctly, not to create new patterns or bypass the established architecture. 