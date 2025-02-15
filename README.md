# Next.js Dashboard

A modern, type-safe dashboard application built with Next.js 15+, featuring:
- 🔐 Role-based authentication
- 📊 Dynamic dashboard widgets
- 📝 CRUD operations with validation
- 🎨 Beautiful UI with Shadcn/ui
- 🛠️ Builder pattern for flexible components

## Documentation
- [Instruction](INSTRUCTION.md) About how this project is built and what you can expect from this project.
- [HOW TO USE](docs/INSTRUCTION.md) About how to use this project for the first time.
- [GUIDE](docs/GUIDE.md) If you are Developer, you can use this guide to understand the code and how to extend this project.

## Features

### Authentication & Authorization
- Email/password authentication with NextAuth.js
- Role-based access control (Admin, Editor, Viewer)
- Protected routes and API endpoints
- Session management

### Dashboard
- Real-time statistics
- Customizable widgets
- Interactive charts
- Activity feeds
- Responsive layout

### Data Management
- CRUD operations for resources
- Form validation with Zod
- Data table with sorting and filtering
- File uploads
- Batch operations

### Developer Experience
- TypeScript for type safety
- Builder pattern for component configuration
- CLI tools for scaffolding
- Comprehensive documentation
- Testing setup

## Quick Start

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

5. Initialize the database:
```bash
pnpm prisma db push
```

6. Create an admin user:
```bash
pnpm create-user --name="Admin User" --email="admin@example.com" --password="admin123" --role="ADMIN"
```

7. Start the development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dashboard.

## CLI Tools

### Create User
```bash
pnpm create-user --name="User Name" --email="user@example.com" --password="password" --role="ROLE"
```

### Create Page
```bash
pnpm create-page --name="feature" --route="feature" --title="Feature Management"
```

### Create Model
```bash
pnpm create-model --name="Product" --fields="
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0),
  stock: z.number().min(0),
  status: z.enum(['draft', 'published'])
"
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── ui/             # Base UI components
│   └── widgets/        # Dashboard widgets
├── lib/                # Utility functions
├── builders/           # Builder pattern implementations
├── models/             # Data models and business logic
└── resources/          # Resource configurations
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm create-user` - Create a new user
- `pnpm create-page` - Generate a new page
- `pnpm create-model` - Create a new model

## Documentation

- [Getting Started](docs/GUIDE.md#getting-started)
- [Architecture](docs/GUIDE.md#architecture)
- [Authentication](docs/GUIDE.md#authentication)
- [Components](docs/GUIDE.md#components)
- [API](docs/GUIDE.md#api)
- [Best Practices](docs/GUIDE.md#best-practices)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [ShadcnUI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)

## Support

If you find this project helpful, please give it a ⭐️ on GitHub!
