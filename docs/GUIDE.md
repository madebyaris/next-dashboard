# Next.js Dashboard - Developer Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Resources](#resources)
- [Components](#components)
- [Data Tables](#data-tables)
- [Authentication](#authentication)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/next-dashboard.git
cd next-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/next_dashboard"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. Start the development server:
```bash
pnpm dev
```

## Architecture

The dashboard follows a modular architecture based on resources. Each resource (e.g., posts, users) is self-contained and includes:

- Schema definition (Zod)
- Route configuration
- Table configuration
- Action handlers
- Component definitions

### Directory Structure
```
src/
  ├── app/                    # Next.js app router pages
  ├── components/            # Shared UI components
  │   ├── ui/               # Base UI components
  │   └── widgets/          # Dashboard widgets
  ├── resources/            # Resource definitions
  │   ├── config.ts        # Resource configuration
  │   └── posts/           # Example resource
  │       ├── actions.ts   # CRUD operations
  │       ├── components/  # Resource-specific components
  │       ├── index.ts     # Resource definition
  │       ├── routes.ts    # Route configuration
  │       └── schema.ts    # Data schema
  └── builders/            # Builder utilities
```

## Resources

Resources are the core building blocks of the dashboard. Each resource is defined using the `defineResource` function:

```typescript
export const posts = defineResource<Post>({
  name: 'posts',
  path: routes.list,
  navigation: {
    title: 'Posts',
    icon: FileText,
    path: routes.list,
    roles: ['ADMIN', 'EDITOR'],
  },
  schema: postSchema,
  table: {
    columns: [
      columns.text('title', 'Title', { sortable: true, searchable: true }),
      columns.badge('status', 'Status'),
      columns.actions('id', [...])
    ]
  }
})
```

## Data Tables

The dashboard includes a powerful data table component with features like:

- Sorting
- Filtering
- Pagination
- Global search
- Column customization

Example usage:

```typescript
<DataTable
  columns={posts.table.columns}
  data={postsData}
  searchKey="title"
  pageSize={10}
/>
```

## Best Practices

1. Resource Organization
   - Keep all resource-related code in the resource directory
   - Use the resource builder for consistent configuration
   - Implement resource-specific components in the resource's components directory

2. Component Structure
   - Use the UI components from `components/ui` for consistency
   - Create reusable widgets in `components/widgets`
   - Follow the component naming convention: `[Resource][ComponentType]`

3. Type Safety
   - Define schemas using Zod
   - Use TypeScript for all components and configurations
   - Leverage resource types for type-safe operations

4. Navigation
   - Define navigation items in resource configurations
   - Use role-based access control
   - Keep routes consistent with resource paths
