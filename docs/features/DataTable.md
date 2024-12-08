# Advanced Data Table Guide

This guide shows how to create a feature-rich data table with sorting, filtering, and pagination.

## Basic Implementation

```tsx
'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  Search,
} from 'lucide-react'

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: keyof T
    label: string
    sortable?: boolean
    render?: (value: T[keyof T], item: T) => React.ReactNode
  }[]
}

export function DataTable<T extends { id: string }>({ 
  data,
  columns 
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  // Filtering logic
  const filteredData = sortedData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key.toString()}
                className={column.sortable ? 'cursor-pointer' : ''}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.label}</span>
                  {column.sortable && sortConfig?.key === column.key && (
                    {sortConfig.direction === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key.toString()}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]?.toString()}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
          {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
```

## Usage Example

```tsx
// pages/dashboard/users/page.tsx
import { DataTable } from '@/components/data-table'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
}

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
    render: (value: string) => (
      <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => (
      <Badge variant={value === 'active' ? 'success' : 'destructive'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    label: 'Joined',
    sortable: true,
    render: (value: string) => 
      formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
]

export default async function UsersPage() {
  const users = await prisma.user.findMany()

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Users"
        text="Manage your users here."
      />
      <DataTable data={users} columns={columns} />
    </div>
  )
}
```

## Features

1. **Sorting**:
   - Click column headers to sort
   - Toggle between ascending and descending
   - Visual indicators for sort direction

2. **Filtering**:
   - Search across all fields
   - Case-insensitive matching
   - Instant results

3. **Pagination**:
   - Configurable items per page
   - Page navigation
   - Entry count display

4. **Customization**:
   - Custom column rendering
   - Flexible action menu
   - Responsive design

## TypeScript Support

The table is fully typed and will provide type checking for your data structure:

```typescript
interface TableItem {
  id: string
  [key: string]: any
}

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

interface DataTableProps<T extends TableItem> {
  data: T[]
  columns: Column<T>[]
}
```

## Styling

The table uses Tailwind CSS for styling and can be customized through the following classes:

```tsx
// Custom styles example
<Table className="border rounded-lg">
  <TableHeader className="bg-muted">
    <TableRow className="hover:bg-muted/50">
      <TableHead className="font-semibold">...</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">...</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Best Practices

1. **Performance**:
   - Use virtual scrolling for large datasets
   - Implement server-side sorting and filtering
   - Memoize expensive computations

2. **Accessibility**:
   - Include proper ARIA labels
   - Ensure keyboard navigation
   - Maintain proper contrast ratios

3. **Error Handling**:
   - Show empty states
   - Handle loading states
   - Display error messages

4. **Responsiveness**:
   - Hide less important columns on mobile
   - Use responsive text sizes
   - Ensure touch-friendly controls
