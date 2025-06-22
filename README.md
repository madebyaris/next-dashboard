# Next.js Dashboard

A modern, type-safe dashboard application built with Next.js 15+, featuring:
- 🔐 Role-based authentication with NextAuth.js
- 📊 Dynamic dashboard widgets with real-time data
- 📝 Server-side CRUD operations with Zod validation
- 🎨 Beautiful UI with Shadcn/ui and Tailwind
- 🛠️ Resource-based architecture with builder pattern
- 🚀 CLI tools for rapid development
- 🗄️ SQLite for development, PostgreSQL for production
- 📋 Advanced form components with 15+ field types
- ⚡ Bulk operations and enhanced data tables

## Documentation
- [Instruction](instruction.md) About how this project is built and what you can expect from this project.
- [HOW TO USE](docs/INSTRUCTION.md) About how to use this project for the first time.
- [GUIDE](docs/GUIDE.md) If you are Developer, you can use this guide to understand the code and how to extend this project.
- [Environment Setup](ENV_SETUP.md) Complete guide for database configuration.

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

## ✨ What's New

### 🗄️ Simplified Database Setup
- **SQLite for Development**: Zero configuration, no server setup required
- **PostgreSQL for Production**: Industry standard with excellent performance
- **Interactive Setup**: `pnpm setup-db` guides you through configuration
- **Easy Migration**: Switch between databases with simple commands

### 📋 Advanced Form System
- **15+ Field Types**: Text, Email, Password, Number, Select, Textarea, Checkbox, Switch, Date, File Upload, Rich Editor, and more
- **File Upload**: Drag & drop interface with validation and progress tracking
- **Rich Text Editor**: TipTap integration with full formatting toolbar
- **Date Picker**: Beautiful calendar interface with date formatting
- **Conditional Fields**: Show/hide fields based on other field values
- **Field Width Control**: Responsive layout with customizable field widths

### ⚡ Enhanced Data Tables
- **Bulk Operations**: Select multiple records and perform batch actions
- **Advanced Filtering**: Search, sort, and filter with multiple criteria
- **Export Functionality**: CSV export for selected or all records
- **Row Selection**: Intuitive checkbox selection with "select all"
- **Custom Actions**: Extensible action system for table rows

### 🚀 Improved Developer Experience
- **Interactive CLI**: Enhanced resource generation with prompts
- **Better Error Handling**: Comprehensive error states and messages
- **Icon Fix**: Resolved Lucide React icon import issues
- **Type Safety**: Full TypeScript support with proper type inference

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
  - Bulk actions with row selection
  - CSV export functionality
  - Search functionality
- Resource-based architecture
- Type-safe API endpoints

### Form Components
- **Basic Fields**: Text, Email, Password, Number, Textarea
- **Selection Fields**: Select, Checkbox, Switch, Radio
- **Advanced Fields**: Date Picker, File Upload, Rich Text Editor
- **Layout Fields**: Repeater, Conditional visibility, Field groups
- **Validation**: Real-time validation with Zod schemas
- **Responsive Design**: Mobile-friendly form layouts

### Developer Experience
- TypeScript for type safety
- Resource-based architecture
- CLI tools for scaffolding:
  - Interactive model creation
  - Dashboard page generation
  - Resource configuration
  - Database setup automation
- Comprehensive documentation
- Hot module reloading

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (SQLite is used for development - no database server needed!)

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

3. Set up the database (interactive):
```bash
pnpm setup-db
```
This will guide you through setting up SQLite for development or PostgreSQL for production.

**OR** manually create your `.env` file:
```env
# SQLite for development (recommended)
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
pnpm db:init
```

5. Create a test user (interactive):
```bash
pnpm create-user
```

6. Start the development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dashboard.

## Database Configuration

This project uses **SQLite for development** and **PostgreSQL for production**:

### Development (SQLite)
- ✅ Zero configuration - no server setup required
- ✅ Fast local development and testing
- ✅ Easy database reset and seeding
- ✅ Perfect for prototyping and development
- ✅ Portable - entire database in one file

### Production (PostgreSQL)
- ✅ Better performance for concurrent users
- ✅ Advanced features and better scalability
- ✅ Industry standard for production web applications
- ✅ Excellent ecosystem and hosting support

To switch between databases, use `pnpm setup-db` or see [ENV_SETUP.md](ENV_SETUP.md) for detailed instructions.

## CLI Tools

### Enhanced Resource Creation
```bash
pnpm create-enhanced-resource
```
Interactive CLI that creates complete resources with:
- Model schema with 15+ field types
- Form components with validation
- Data tables with bulk actions
- Server actions and API routes
- Navigation integration

