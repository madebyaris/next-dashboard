# Project Summary

This project aims to be **a FilamentPHP-like admin panel framework for the JavaScript/TypeScript ecosystem**, providing Laravel Filament-style developer ergonomics and features for **Next.js 15+** applications.

It delivers a modern, full-stack dashboard built with Next.js, TypeScript, and Tailwind CSS, following a resource-based architecture that makes it easy to scaffold pages, forms, tables, and widgets—just like Filament does for Laravel.

## Key Technologies

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with role-based access control (Admin, Editor, Viewer)
- **Validation**: Zod for schema validation

## Project Structure

The project is organized into several key directories:

- `src/app`: Contains the Next.js pages and layouts, following the App Router conventions.
- `src/components`: Reusable React components, including UI primitives and dashboard-specific components.
- `src/lib`: Core utilities, including authentication, database, and API helpers.
- `src/prisma`: The Prisma schema and migration files.
- `src/resources`: a resource-based architecture that uses a builder pattern to create dashboard pages, forms, and tables.

## Features

- **Authentication**: Secure user authentication with email/password and role-based authorization.
- **Dashboard**: A dynamic dashboard with widgets and real-time data.
- **CRUD Operations**: Server-side data management with Zod for validation.
- **CLI Tools**: Custom scripts for scaffolding models, pages, and other resources.
- **Type Safety**: End-to-end type safety with TypeScript and Prisma.

## Getting Started

1.  **Installation**: Run `pnpm install` to install the dependencies.
2.  **Configuration**: Copy `.env.example` to `.env` and configure the database and authentication settings.
3.  **Database**: Run `pnpm prisma db push` to initialize the database.
4.  **Development**: Run `pnpm dev` to start the development server.

## CLI Tools

The project includes several CLI tools to accelerate development:

- `pnpm create-model`: Create a new data model and associated resources.
- `pnpm create-page`: Generate a new dashboard page.
- `pnpm create-user`: Create a new user with a specified role.

This summary provides a high-level overview of the project. For more detailed information, please refer to the `README.md` and the documentation in the `docs` directory. 