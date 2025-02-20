export interface Field {
  name: string
  type: string
  isRequired: boolean
  isUnique: boolean
  hasDefault: boolean
  defaultValue?: string
  isRelation: boolean
  relationModel?: string
  relationField?: string
  relationOnDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT'
  enumValues?: string[]
}

export interface ModelConfig {
  name: string
  fields: Field[]
  createDashboard: boolean
} 