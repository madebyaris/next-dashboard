# AI Usage Guidelines for Next Dashboard

This guide explains how to interact with AI tools (like Cursor, GitHub Copilot, etc.) when working with this framework. Following these guidelines ensures consistency and proper usage of the framework's features.

## Core Principles

1. **Always Use CLI Tools for Resource Creation**
   - DO NOT ask AI to generate complete resource files
   - DO use CLI commands for creating models and pages
   - Example correct prompt:
     ```
     "Help me create a product resource with fields: name (string), price (number), status (enum)"
     ```
   AI should respond with CLI command:
     ```bash
     pnpm create-model-speed
     # or
     pnpm create-model --name="Product" --fields="
       name: z.string().min(1, 'Name is required'),
       price: z.number().min(0),
       status: z.enum(['draft', 'published'])
     "
     ```

2. **Respect Resource Structure**
   ```
   src/resources/[resource]/
   ├── schema.ts     # Zod schema and types
   ├── actions.ts    # Server actions for CRUD
   ├── components.ts # Resource-specific components
   ├── routes.ts     # Route configuration
   └── index.ts      # Resource configuration
   ```
   - DO NOT ask AI to modify this structure
   - DO ask AI to help with content within these files

3. **Use Server Actions**
   - DO NOT ask AI to create API routes
   - DO ask AI to help with server actions in `actions.ts`
   - Example correct prompt:
     ```
     "Help me add validation to the createProduct server action"
     ```

## Correct Usage Examples

### 1. Creating New Resources

✅ DO:
```
"I want to create a new product management system with these fields:
- name (string, required)
- price (number, min 0)
- category (string, optional)
- status (enum: draft, published)
Can you help me with the CLI command?"
```

❌ DON'T:
```
"Generate the complete product resource files and components"
```

### 2. Modifying Components

✅ DO:
```
"Help me customize the ProductForm component to add validation for the price field"
```

❌ DON'T:
```
"Create a new custom form component structure for products"
```

### 3. Adding Business Logic

✅ DO:
```
"Help me add logic in the product actions to calculate total revenue"
```

❌ DON'T:
```
"Create a new API endpoint for product statistics"
```

## Common Tasks Guide

### 1. Creating a New Resource

1. First, use the CLI:
```bash
pnpm create-model-speed
```

2. Then ask AI for customization help:
```
"Help me customize the validation rules for the [specific field]"
```

### 2. Customizing Forms

1. Use existing form structure:
```typescript
export function ProductForm({ defaultValues, onSubmit }: ProductFormProps) {
  // Ask AI to help modify within this structure
}
```

2. Ask AI for specific modifications:
```
"How do I add a custom price validator to this form?"
```

### 3. Adding Custom Features

1. First, identify the correct file:
- Business logic → `actions.ts`
- UI components → `components.tsx`
- Data structure → `schema.ts`
- Table config → `routes.ts`

2. Then ask AI for specific changes:
```
"Help me add a bulk delete feature to the products table"
```

## Framework-Specific AI Prompts

### 1. Schema Modifications

✅ DO:
```
"How do I add a relation between Product and Category in the schema?"
```

AI should suggest using `create-model-speed` to handle relations.

### 2. Form Customization

✅ DO:
```
"How do I add a custom price input with currency selection to the ProductForm?"
```

AI should modify within the existing form structure.

### 3. Table Customization

✅ DO:
```
"How do I add a custom filter for price range in the products table?"
```

AI should modify the columns configuration in `routes.ts`.

## Best Practices

1. **Always Start with CLI**
   - Create base resources with CLI tools
   - Use AI for customization only

2. **Maintain Structure**
   - Keep resource folder structure
   - Use server actions for data operations
   - Follow the form and table patterns

3. **Ask for Specific Changes**
   - Target specific files or components
   - Describe exact functionality needed
   - Reference existing patterns

## What to Avoid

1. **Don't Ask AI To:**
   - Create complete resource structures
   - Modify the framework's core architecture
   - Generate API routes
   - Create alternative form/table patterns

2. **Don't Bypass:**
   - CLI tools for resource creation
   - Server actions for data operations
   - Built-in form and table components

## Getting Help

When stuck, format your AI prompts like this:

```
1. What I'm trying to do:
   "Add image upload to products"

2. Current structure:
   "Using standard resource structure in src/resources/products"

3. Specific need:
   "Help me modify the ProductForm to handle image uploads"
```

This helps AI provide framework-compliant solutions. 