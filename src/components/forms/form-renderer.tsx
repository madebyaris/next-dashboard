'use client'

import * as React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FormField as BaseFormField, FormSection } from '@/builders/form/index'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/ui/file-upload'
import { RichEditor } from '@/components/ui/rich-editor'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldRendererProps {
  field: BaseFormField
  disabled?: boolean
}

function FormFieldRenderer({ field, disabled }: FormFieldRendererProps) {
  const form = useFormContext()

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            className={field.prefix || field.suffix ? 'px-10' : ''}
          />
        )

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            rows={4}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
          />
        )

      case 'select':
        return (
          <Select disabled={disabled || field.disabled}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'toggle':
        return (
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <Switch
                checked={formField.value}
                onCheckedChange={formField.onChange}
                disabled={disabled || field.disabled}
              />
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  disabled={disabled || field.disabled}
                />
                <label className="text-sm font-medium">
                  {field.label}
                </label>
              </div>
            )}
          />
        )

      case 'date':
        return (
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <DatePicker
                value={formField.value}
                onChange={formField.onChange}
                placeholder={field.placeholder}
                disabled={disabled || field.disabled}
              />
            )}
          />
        )

      case 'file-upload':
        return (
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <FileUpload
                value={formField.value}
                onChange={formField.onChange}
                multiple={field.name.includes('[]')}
                disabled={disabled || field.disabled}
              />
            )}
          />
        )

      case 'rich-editor':
        return (
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <RichEditor
                value={formField.value}
                onChange={formField.onChange}
                placeholder={field.placeholder}
                disabled={disabled || field.disabled}
              />
            )}
          />
        )

      case 'repeater':
        return <RepeaterField field={field} disabled={disabled} />

      default:
        return (
          <Input
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
          />
        )
    }
  }

  // Handle conditional visibility
  const shouldShow = React.useMemo(() => {
    if (!field.conditions) return true
    
    return field.conditions.every(condition => {
      const fieldValue = form.watch(condition.field)
      const operator = condition.operator || '='
      
      switch (operator) {
        case '=':
          return fieldValue === condition.value
        case '!=':
          return fieldValue !== condition.value
        case '>':
          return fieldValue > condition.value
        case '<':
          return fieldValue < condition.value
        case '>=':
          return fieldValue >= condition.value
        case '<=':
          return fieldValue <= condition.value
        case 'contains':
          return String(fieldValue).includes(String(condition.value))
        case 'startsWith':
          return String(fieldValue).startsWith(String(condition.value))
        case 'endsWith':
          return String(fieldValue).endsWith(String(condition.value))
        default:
          return fieldValue === condition.value
      }
    })
  }, [field.conditions, form])

  if (!shouldShow || field.hidden) {
    return null
  }

  const widthClass = field.width ? {
    'full': 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    '1/4': 'w-1/4',
    '3/4': 'w-3/4',
  }[field.width] : 'w-full'

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn(widthClass)}>
          <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {field.label}
          </FormLabel>
          
          <div className="relative">
            {field.prefix && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {field.prefix}
              </div>
            )}
            
            <FormControl>
              {renderField()}
            </FormControl>
            
            {field.suffix && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {field.suffix}
              </div>
            )}
          </div>
          
          {field.helperText && (
            <FormDescription>
              {field.helperText}
            </FormDescription>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function RepeaterField({ field, disabled }: { field: BaseFormField; disabled?: boolean }) {
  const form = useFormContext()
  const fieldArray = form.watch(field.name) || []

  const addItem = () => {
    const newArray = [...fieldArray, field.defaultValue || '']
    form.setValue(field.name, newArray)
  }

  const removeItem = (index: number) => {
    const newArray = fieldArray.filter((_: any, i: number) => i !== index)
    form.setValue(field.name, newArray)
  }

  return (
    <div className="space-y-2">
      {fieldArray.map((_: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              {...form.register(`${field.name}.${index}`)}
              placeholder={field.placeholder}
              disabled={disabled || field.disabled}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(index)}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {field.label}
      </Button>
    </div>
  )
}

interface FormSectionRendererProps {
  section: FormSection
  disabled?: boolean
}

export function FormSectionRenderer({ section, disabled }: FormSectionRendererProps) {
  const form = useFormContext()
  const [collapsed, setCollapsed] = React.useState(section.collapsed || false)

  // Handle conditional visibility for sections
  const shouldShow = React.useMemo(() => {
    if (!section.conditions) return true
    
    return section.conditions.every(condition => {
      const fieldValue = form.watch(condition.field)
      const operator = condition.operator || '='
      
      switch (operator) {
        case '=':
          return fieldValue === condition.value
        case '!=':
          return fieldValue !== condition.value
        default:
          return fieldValue === condition.value
      }
    })
  }, [section.conditions, form])

  if (!shouldShow) {
    return null
  }

  const content = (
    <CardContent className="space-y-6">
      <div 
        className={cn(
          "grid gap-6",
          section.columns === 2 && "grid-cols-1 md:grid-cols-2",
          section.columns === 3 && "grid-cols-1 md:grid-cols-3",
          (!section.columns || section.columns === 1) && "grid-cols-1"
        )}
      >
        {section.fields.map((field) => (
          <FormFieldRenderer
            key={field.name}
            field={field}
            disabled={disabled}
          />
        ))}
      </div>
    </CardContent>
  )

  if (!section.title && !section.description) {
    return content
  }

  return (
    <Card>
      {(section.title || section.description) && (
        <CardHeader
          className={section.collapsible ? 'cursor-pointer' : ''}
          onClick={section.collapsible ? () => setCollapsed(!collapsed) : undefined}
        >
          <div className="flex items-center justify-between">
            <div>
              {section.title && <CardTitle>{section.title}</CardTitle>}
              {section.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {section.description}
                </p>
              )}
            </div>
            {section.collapsible && (
              <Button variant="ghost" size="sm">
                {collapsed ? '+' : '-'}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      
      {(!section.collapsible || !collapsed) && content}
    </Card>
  )
} 