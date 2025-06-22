import { z } from 'zod'
import { ReactNode } from 'react'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file-upload'
  | 'rich-editor'
  | 'code'
  | 'color'
  | 'toggle'
  | 'repeater'
  | 'belongs-to'

export interface FormField {
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
    operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith'
  }[]
}

export interface FormSection {
  title?: string
  description?: string
  fields: FormField[]
  columns?: number
  collapsed?: boolean
  collapsible?: boolean
  conditions?: {
    field: string
    value: any
    operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith'
  }[]
}

export interface FormConfig {
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

export class FormBuilder {
  private config: FormConfig = {
    sections: [],
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  public description(description: string): this {
    this.config.description = description
    return this
  }

  public section(section: FormSection): this {
    this.config.sections.push(section)
    return this
  }

  public actions(actions: FormConfig['actions']): this {
    this.config.actions = actions
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

export function createForm(): FormBuilder {
  return new FormBuilder()
}

// Helper functions for common field types
export const fields = {
  text: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'text',
    ...config,
  }),

  email: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'email',
    validation: z.string().email(),
    ...config,
  }),

  password: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'password',
    validation: z.string().min(6),
    ...config,
  }),

  select: (
    name: string,
    label: string,
    options: { label: string; value: any }[],
    config: Partial<Omit<FormField, 'name' | 'label' | 'type' | 'options'>> = {}
  ): FormField => ({
    name,
    label,
    type: 'select',
    options,
    ...config,
  }),

  richEditor: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'rich-editor',
    ...config,
  }),

  fileUpload: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'file-upload',
    ...config,
  }),

  date: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'date',
    ...config,
  }),

  toggle: (name: string, label: string, config: Partial<Omit<FormField, 'name' | 'label' | 'type'>> = {}): FormField => ({
    name,
    label,
    type: 'toggle',
    ...config,
  }),
} 