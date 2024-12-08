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