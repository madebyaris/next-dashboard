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
├── create-model-speed-ai.ts # AI-powered model creation
├── ai-model-handler.ts     # AI model creation handler
├── create-page.ts         # Page generation
├── create-user.ts         # User management
└── push-model.ts         # Database schema updates
```

3. CLI Tools Available:
```bash
pnpm create-model         # Standard model creation
pnpm create-model-speed   # Interactive model creation
pnpm create-model-speed-ai # AI-powered model creation
pnpm create-page         # Page creation
pnpm push-model          # Database schema updates
pnpm create-user         # User creation
```

## AI Model Creation

1. Direct Model Creation:
```typescript
// When user asks to create a model, use handleModelCreation:
import { handleModelCreation } from '../scripts/ai-model-handler'

await handleModelCreation(`
  name: Product
  fields:
    - name: string, required
    - price: float, required
    - status: string, required
`)
```

2. Response Format:
```typescript
// Format your responses as an array of strings with newlines:
const responses = [
  'ModelName\n',           // Model name
  'y\n',                   // Create dashboard
  '2\n',                   // Number of fields
  'fieldName\n',          // Field name
  '0\n',                  // Field type (0 = String)
  'y\n',                  // Required
  'n\n',                  // Not unique
  'n\n',                  // No default
  'n\n',                  // No more fields
]
```

3. Field Type Mapping:
```typescript
const FIELD_TYPES = {
  'String': 0,
  'Int': 1,
  'Float': 2,
  'Boolean': 3,
  'DateTime': 4,
  'Json': 5,
  'BigInt': 6,
  'Decimal': 7,
  'Relation': 8
}
```

## Response Rules

1. When asked about creating new resources:
   - Use `handleModelCreation` to programmatically create models
   - Format responses according to the CLI's expected input
   - Handle field types and validations automatically

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

## AI Response Patterns

1. Model Creation:
```typescript
// When user asks to create a model:
const modelResponses = [
  'ModelName\n',
  'y\n',  // Create dashboard
  '2\n',  // Fields count
  // Field 1
  'name\n',
  '0\n',  // String
  'y\n',  // Required
  'n\n',  // Not unique
  'n\n',  // No default
  // Field 2
  'status\n',
  '0\n',  // String
  'y\n',  // Required
  'n\n',  // Not unique
  'n\n',  // No default
  // End
  'n\n',  // No more fields
]
```

2. Relations:
```typescript
// When adding relations:
const relationResponses = [
  'Category\n',
  'products\n',  // Relation field name
  '0\n',        // CASCADE
]
```

3. Validation:
```typescript
// When adding validation:
const fieldWithValidation = [
  'price\n',
  '2\n',    // Float
  'y\n',    // Required
  'n\n',    // Not unique
  'y\n',    // Has default
  '0\n',    // Default value
]
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
```

2. Error Handling:
```typescript
// CORRECT
if (!session?.user) {
  throw new Error('Unauthorized')
}

const validated = schema.parse(input)
if (!validated) {
  throw new Error('Invalid input')
}
```

## AI Agent Guidelines

1. ALWAYS:
   - Use `handleModelCreation` for model creation
   - Format responses according to CLI expectations
   - Follow the framework's patterns
   - Maintain type safety
   - Include session checks
   - Use server actions

2. NEVER:
   - Create custom model creation logic
   - Bypass the CLI tools
   - Generate complete resource files manually
   - Create API routes
   - Use direct database queries
   - Modify core framework structure

3. When Parsing User Input:
   - Extract model name and fields
   - Determine correct field types
   - Handle relations appropriately
   - Set proper validation rules
   - Format responses for CLI

Remember: Your role is to programmatically interact with the framework's tools, not to create new patterns or bypass the established architecture. 