# AI Interaction Examples

This document provides real-world examples of how to interact with AI tools when working with this framework.

## Resource Creation Examples

### 1. Creating a Product Catalog

✅ **User Prompt**:
```
I need to create a product catalog with these fields:
- name (string, required)
- description (text, optional)
- price (number, min 0)
- category (string, required)
- status (enum: draft, published, archived)
- featured (boolean)
- stock (number, min 0)
```

✅ **AI Response**:
```
I'll help you create a product catalog using our CLI tools. Let's use the interactive model creator for better control over the fields:

```bash
pnpm create-model-speed
```

Follow the prompts and enter:
1. Model name: "Product"
2. Create dashboard: Yes
3. Number of fields: 7

For each field:

1. name:
   - Type: String
   - Required: Yes
   - Unique: No

2. description:
   - Type: String
   - Required: No
   - Unique: No

3. price:
   - Type: Float
   - Required: Yes
   - Validation: min 0

4. category:
   - Type: String
   - Required: Yes

5. status:
   - Type: String
   - Required: Yes
   - Add enum validation in schema

6. featured:
   - Type: Boolean
   - Required: No
   - Default: false

7. stock:
   - Type: Int
   - Required: Yes
   - Validation: min 0

This will create all necessary files and set up your product catalog.
```

### 2. Adding Relations

✅ **User Prompt**:
```
I want to add a Category model and relate it to Products. Categories should have:
- name (string, required, unique)
- description (text)
- slug (string, unique)
And products should belong to a category.
```

✅ **AI Response**:
```
Let's create this in two steps:

1. First, create the Category model:

```bash
pnpm create-model-speed
```

Follow the prompts:
1. Model name: "Category"
2. Create dashboard: Yes
3. Fields:
   - name (String, Required, Unique)
   - description (String, Not Required)
   - slug (String, Required, Unique)

2. Then, modify the Product model to add the relation:

```bash
pnpm create-model-speed
```

When asked about fields, add:
- category (Relation)
  - Related model: Category
  - Field name: products
  - On delete: CASCADE

This will:
1. Create the Category resource
2. Update the Product schema with the relation
3. Generate appropriate Prisma schema updates
4. Create all necessary components
```

## Form Customization Examples

### 1. Custom Price Input

✅ **User Prompt**:
```
How do I customize the product form to have a price input with currency selection?
```

✅ **AI Response**:
```
I'll help you modify the existing ProductForm component while maintaining the framework's structure. Add this to your form section in `src/resources/products/index.ts`:

```typescript
form: {
  sections: [
    {
      title: 'General',
      fields: [
        // ... existing fields ...
        {
          name: 'price',
          type: 'custom',
          label: 'Price',
          render: ({ field }) => (
            <div className="flex gap-2">
              <Select
                value={field.currency}
                onValueChange={(value) => field.onChange({ ...field.value, currency: value })}
              >
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </Select>
              <Input
                type="number"
                value={field.value.amount}
                onChange={(e) => field.onChange({ ...field.value, amount: e.target.value })}
                min={0}
                step={0.01}
              />
            </div>
          ),
        },
      ],
    },
  ],
}
```

Then update your schema in `schema.ts`:

```typescript
price: z.object({
  amount: z.number().min(0),
  currency: z.enum(['USD', 'EUR']),
})
```
```

### 2. Custom Validation

✅ **User Prompt**:
```
I need to add custom validation to the product name to ensure it's unique and follows a specific format: [Category]-[Name]-[ID]
```

✅ **AI Response**:
```
I'll help you add custom validation to the existing schema and form. Modify your `schema.ts`:

```typescript
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .regex(
      /^[A-Z]+-[A-Za-z0-9]+-\d+$/,
      'Name must follow format: CATEGORY-Name-123'
    )
    .refine(
      async (name) => {
        const exists = await prisma.product.findFirst({ 
          where: { name } 
        })
        return !exists
      },
      'Product name must be unique'
    ),
  // ... other fields
})
```

The framework will automatically use this validation in your forms.
```

## Table Customization Examples

### 1. Custom Filters

✅ **User Prompt**:
```
I want to add a price range filter and category filter to the products table
```

✅ **AI Response**:
```
I'll help you modify the columns configuration in your `routes.ts`:

```typescript
export const columns: Column<Product>[] = [
  // ... existing columns ...
  {
    key: 'price',
    label: 'Price',
    type: 'number',
    sortable: true,
    filter: {
      type: 'range',
      min: 0,
      max: 1000,
    },
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    sortable: true,
    filter: {
      type: 'select',
      options: async () => {
        const categories = await prisma.category.findMany()
        return categories.map(c => ({
          label: c.name,
          value: c.id,
        }))
      },
    },
  },
]
```

The framework's DataTable component will automatically handle these filters.
```

## Business Logic Examples

### 1. Adding Custom Actions

✅ **User Prompt**:
```
I need to add a "duplicate product" action to the products table
```

✅ **AI Response**:
```
I'll help you add the action to your routes configuration and create the necessary server action. First, add to `actions.ts`:

```typescript
export async function duplicate(id: string) {
  const original = await prisma.product.findUnique({
    where: { id },
  })
  
  if (!original) {
    throw new Error('Product not found')
  }
  
  const { id: _, createdAt, updatedAt, ...data } = original
  
  return prisma.product.create({
    data: {
      ...data,
      name: `${data.name} (Copy)`,
    },
  })
}
```

Then modify your `routes.ts`:

```typescript
export const columns: Column<Product>[] = [
  // ... other columns ...
  {
    key: 'actions',
    label: '',
    type: 'actions',
    actions: [
      // ... existing actions ...
      {
        icon: Copy,
        label: 'Duplicate',
        onClick: async (row) => {
          await actions.duplicate(row.id)
          window.location.reload()
        },
      },
    ],
  },
]
```
```

Remember: Always use the framework's patterns and structures when implementing new features. 