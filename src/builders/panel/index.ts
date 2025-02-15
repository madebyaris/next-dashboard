import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

export interface PanelConfig {
  title: string
  description?: string
  navigation?: NavigationItem[]
  auth?: AuthConfig
  theme?: ThemeConfig
}

export interface NavigationItem {
  title: string
  icon?: LucideIcon
  path: string
  roles?: ('ADMIN' | 'EDITOR' | 'VIEWER')[]
  children?: NavigationItem[]
}

export interface AuthConfig {
  guard?: string
  roles?: string[]
  permissions?: string[]
}

export interface ThemeConfig {
  primaryColor?: string
  darkMode?: boolean
  brandLogo?: ReactNode
  brandName?: string
}

export class PanelBuilder {
  private config: PanelConfig = {
    title: 'Dashboard',
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  public description(description: string): this {
    this.config.description = description
    return this
  }

  public navigation(items: NavigationItem[]): this {
    this.config.navigation = items
    return this
  }

  public auth(config: AuthConfig): this {
    this.config.auth = config
    return this
  }

  public theme(config: ThemeConfig): this {
    this.config.theme = config
    return this
  }

  public build(): PanelConfig {
    return this.config
  }
}

export function createPanel(): PanelBuilder {
  return new PanelBuilder()
} 