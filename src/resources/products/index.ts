import { ResourceBuilder } from '@/lib/resource-builder'
import { productConfig, type Product } from './config'

export const productResource = new ResourceBuilder<Product>(productConfig)

export * from './config' 