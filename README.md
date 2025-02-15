# Next.js Dashboard

A modern dashboard application built with Next.js 13+, featuring user authentication, post management, and real-time statistics.

This is build by AI with ❤️, thanks to Windsurf.

To learn how to use this project, refer to the [Getting Started](#getting-started) section below.

And you can start using our docs guide:
[docs/GUIDE.md](docs/GUIDE.md).

## Features

- 🔐 **Authentication**
  - Email/Password authentication
  - Protected routes and API endpoints
  - Session management with NextAuth.js
  - Role-based access control (ADMIN, EDITOR, VIEWER)

- 📊 **Dashboard Overview**
  - Real-time statistics display
  - Recent users and posts overview
  - Interactive data cards
  - Role-based dashboard views

- 📝 **Post Management**
  - Create, read, update, and delete posts
  - Draft/Publish status
  - Rich text content
  - Author tracking
  - Role-based permissions

- 👥 **User Management**
  - User registration and login
  - Profile management
  - Activity tracking
  - CLI tools for user creation
  - Role-based permissions

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Context + Hooks
- **CLI Tools**: Node.js scripts with TypeScript

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/madebyaris/next-dashboard.git
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
   Fill in your environment variables in `.env`

4. Set up the database:
   ```bash
   pnpm prisma db push
   ```

5. Create an admin user:
   ```bash
   pnpm create-user --name="Admin User" --email="admin@example.com" --password="admin123" --role="ADMIN"
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## CLI Tools

### User Management

Create users directly from the terminal:

```bash
pnpm create-user --name="User Name" --email="user@example.com" --password="password" --role="ROLE"
```

Available roles:
- ADMIN: Full access to all features
- EDITOR: Can manage posts and view users
- VIEWER: Can view published content only

For more details about CLI tools, check the [CLI Tools Guide](docs/GUIDE.md#cli-tools).

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

## Project Structure

```
src/
├── app/                 # App router pages
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── posts/          # Post management components
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions and configurations
├── scripts/           # CLI tools and scripts
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Role-Based Access

The application implements role-based access control:

- **ADMIN**
  - Full access to all features
  - Can manage users and roles
  - Can manage all posts
  - Access to system settings

- **EDITOR**
  - Can create and edit posts
  - Can view user profiles
  - Cannot manage users or roles
  - Limited system settings access

- **VIEWER**
  - Can view published posts
  - Can view own profile
  - No management capabilities
  - No settings access

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
