# Advanced Form Handling Guide

This guide demonstrates how to create robust forms with validation, file uploads, and dynamic fields.

## Basic Form with Validation

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
})

type FormValues = z.infer<typeof formSchema>

export function AdvancedForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      email: '',
      phone: '',
      tags: [],
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/your-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Submission failed')

      toast({
        title: 'Success',
        description: 'Form submitted successfully',
        variant: 'success',
      })

      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag]
      setTags(newTags)
      form.setValue('tags', newTags)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    form.setValue('tags', newTags)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Give your submission a clear title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Input
                  placeholder="Add tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-32"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## Features

1. **Validation**:
   - Schema-based validation with Zod
   - Real-time validation feedback
   - Custom error messages

2. **Dynamic Fields**:
   - Tag input with add/remove functionality
   - Optional fields
   - Field dependencies

3. **State Management**:
   - Form state tracking
   - Submission handling
   - Reset functionality

4. **Error Handling**:
   - Field-level error messages
   - Form-level error handling
   - API error handling

## Best Practices

1. **Validation**:
   ```typescript
   // Reusable validation schemas
   export const userSchema = z.object({
     name: z.string().min(2).max(50),
     email: z.string().email(),
     age: z.number().min(18).max(100).optional(),
   })

   // Custom validation
   const passwordSchema = z
     .string()
     .min(8)
     .regex(/[A-Z]/, 'Need one uppercase character')
     .regex(/[a-z]/, 'Need one lowercase character')
     .regex(/[0-9]/, 'Need one number')
   ```

2. **Error Messages**:
   ```typescript
   // Custom error map
   const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
     switch (issue.code) {
       case z.ZodIssueCode.invalid_type:
         return { message: 'Invalid type provided' }
       case z.ZodIssueCode.too_small:
         return { message: `Must be at least ${issue.minimum} characters` }
       default:
         return { message: ctx.defaultError }
     }
   }

   z.setErrorMap(customErrorMap)
   ```

3. **Form Submission**:
   ```typescript
   const onSubmit = async (data: FormValues) => {
     try {
       // Show loading state
       setIsSubmitting(true)

       // Validate data
       const validated = formSchema.parse(data)

       // Make API call
       const response = await fetch('/api/endpoint', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(validated),
       })

       // Handle response
       if (!response.ok) throw new Error('Submission failed')

       // Show success message
       toast.success('Form submitted successfully')

       // Reset form
       form.reset()
     } catch (error) {
       // Handle errors
       console.error(error)
       toast.error('Failed to submit form')
     } finally {
       // Reset loading state
       setIsSubmitting(false)
     }
   }
   ```

4. **Accessibility**:
   ```tsx
   <FormField
     control={form.control}
     name="email"
     render={({ field }) => (
       <FormItem>
         <FormLabel htmlFor={field.name}>
           Email
           <span className="text-destructive">*</span>
         </FormLabel>
         <FormControl>
           <Input
             id={field.name}
             type="email"
             aria-describedby={`${field.name}-description`}
             aria-invalid={!!form.formState.errors[field.name]}
             {...field}
           />
         </FormControl>
         <FormDescription id={`${field.name}-description`}>
           We'll never share your email.
         </FormDescription>
         <FormMessage />
       </FormItem>
     )}
   />
   ```

## Tips and Tricks

1. **Form Reset Confirmation**:
   ```typescript
   const handleReset = () => {
     if (form.formState.isDirty &&
         window.confirm('Are you sure? All changes will be lost.')) {
       form.reset()
     }
   }
   ```

2. **Auto-save Draft**:
   ```typescript
   useEffect(() => {
     const saveTimeout = setTimeout(() => {
       if (form.formState.isDirty) {
         localStorage.setItem('formDraft', JSON.stringify(form.getValues()))
       }
     }, 1000)

     return () => clearTimeout(saveTimeout)
   }, [form.watch()])
   ```

3. **Conditional Fields**:
   ```typescript
   const watchNotificationType = form.watch('notificationType')

   {watchNotificationType === 'email' && (
     <FormField
       control={form.control}
       name="emailAddress"
       render={({ field }) => (
         <FormItem>
           <FormLabel>Email Address</FormLabel>
           <FormControl>
             <Input {...field} />
           </FormControl>
         </FormItem>
       )}
     />
   )}
   ```

4. **File Upload Preview**:
   ```typescript
   const [preview, setPreview] = useState<string>()

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]
     if (file) {
       const reader = new FileReader()
       reader.onloadend = () => {
         setPreview(reader.result as string)
       }
       reader.readAsDataURL(file)
     }
   }
   ```
