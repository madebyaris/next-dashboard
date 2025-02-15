import { createPanel } from '@/builders/panel'
import { createForm, fields } from '@/builders/form'
import { createTable, columns } from '@/builders/table'
import { createWidget, widgets } from '@/builders/widget'
import { 
  Package, 
  PlusCircle, 
  Archive, 
  Trash2,
  TrendingUp,
  DollarSign,
  ShoppingCart
} from 'lucide-react'
import { z } from 'zod'

// Schema for the product
const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['draft', 'published', 'archived']),
})

type Product = z.infer<typeof productSchema>

// Create the panel
export const productPanel = createPanel()
  .title('Products')
  .description('Manage your product catalog')
  .navigation([
    {
      title: 'Products',
      icon: Package,
      path: '/dashboard/products',
      roles: ['ADMIN', 'EDITOR'],
    },
  ])
  .build()

// Create the form
export const productForm = createForm()
  .title('Product Details')
  .section({
    title: 'Basic Information',
    description: 'Enter the basic product information',
    fields: [
      fields.text('name', 'Product Name', { required: true }),
      fields.richText('description', 'Description'),
      fields.text('category', 'Category', { required: true }),
    ],
  })
  .section({
    title: 'Pricing & Inventory',
    description: 'Set product price and stock level',
    fields: [
      fields.text('price', 'Price', {
        required: true,
        prefix: '$',
        validation: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
      }),
      fields.text('stock', 'Stock', {
        required: true,
        validation: z.string().regex(/^\d+$/, 'Stock must be a whole number'),
      }),
    ],
  })
  .section({
    title: 'Status',
    fields: [
      fields.select('status', 'Status', [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ]),
    ],
  })
  .validation(productSchema)
  .build()

// Create the table
export const productTable = createTable<Product>()
  .title('Products')
  .columns([
    columns.text('name', 'Product Name', { sortable: true, searchable: true }),
    columns.text('category', 'Category', { sortable: true, filterable: true }),
    columns.number('price', 'Price', {
      format: (value) => `$${value.toFixed(2)}`,
      sortable: true,
    }),
    columns.number('stock', 'Stock', { sortable: true }),
    columns.badge('status', 'Status', {
      color: {
        draft: 'gray',
        published: 'green',
        archived: 'red',
      },
      valueLabel: {
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
      },
    }),
    columns.actions('status', [
      {
        icon: PlusCircle,
        label: 'Edit',
        onClick: (row) => console.log('Edit', row),
      },
      {
        icon: Archive,
        label: 'Archive',
        onClick: (row) => console.log('Archive', row),
        visible: (row) => row.status === 'published',
      },
      {
        icon: Trash2,
        label: 'Delete',
        onClick: (row) => console.log('Delete', row),
      },
    ]),
  ])
  .filters([
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Books', value: 'books' },
      ],
    },
  ])
  .defaultSort('name', 'asc')
  .pagination({
    enabled: true,
    perPage: 10,
    perPageOptions: [10, 25, 50, 100],
  })
  .selection({
    enabled: true,
  })
  .build()

// Create widgets
export const productWidgets = [
  widgets.stats(
    {
      value: 1234,
      label: 'Total Products',
      icon: Package,
      trend: {
        value: 12.5,
        direction: 'up',
        label: 'vs last month',
      },
    },
    {
      width: '1/3',
    }
  ),
  widgets.stats(
    {
      value: '$12,345',
      label: 'Total Revenue',
      icon: DollarSign,
      trend: {
        value: 8.2,
        direction: 'up',
        label: 'vs last month',
      },
    },
    {
      width: '1/3',
    }
  ),
  widgets.stats(
    {
      value: 567,
      label: 'Total Orders',
      icon: ShoppingCart,
      trend: {
        value: -2.4,
        direction: 'down',
        label: 'vs last month',
      },
    },
    {
      width: '1/3',
    }
  ),
  widgets.chart(
    {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [30, 45, 35, 50, 40, 60],
          },
        ],
      },
    },
    {
      title: 'Sales Trend',
      width: '2/3',
    }
  ),
  widgets.list(
    {
      items: [
        {
          title: 'iPhone 14 Pro',
          subtitle: '128 units sold',
          value: '$128,000',
          icon: TrendingUp,
          badge: {
            label: 'Top Seller',
            color: 'green',
          },
        },
        {
          title: 'MacBook Pro M2',
          subtitle: '64 units sold',
          value: '$192,000',
          icon: TrendingUp,
          badge: {
            label: 'Popular',
            color: 'blue',
          },
        },
      ],
    },
    {
      title: 'Top Products',
      width: '1/3',
    }
  ),
] 