import { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  title: string
  icon: LucideIcon
  path: string
  roles?: string[]
}

export interface AuthConfig {
  enabled: boolean
  roles?: string[]
}

export interface ThemeConfig {
  primaryColor?: string
  logo?: string
  favicon?: string
}

export interface PanelConfig {
  title: string
  description?: string
  navigation?: NavigationItem[]
  auth?: AuthConfig
  theme?: ThemeConfig
}

export class PanelBuilder {
  private config: PanelConfig = {
    title: '',
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