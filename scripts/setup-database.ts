#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(PROJECT_ROOT, 'prisma', 'schema.prisma');
const SCHEMA_PRODUCTION_PATH = path.join(PROJECT_ROOT, 'prisma', 'schema.production.prisma');
const ENV_PATH = path.join(PROJECT_ROOT, '.env');

async function main() {
  console.log(chalk.blue.bold('🗄️  Database Setup Assistant\n'));

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { title: 'Setup SQLite for Development (Recommended)', value: 'sqlite' },
      { title: 'Setup PostgreSQL for Production', value: 'postgresql' },
      { title: 'Initialize Database (Current Schema)', value: 'init' },
      { title: 'Reset Database', value: 'reset' },
    ],
  });

  switch (action) {
    case 'sqlite':
      await setupSQLite();
      break;
    case 'postgresql':
      await setupPostgreSQL();
      break;
    case 'init':
      await initializeDatabase();
      break;
    case 'reset':
      await resetDatabase();
      break;
    default:
      console.log('Operation cancelled.');
      return;
  }
}

async function setupSQLite() {
  console.log(chalk.yellow('Setting up SQLite for development...\n'));

  // Create .env if it doesn't exist
  if (!fs.existsSync(ENV_PATH)) {
    const envContent = `# Database Configuration (SQLite for Development)
DATABASE_URL="file:./dev.db"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateSecret()}"

# Application Settings
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"
`;
    fs.writeFileSync(ENV_PATH, envContent);
    console.log(chalk.green('✅ Created .env file with SQLite configuration'));
  } else {
    console.log(chalk.yellow('⚠️  .env file already exists. Please manually update DATABASE_URL to:'));
    console.log(chalk.cyan('DATABASE_URL="file:./dev.db"'));
  }

  // Ensure schema is set to SQLite
  const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
  if (!schemaContent.includes('provider = "sqlite"')) {
    const updatedSchema = schemaContent.replace(
      /provider = "postgresql"/,
      'provider = "sqlite"'
    );
    fs.writeFileSync(SCHEMA_PATH, updatedSchema);
    console.log(chalk.green('✅ Updated Prisma schema to use SQLite'));
  }

  await initializeDatabase();
}

async function setupPostgreSQL() {
  console.log(chalk.yellow('Setting up PostgreSQL for production...\n'));

  const { databaseUrl } = await prompts({
    type: 'text',
    name: 'databaseUrl',
    message: 'Enter your PostgreSQL connection URL:',
    initial: 'postgresql://user:password@localhost:5432/next_dashboard',
  });

  // Copy production schema
  if (fs.existsSync(SCHEMA_PRODUCTION_PATH)) {
    fs.copyFileSync(SCHEMA_PRODUCTION_PATH, SCHEMA_PATH);
    console.log(chalk.green('✅ Updated Prisma schema to use PostgreSQL'));
  }

  // Update .env
  if (fs.existsSync(ENV_PATH)) {
    let envContent = fs.readFileSync(ENV_PATH, 'utf8');
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL="${databaseUrl}"`
    );
    fs.writeFileSync(ENV_PATH, envContent);
    console.log(chalk.green('✅ Updated .env with PostgreSQL URL'));
  }

  console.log(chalk.blue('\nNext steps:'));
  console.log('1. Ensure your PostgreSQL server is running');
  console.log('2. Create the database if it doesn\'t exist');
  console.log('3. Run: pnpm prisma migrate deploy');
}

async function initializeDatabase() {
  console.log(chalk.yellow('Initializing database...\n'));

  try {
    execSync('pnpm prisma db push', { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log(chalk.green('\n✅ Database initialized successfully!'));
    
    const { seedData } = await prompts({
      type: 'confirm',
      name: 'seedData',
      message: 'Would you like to create a test user?',
      initial: true,
    });

    if (seedData) {
      await createTestUser();
    }
  } catch (error) {
    console.error(chalk.red('❌ Failed to initialize database:'), error);
  }
}

async function resetDatabase() {
  console.log(chalk.yellow('Resetting database...\n'));

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'This will delete all data. Are you sure?',
    initial: false,
  });

  if (!confirm) {
    console.log('Operation cancelled.');
    return;
  }

  try {
    execSync('pnpm prisma db push --force-reset', { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log(chalk.green('\n✅ Database reset successfully!'));
    
    const { seedData } = await prompts({
      type: 'confirm',
      name: 'seedData',
      message: 'Would you like to create a test user?',
      initial: true,
    });

    if (seedData) {
      await createTestUser();
    }
  } catch (error) {
    console.error(chalk.red('❌ Failed to reset database:'), error);
  }
}

async function createTestUser() {
  try {
    execSync('pnpm create-user', { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log(chalk.green('✅ Test user created!'));
  } catch (error) {
    console.error(chalk.yellow('⚠️  Could not create test user. You can run `pnpm create-user` manually later.'));
  }
}

function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

main().catch(console.error); 