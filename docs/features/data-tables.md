# Data Tables

The dashboard includes a powerful data table component with built-in features for handling data display and interaction.

## Features

- Sorting
- Filtering (global and column-specific)
- Pagination
- Global search
- Column customization
- Action buttons
- Badge display
- Responsive design

## Usage

```typescript
import { DataTable } from '@/components/ui/data-table'

<DataTable
  columns={columns}
  data={data}
  searchKey="title"
  pageSize={10}
/>
```

## Column Types

### Text Column
```typescript
columns.text('title', 'Title', {
  sortable: true,
  searchable: true
})
```

### Number Column
```typescript
columns.number('price', 'Price', {
  sortable: true,
  format: (value) => `$${value.toFixed(2)}`
})
```

### Badge Column
```typescript
columns.badge('status', 'Status', {
  color: {
    draft: 'gray',
    published: 'green'
  },
  valueLabel: {
    draft: 'Draft',
    published: 'Published'
  }
})
```

### Actions Column
```typescript
columns.actions('id', [
  {
    icon: FileText,
    label: 'Edit',
    onClick: (row) => actions.edit(row.id)
  },
  {
    icon: Trash2,
    label: 'Delete',
    onClick: (row) => actions.delete(row.id)
  }
])
```

## Customization

### Page Size
```typescript
<DataTable
  pageSize={20}
  data={data}
  columns={columns}
/>
```

### Search
```typescript
<DataTable
  searchKey="title"
  data={data}
  columns={columns}
/>
```

### Column Sorting
```typescript
columns.text('title', 'Title', {
  sortable: true,
  defaultSort: 'asc'
})
```

### Column Filtering
```typescript
columns.text('category', 'Category', {
  filterable: true,
  filterOptions: [
    { label: 'All', value: '' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' }
  ]
})
``` 