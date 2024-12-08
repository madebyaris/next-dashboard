# Next.js Dashboard

A modern dashboard application built with Next.js 13+, featuring user authentication, post management, and real-time statistics.

## Features

- 🔐 **Authentication**
  - Email/Password authentication
  - Protected routes and API endpoints
  - Session management with NextAuth.js

- 📊 **Dashboard Overview**
  - Real-time statistics display
  - Recent users and posts overview
  - Interactive data cards

- 📝 **Post Management**
  - Create, read, update, and delete posts
  - Draft/Publish status
  - Rich text content
  - Author tracking

- 👥 **User Management**
  - User registration and login
  - Profile management
  - Activity tracking

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Context + Hooks

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/next-dashboard.git
   cd next-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in `.env`

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   ├── posts/         # Post management components
│   └── ui/            # Reusable UI components
├── lib/                # Utility functions and configurations
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
