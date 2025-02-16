# Next.js Dashboard

A modern, type-safe dashboard application built with Next.js 15+, featuring:
- 🔐 Role-based authentication with NextAuth.js
- 📊 Dynamic dashboard widgets with real-time data
- 📝 Server-side CRUD operations with Zod validation
- 🎨 Beautiful UI with Shadcn/ui and Tailwind
- 🛠️ Resource-based architecture with builder pattern
- 🚀 CLI tools for rapid development

## Documentation
- [Instruction](instruction.md) About how this project is built and what you can expect from this project.
- [HOW TO USE](docs/INSTRUCTION.md) About how to use this project for the first time.
- [GUIDE](docs/GUIDE.md) If you are Developer, you can use this guide to understand the code and how to extend this project.

## Donation
If you like this project, you can buy me a coffee:
<div align="center">
  <a href="https://paypal.me/airs">
    <img src="https://img.shields.io/badge/PayPal-Donate-blue?style=for-the-badge&logo=paypal" alt="Donate with PayPal" />
  </a>
  <a href="https://trakteer.id/madebyaris/tip">
    <img src="https://img.shields.io/badge/Trakteer-Support-red?style=for-the-badge&logo=ko-fi" alt="Support on Trakteer" />
  </a>
</div>


## Features

### Authentication & Authorization
- Email/password authentication with NextAuth.js
- Role-based access control (Admin, Editor, Viewer)
- Protected routes and API endpoints
- Session management with JWT
- Resource-level permissions

### Dashboard
- Real-time statistics with server actions
- Customizable widgets with builder pattern
- Interactive data tables with sorting and filtering
- Activity feeds and audit trails
- Responsive layout with mobile support

### Data Management
- Server-side CRUD operations
- Form validation with Zod
- Advanced data tables with:
  - Sorting and filtering
  - Pagination
  - Bulk actions
  - Search functionality
- Resource-based architecture
- Type-safe API endpoints

### Developer Experience
- TypeScript for type safety
- Resource-based architecture
- CLI tools for scaffolding:
  - Model creation with database schema
  - Dashboard page generation
  - Resource configuration
- Comprehensive documentation
- Hot module reloading

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

6. Start the development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dashboard.

## CLI Tools

### Create Model (Interactive)
```bash
pnpm model:create
```
This interactive CLI tool will guide you through:
- Model name and fields
- Field types and validations
- Relations and constraints
- Dashboard page creation
- Database schema updates

### Create Model (Quick)
```bash
pnpm model:quick --name="Product" --fields="
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0),
  stock: z.number().min(0),
  status: z.enum(['draft', 'published'])
"
```

### Create Page
```bash
pnpm page:create --name="feature" --route="feature" --title="Feature Management"
```

### Push Model to Database
```bash
pnpm model:push
```
Selectively push models to your database without data loss.

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
└── resources/          # Resource configurations
    └── [resource]/     # Resource-specific files
        ├── schema.ts   # Zod schema
        ├── actions.ts  # Server actions
        ├── routes.ts   # Route config
        └── index.ts    # Resource config
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm model:create` - Interactive model creation
- `pnpm model:quick` - Quick model creation
- `pnpm page:create` - Generate a new page
- `pnpm model:push` - Push models to database

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
