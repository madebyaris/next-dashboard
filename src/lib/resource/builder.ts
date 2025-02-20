import { type ResourceDefinition, type Field } from './types'
import { type JsonSchema } from '@jsonforms/core'

export class ResourceBuilder {
  constructor(private definition: ResourceDefinition) {}

  private fieldToJsonSchema(field: Field): any {
    const schema: any = {
      type: field.type === 'enum' ? 'string' : field.type,
      title: field.label,
      description: field.description,
    }

    if (field.required) {
      schema.required = true
    }

    if (field.default !== undefined) {
      schema.default = field.default
    }

    if (field.validation) {
      if (field.validation.min !== undefined) schema.minimum = field.validation.min
      if (field.validation.max !== undefined) schema.maximum = field.validation.max
      if (field.validation.minLength !== undefined) schema.minLength = field.validation.minLength
      if (field.validation.maxLength !== undefined) schema.maxLength = field.validation.maxLength
      if (field.validation.pattern) schema.pattern = field.validation.pattern
      if (field.validation.options) schema.enum = field.validation.options
    }

    return schema
  }

  private createJsonSchema(): JsonSchema {
    const required: string[] = []
    const properties: Record<string, any> = {}

    Object.entries(this.definition.fields).forEach(([name, field]) => {
      properties[name] = this.fieldToJsonSchema(field)
      if (field.required) {
        required.push(name)
      }
    })

    return {
      type: 'object',
      required,
      properties,
    }
  }

  private createUiSchema() {
    const elements: any[] = []

    // Group fields if groups are defined
    if (this.definition.display?.groups) {
      this.definition.display.groups.forEach(group => {
        elements.push({
          type: 'Group',
          label: group.name,
          elements: group.fields.map(fieldName => ({
            type: 'Control',
            scope: `#/properties/${fieldName}`,
            ...(this.definition.fields[fieldName].ui?.component === 'textarea' && {
              options: { multi: true }
            }),
            ...(this.definition.fields[fieldName].ui?.placeholder && {
              options: { placeholder: this.definition.fields[fieldName].ui?.placeholder }
            }),
          }))
        })
      })
    } else {
      // If no groups, create flat layout
      Object.entries(this.definition.fields).forEach(([name, field]) => {
        elements.push({
          type: 'Control',
          scope: `#/properties/${name}`,
          ...(field.ui?.component === 'textarea' && {
            options: { multi: true }
          }),
          ...(field.ui?.placeholder && {
            options: { placeholder: field.ui?.placeholder }
          }),
        })
      })
    }

    return {
      type: 'VerticalLayout',
      elements,
    }
  }

  private createTableColumns() {
    const displayFields = this.definition.display?.listFields || Object.keys(this.definition.fields)
    
    return displayFields.map(fieldName => {
      const field = this.definition.fields[fieldName]
      return {
        id: fieldName,
        header: field.label,
        accessorKey: fieldName,
        cell: ({ row }: any) => {
          const value = row.getValue(fieldName)
          if (value === null || value === undefined) return '-'
          if (field.type === 'boolean') return value ? 'Yes' : 'No'
          if (field.type === 'date') return new Date(value).toLocaleDateString()
          if (field.type === 'number' && fieldName === 'price') return `$${value.toFixed(2)}`
          return String(value)
        },
      }
    })
  }

  private createApiEndpoints() {
    const basePath = this.definition.api?.basePath || `/api/${this.definition.name.toLowerCase()}`
    return {
      list: this.definition.api?.endpoints?.list || `${basePath}`,
      create: this.definition.api?.endpoints?.create || `${basePath}`,
      update: this.definition.api?.endpoints?.update || `${basePath}/{id}`,
      delete: this.definition.api?.endpoints?.delete || `${basePath}/{id}`,
    }
  }

  build() {
    return {
      name: this.definition.name,
      description: this.definition.description,
      schema: this.createJsonSchema(),
      uiSchema: this.createUiSchema(),
      columns: this.createTableColumns(),
      endpoints: this.createApiEndpoints(),
      roles: this.definition.roles,
      hooks: this.definition.hooks,
      display: this.definition.display,
    }
  }
} 