### Create Model (Interactive)
```bash
pnpm create-model-speed
```
This interactive CLI tool will guide you through:
- Model name and fields
- Field types and validations
- Relations and constraints
- Dashboard page creation
- Database schema updates

### Database Management
```bash
pnpm setup-db        # Interactive database setup
pnpm db:init         # Initialize database
pnpm db:reset        # Reset database (with confirmation)
pnpm db:studio       # Open database GUI
```

### User Management
```bash
pnpm create-user     # Interactive user creation
```

### Legacy Tools
```bash
pnpm create-model    # Standard model creation
pnpm create-page     # Generate a new page
pnpm push-model      # Push models to database
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── actions/        # Action components
│   ├── dashboard/      # Dashboard-specific components
│   ├── forms/          # Form components
│   ├── ui/             # Base UI components (15+ components)
│   └── widgets/        # Dashboard widgets
├── lib/                # Utility functions
├── builders/           # Builder pattern implementations
│   ├── actions.ts      # Action builder
│   ├── form/           # Form builders
│   ├── table/          # Table builders
│   └── resource.tsx    # Resource builder
├── resources/          # Resource configurations
│   └── [resource]/     # Resource-specific files
│       ├── schema.ts   # Zod schema
│       ├── actions.ts  # Server actions
│       ├── routes.ts   # Route config
│       └── index.ts    # Resource config
└── scripts/            # CLI tools and utilities
```

## Available Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database
- `pnpm setup-db` - Interactive database setup (SQLite/PostgreSQL)
- `pnpm db:init` - Initialize database with current schema
- `pnpm db:reset` - Reset database (⚠️ deletes all data)
- `pnpm db:studio` - Open Prisma Studio (database GUI)

### Code Generation
- `pnpm create-enhanced-resource` - Enhanced interactive resource creation
- `pnpm create-model-speed` - Quick model creation
- `pnpm create-model` - Standard model creation
- `pnpm create-page` - Generate a new page
- `pnpm push-model` - Push models to database
- `pnpm create-user` - Create a test user (interactive)

## 🎯 Feature Highlights

### Form Components (15+ Types)
- **Text Fields**: Text, Email, Password, Number, URL, Tel
- **Selection**: Select, Multi-select, Checkbox, Switch, Radio
- **Date/Time**: Date Picker, Time Picker, DateTime
- **Content**: Textarea, Rich Text Editor (TipTap)
- **Files**: File Upload with drag & drop
- **Layout**: Repeater fields, Conditional visibility

### Data Table Features
- **Sorting**: Click column headers to sort
- **Filtering**: Advanced search and filter options
- **Pagination**: Configurable page sizes
- **Selection**: Bulk select with checkbox
- **Actions**: Row actions and bulk operations
- **Export**: CSV export for selected records

### Action System
- **Header Actions**: Page-level actions (Create, Import, etc.)
- **Table Actions**: Row-level actions (Edit, Delete, View)
- **Bulk Actions**: Multi-record operations (Delete, Export)
- **Modal Actions**: Popup interactions
- **Confirmation**: Built-in confirmation dialogs

## Documentation

- [Getting Started](docs/GUIDE.md#getting-started)
- [Architecture](docs/GUIDE.md#architecture)
- [Authentication](docs/GUIDE.md#authentication)
- [Components](docs/GUIDE.md#components)
- [API](docs/GUIDE.md#api)
- [Best Practices](docs/GUIDE.md#best-practices)
- [Environment Setup](ENV_SETUP.md)

## 🚀 Recent Updates

### v1.2.0 - Database & Form Enhancements
- ✅ SQLite development setup with PostgreSQL production
- ✅ Interactive database setup script
- ✅ Enhanced create-user script with prompts
- ✅ Fixed Lucide React icon import issues
- ✅ 15+ advanced form field types
- ✅ Bulk operations with row selection
- ✅ CSV export functionality
- ✅ Enhanced CLI tools with better UX

### Bug Fixes
- ✅ Fixed undefined icon imports (post → FileText)
- ✅ Resolved React component type errors
- ✅ Improved database connection handling
- ✅ Enhanced error messages and validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [ShadcnUI](https://ui.shadcn.com/) - UI components
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Zod](https://zod.dev/) - Schema validation
- [Lucide React](https://lucide.dev/) - Icons
- [TipTap](https://tiptap.dev/) - Rich text editor

## Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

**Made with ❤️ by [Aris](https://github.com/madebyaris)**
