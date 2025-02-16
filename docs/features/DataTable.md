# Data Table

## Overview
The data table system provides a powerful and flexible way to display, sort, filter, and manage tabular data. Built with TypeScript and React, it supports advanced features like server-side operations, custom rendering, and complex data transformations.

## Features

### 1. Core Features
- [x] Column sorting
- [x] Multi-column sorting
- [x] Column filtering
- [x] Column resizing
- [x] Column reordering
- [x] Column visibility toggle
- [x] Row selection
- [x] Pagination
- [x] Server-side operations
- [x] Custom cell rendering
- [x] Row actions
- [x] Bulk actions
- [x] Export functionality
- [x] Search
- [x] Responsive design

### 2. Data Management
- [x] Data fetching
- [x] Data caching
- [x] Optimistic updates
- [x] Real-time updates
- [x] Infinite scrolling
- [x] Virtual scrolling
- [x] Data transformation
- [x] Data validation

### 3. Customization
- [x] Custom filters
- [x] Custom sorting
- [x] Custom cell components
- [x] Custom row actions
- [x] Custom bulk actions
- [x] Custom styling
- [x] Theming support
- [x] Responsive breakpoints

## Implementation

### 1. Table Builder
```typescript
// src/builders/table.ts
export class TableBuilder<T extends Record<string, any>> {
  private config: TableConfig<T> = {
    columns: [],
  }

  public column(column: ColumnConfig<T>): this {
    this.config.columns.push(column)
    return this
  }

  public pagination(config: PaginationConfig): this {
    this.config.pagination = config
    return this
  }

  public selection(config: SelectionConfig): this {
    this.config.selection = config
    return this
  }

  public build(): TableConfig<T> {
    return this.config
  }
}
```

### 2. Table Configuration
```typescript
interface TableConfig<T> {
  columns: ColumnConfig<T>[]
  pagination?: PaginationConfig
  selection?: SelectionConfig
  sorting?: SortingConfig
  filtering?: FilteringConfig
  actions?: TableActions<T>
  toolbar?: ToolbarConfig
  styling?: StylingConfig
}

interface ColumnConfig<T> {
  id: string
  header: string
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (props: { row: T; value: any }) => ReactNode
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  width?: number
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
  className?: string
  meta?: Record<string, any>
}

interface PaginationConfig {
  pageSize: number
  pageSizeOptions: number[]
  serverSide?: boolean
}

interface SelectionConfig {
  enabled: boolean
  multiple?: boolean
  actions?: SelectionActions[]
}
```

## Usage Examples

### 1. Basic Table
```typescript
const usersTable = createTable<User>()
  .column({
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
  })
  .column({
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
  })
  .column({
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    cell: ({ value }) => (
      <Badge variant={getRoleVariant(value)}>{value}</Badge>
    ),
  })
  .pagination({
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
  })
  .build()
```

### 2. Advanced Table
```typescript
const productsTable = createTable<Product>()
  .column({
    id: 'image',
    header: '',
    cell: ({ row }) => (
      <Image
        src={row.imageUrl}
        alt={row.name}
        width={40}
        height={40}
        className="rounded-full"
      />
    ),
    width: 50,
  })
  .column({
    id: 'name',
    header: 'Product',
    accessorKey: 'name',
    sortable: true,
    filterable: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.name}</span>
        <span className="text-muted-foreground text-sm">
          {row.sku}
        </span>
      </div>
    ),
  })
  .column({
    id: 'price',
    header: 'Price',
    accessorKey: 'price',
    sortable: true,
    cell: ({ value }) => formatCurrency(value),
  })
  .column({
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    filterable: true,
    cell: ({ value }) => (
      <Badge variant={getStatusVariant(value)}>{value}</Badge>
    ),
  })
  .column({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleEdit(row)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  })
  .selection({
    enabled: true,
    multiple: true,
    actions: [
      {
        label: 'Delete',
        icon: <Trash className="h-4 w-4" />,
        onClick: handleBulkDelete,
      },
    ],
  })
  .build()
```

## Components

### 1. Table Component
```typescript
interface DataTableProps<T> {
  config: TableConfig<T>
  data: T[]
  loading?: boolean
  error?: Error
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: SortingState) => void
  onFilterChange?: (filters: FilterState) => void
}

export function DataTable<T extends Record<string, any>>({
  config,
  data,
  loading,
  error,
  ...props
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns: config.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...config,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} config={config} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
```

## Server-Side Operations

### 1. Data Fetching
```typescript
const useTableData = <T>(config: TableConfig<T>) => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  const fetchData = async (
    page: number,
    pageSize: number,
    sorting: SortingState,
    filters: FilterState
  ) => {
    try {
      setLoading(true)
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, pageSize, sorting, filters }),
      })
      const json = await response.json()
      setData(json.data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}
```

## Best Practices

1. **Performance**
   - Use virtual scrolling for large datasets
   - Implement proper data caching
   - Optimize rendering with memoization
   - Use server-side operations when necessary

2. **User Experience**
   - Provide clear loading states
   - Implement proper error handling
   - Add helpful empty states
   - Use proper keyboard navigation

3. **Accessibility**
   - Use semantic HTML elements
   - Add proper ARIA labels
   - Ensure keyboard navigation
   - Provide proper focus management

4. **Customization**
   - Use composition for complex cells
   - Implement proper theming
   - Allow for easy styling overrides
   - Support custom components

## Testing

### 1. Unit Tests
```typescript
describe('TableBuilder', () => {
  it('should create a table with basic columns', () => {
    const table = createTable<User>()
      .column({
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      })
      .build()

    expect(table.columns).toHaveLength(1)
  })
})
```

### 2. Integration Tests
```typescript
describe('DataTable', () => {
  it('should handle sorting', async () => {
    const onSortingChange = jest.fn()
    render(
      <DataTable
        config={tableConfig}
        data={mockData}
        onSortingChange={onSortingChange}
      />
    )
    
    // Test implementation
  })
})
```

## Future Improvements

1. **Enhanced Features**
   - [ ] Advanced filtering UI
   - [ ] Column groups
   - [ ] Row grouping
   - [ ] Tree data
   - [ ] Pivot tables

2. **Performance**
   - [ ] Worker-based sorting
   - [ ] Improved virtual scrolling
   - [ ] Better data caching
   - [ ] Optimized rendering

3. **User Experience**
   - [ ] Drag and drop
   - [ ] Column pinning
   - [ ] Row expansion
   - [ ] Custom themes
