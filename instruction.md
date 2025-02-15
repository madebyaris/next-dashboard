# **Project Overview**
This project focuses on building a Next.js (latest version) boilerplate with an emphasis on:
- **CRUD Dashboard and UI**
- **Authentication (Login, Signup, Logout)** using **[Better Auth](https://www.better-auth.com/)**.

The design will utilize **ShadCN UI** ([ShadCN](https://ui.shadcn.com/)) for consistent and modern styling.

---

## **Application Pages**
### **Main Pages**
- `/`  
  A landing page with a simple "Hello World" message and an awesome design showcase.
- `/login`  
  Login page for user authentication.
- `/signup`  
  Signup page for new user registration.
- `/dashboard`  
  The main dashboard page.

### **Dashboard Nested Pages**
#### **Users Management**
- `/dashboard/users`  
  List all users with search, filter, and pagination functionality.
- `/dashboard/users/new`  
  Create a new user with fields like name, email, role, and password.
- `/dashboard/users/[id]`  
  View and edit detailed user information or delete a user.

#### **Posts Management**
- `/dashboard/posts`  
  List all posts with options for sorting, filtering, and pagination.
- `/dashboard/posts/new`  
  Create a new post with fields like title, content, and tags.
- `/dashboard/posts/[id]`  
  View and edit detailed post information or delete a post.

#### **Profile Management**
- `/dashboard/profile`  
  A profile page where users can view and update their personal details, such as name, email, and password.

---

## **Authentication with Better Auth**
- **Library**: The authentication for this project will be handled using **[Better Auth](https://www.better-auth.com/)**.
- **Key Features**:
  - Secure and flexible authentication flows for login, signup, and logout.
  - Built-in session management.
  - Integration with role-based access control (RBAC) for user permissions.

### **Role-Based Access Control (RBAC)**
Define roles and permissions for secure and controlled access:
- **Admin**  
  Full access to all features.
- **Editor**  
  Can create and edit posts but cannot manage users.
- **Viewer**  
  Read-only access to posts.

---

## **Additional Features**
- **Database**  
  Use PostgreSQL with Prisma ORM for schema management, migrations, and querying.
- **Audit Trail**  
  Implement logging for user actions (e.g., user creation, post updates) to ensure accountability.
- **API Endpoints**  
  Build RESTful API routes for managing users and posts under `/api/`.


## Folder Structure
```
project/ <-- you can change this if it's better
│
├── prisma/                   # Database schema and migrations
│   └── schema.prisma
├── app/
│   ├── pages/                # Next.js page routes
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Better Auth API integration
│   │   │   ├── users/        # User management API
│   │   │   └── posts/        # Post management API
│   │   ├── dashboard/        # Dashboard and nested pages
│   │   ├── login.tsx         # Login page
│   │   ├── signup.tsx        # Signup page
│   │   └── index.tsx         # Main page
│   ├── components/           # Reusable components
│   ├── lib/                  # Utility functions and helpers
│   └── styles/               # Custom styles
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # Project overview and usage instructions


README.md
A README.md file should include:

Project Description
A brief overview of the application and its purpose.

Setup Instructions
Detailed steps to set up and run the project.

Features
A description of the app's main features, including:

Authentication with Better Auth
CRUD for users and posts
RBAC with Admin, Editor, and Viewer roles.
Technology Stack
A list of libraries and frameworks used, such as:

Next.js
Better Auth
ShadCN UI
Prisma
PostgreSQL

# Next.js Dashboard Implementation Guide

## Core Technologies
- Next.js 15+
- TypeScript
- PostgreSQL with Prisma
- NextAuth.js
- ShadCN UI
- Tailwind CSS

## Project Setup

### 1. Initialize Project
```bash
pnpm create next-app next-dashboard --typescript --tailwind --app
cd next-dashboard
```

### 2. Install Dependencies
```bash
# Core dependencies
pnpm add @prisma/client @auth/prisma-adapter next-auth bcryptjs zod lucide-react

# UI dependencies
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-toast class-variance-authority clsx tailwind-merge

# Development dependencies
pnpm add -D prisma typescript @types/node @types/react @types/react-dom @types/bcryptjs
```

### 3. Configure Prisma
```bash
pnpm prisma init
```

Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String?   @unique
  password  String
  role      Role      @default(VIEWER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}
```

### 4. Environment Setup
Create `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/next_dashboard"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Implementation Steps

### 1. Authentication Setup

#### Configure NextAuth
Create `src/lib/auth.ts`:
```typescript
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      // Implementation
    }),
  ],
  callbacks: {
    // JWT and session callbacks
  },
}
```

#### Create Auth Pages
Create login and signup pages with form validation and error handling.

### 2. Dashboard Layout

#### Create Shell Component
```typescript
// src/components/dashboard/shell.tsx
export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
```

#### Implement Navigation
Create a responsive navigation with role-based menu items.

### 3. Builder Pattern Implementation

#### Panel Builder
```typescript
// src/builders/panel.ts
export class PanelBuilder {
  private config: PanelConfig = {
    title: '',
  }

  public title(title: string): this {
    this.config.title = title
    return this
  }

  // Additional methods

  public build(): PanelConfig {
    return this.config
  }
}
```

#### Form Builder
Implement dynamic form generation with validation.

#### Table Builder
Create a flexible data table with sorting and filtering.

#### Widget Builder
Build reusable dashboard widgets.

### 4. Resource Implementation

#### Create Resource Structure
```
src/resources/
├── products/
│   ├── index.ts
│   ├── schema.ts
│   └── api/
│       └── route.ts
└── users/
    ├── index.ts
    ├── schema.ts
    └── api/
        └── route.ts
```

#### Define Resource Configuration
```typescript
// src/resources/products/index.ts
export const productResource = {
  panel: createPanel()
    .title('Products')
    .build(),
  
  form: createForm()
    .title('Product Details')
    .build(),
  
  table: createTable<Product>()
    .title('Products')
    .build(),
}
```

### 5. API Implementation

#### Create Base API Utilities
```typescript
// src/lib/api-response.ts
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}
```

#### Implement CRUD Routes
Create standardized API routes with proper error handling and validation.

### 6. Component Implementation

#### Create Base Components
Implement reusable UI components using ShadCN UI.

#### Build Feature Components
Create specialized components for each feature.

### 7. Testing Setup

#### Configure Testing Environment
```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom
```

#### Write Tests
Create tests for components, API routes, and utilities.

## Development Workflow

### 1. Feature Development
1. Define schema and types
2. Create resource configuration
3. Implement API routes
4. Build UI components
5. Add tests

### 2. Code Quality
- Use ESLint and Prettier
- Follow TypeScript best practices
- Write meaningful comments
- Create comprehensive tests

### 3. Performance
- Implement caching where appropriate
- Use proper loading states
- Optimize database queries
- Monitor bundle size

### 4. Security
- Validate all inputs
- Implement proper authentication
- Use CSRF protection
- Rate limit API routes

## Deployment

### 1. Database Setup
1. Create production database
2. Run migrations
3. Seed initial data

### 2. Environment Configuration
1. Set production environment variables
2. Configure secrets
3. Set up proper logging

### 3. Build and Deploy
1. Run production build
2. Deploy to hosting platform
3. Monitor performance and errors