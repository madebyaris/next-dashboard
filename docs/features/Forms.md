# Forms

## Overview
The form system is built using a flexible builder pattern that allows for easy creation of complex forms with validation, conditional fields, and dynamic layouts.

## Features

### 1. Field Types
- [x] Text input
- [x] Textarea
- [x] Number
- [x] Email
- [x] Password
- [x] Select
- [x] Multi-select
- [x] Checkbox
- [x] Radio
- [x] Date
- [x] Time
- [x] DateTime
- [x] File upload
- [x] Rich text editor
- [x] Code editor
- [x] Color picker
- [x] Toggle

### 2. Form Features
- [x] Field validation with Zod
- [x] Conditional fields
- [x] Form sections
- [x] Grid layouts
- [x] Field dependencies
- [x] Custom field components
- [x] Form actions
- [x] Error handling
- [x] Loading states
- [x] Field masking
- [x] Auto-save

### 3. Validation
- [x] Built-in validation rules
- [x] Custom validation rules
- [x] Async validation
- [x] Field-level validation
- [x] Form-level validation
- [x] Error messages
- [x] Validation states

## Implementation

### 1. Form Builder
```typescript
// src/builders/form.ts
export class FormBuilder {
  private config: FormConfig = {
    sections: [],
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  public section(section: FormSection): this {
    this.config.sections.push(section)
    return this
  }

  public validation(schema: z.ZodType<any>): this {
    this.config.validationSchema = schema
    return this
  }

  public build(): FormConfig {
    return this.config
  }
}
```

### 2. Form Configuration
```typescript
interface FormConfig {
  title?: string
  description?: string
  sections: FormSection[]
  actions?: {
    submit?: {
      label?: string
      redirect?: string
    }
    cancel?: {
      label?: string
      redirect?: string
    }
  }
  validationSchema?: z.ZodType<any>
}

interface FormSection {
  title?: string
  description?: string
  fields: FormField[]
  columns?: number
  collapsed?: boolean
  collapsible?: boolean
  conditions?: {
    field: string
    value: any
    operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains'
  }[]
}

interface FormField {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  validation?: z.ZodType<any>
  options?: { label: string; value: any }[]
  defaultValue?: any
  width?: 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4'
  prefix?: ReactNode
  suffix?: ReactNode
  conditions?: {
    field: string
    value: any
    operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains'
  }[]
}
```

## Usage Examples

### 1. Basic Form
```typescript
const productForm = createForm()
  .title('Product Details')
  .section({
    title: 'Basic Information',
    fields: [
      fields.text('name', 'Product Name', { required: true }),
      fields.number('price', 'Price', { required: true }),
      fields.select('status', 'Status', [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ]),
    ],
  })
  .validation(productSchema)
  .build()
```

### 2. Complex Form
```typescript
const userForm = createForm()
  .title('User Profile')
  .section({
    title: 'Personal Information',
    fields: [
      fields.text('name', 'Full Name', { required: true }),
      fields.email('email', 'Email Address', { required: true }),
      fields.password('password', 'Password', {
        conditions: [{ field: 'isNewUser', value: true }],
      }),
    ],
  })
  .section({
    title: 'Preferences',
    collapsible: true,
    fields: [
      fields.select('theme', 'Theme', [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ]),
      fields.toggle('notifications', 'Enable Notifications'),
    ],
  })
  .build()
```

### 3. Form with Conditional Fields
```typescript
const orderForm = createForm()
  .section({
    title: 'Order Details',
    fields: [
      fields.select('type', 'Order Type', [
        { label: 'Physical', value: 'physical' },
        { label: 'Digital', value: 'digital' },
      ]),
      fields.text('shipping_address', 'Shipping Address', {
        conditions: [{ field: 'type', value: 'physical' }],
      }),
      fields.email('delivery_email', 'Delivery Email', {
        conditions: [{ field: 'type', value: 'digital' }],
      }),
    ],
  })
  .build()
```

## Components

### 1. Form Component
```typescript
interface FormProps {
  config: FormConfig
  onSubmit: (data: any) => Promise<void>
  defaultValues?: Record<string, any>
}

export function Form({ config, onSubmit, defaultValues }: FormProps) {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(config.validationSchema),
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {config.sections.map((section, index) => (
        <FormSection
          key={index}
          section={section}
          form={form}
        />
      ))}
    </form>
  )
}
```

### 2. Field Components
```typescript
interface FieldProps {
  field: FormField
  form: UseFormReturn
}

export function Field({ field, form }: FieldProps) {
  const { register, formState: { errors } } = form

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...register(field.name)}
          label={field.label}
          error={errors[field.name]?.message}
        />
      )
    // Other field types...
  }
}
```

## Validation

### 1. Schema Validation
```typescript
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  status: z.enum(['draft', 'published']),
})
```

### 2. Custom Validation
```typescript
const customValidation = async (value: string) => {
  const exists = await checkIfExists(value)
  return exists ? 'Already exists' : true
}
```

## Best Practices

1. **Field Organization**
   - Group related fields in sections
   - Use clear and descriptive labels
   - Provide helper text for complex fields
   - Implement proper field validation

2. **User Experience**
   - Show validation errors immediately
   - Provide clear error messages
   - Use appropriate field types
   - Implement auto-save for long forms

3. **Performance**
   - Lazy load complex fields
   - Optimize validation
   - Use proper form state management
   - Implement proper error handling

4. **Accessibility**
   - Use proper ARIA labels
   - Implement keyboard navigation
   - Provide error announcements
   - Follow form best practices

## Testing

### 1. Unit Tests
```typescript
describe('Form Builder', () => {
  it('should create a form with basic fields', () => {
    const form = createForm()
      .section({
        fields: [
          fields.text('name', 'Name'),
        ],
      })
      .build()

    expect(form.sections[0].fields).toHaveLength(1)
  })
})
```

### 2. Integration Tests
```typescript
describe('Form Component', () => {
  it('should handle form submission', async () => {
    const onSubmit = jest.fn()
    render(<Form config={formConfig} onSubmit={onSubmit} />)
    
    // Test implementation
  })
})
```

## Future Improvements

1. **Enhanced Fields**
   - [ ] Rich text editor improvements
   - [ ] Advanced file upload
   - [ ] Custom field types
   - [ ] Field templates

2. **Validation**
   - [ ] Real-time validation
   - [ ] Custom validation rules
   - [ ] Validation groups
   - [ ] Cross-field validation

3. **User Experience**
   - [ ] Form wizards
   - [ ] Multi-step forms
   - [ ] Form preview
   - [ ] Form versioning
