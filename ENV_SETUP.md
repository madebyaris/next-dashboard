# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

### 1. Database Configuration (REQUIRED)

**For Development (SQLite - Recommended):**
```bash
DATABASE_URL="file:./dev.db"
```

**For Production (PostgreSQL - Recommended):**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/next_dashboard"
```

### 2. NextAuth.js Configuration (REQUIRED)
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Application Settings (REQUIRED)
```bash
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

## Database Setup Guide

### Development Setup (SQLite)
SQLite is perfect for development - no server setup required!

1. **Use SQLite for development (already configured):**
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

2. **Initialize the database:**
   ```bash
   pnpm prisma db push
   ```

3. **Your SQLite database file will be created automatically at `./dev.db`**

### Production Setup (PostgreSQL)

When deploying to production, switch to PostgreSQL:

1. **Update your Prisma schema for production:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Add PostgreSQL-specific field types back:**
   - `@db.Text` for large text fields
   - Other PostgreSQL-specific features as needed

3. **Set your production DATABASE_URL:**
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

## Optional Environment Variables

### OAuth Providers (for future implementation)
```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Email Configuration (for notifications)
```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### File Upload Configuration

#### AWS S3 (Option 1)
```bash
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
```

#### Cloudinary (Option 2)
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Rate Limiting
```bash
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"
```

### Logging & Analytics
```bash
LOG_LEVEL="info"
SENTRY_DSN="your-sentry-dsn"
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
```

## Quick Setup Steps

1. **Copy the template below and save it as `.env` in your project root:**

```bash
# Database Configuration (SQLite for Development)
DATABASE_URL="file:./dev.db"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application Settings
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"
```

2. **Generate a secure NextAuth secret:**
   ```bash
   openssl rand -base64 32
   ```
   Replace `your-super-secret-jwt-key-change-this-in-production` with the generated value.

3. **Initialize your SQLite database:**
   ```bash
   pnpm prisma db push
   ```

4. **Start development:**
   ```bash
   pnpm dev
   ```

## Database Migration Guide

### From PostgreSQL to SQLite (Development)
If you're switching from PostgreSQL to SQLite for development:

1. **Update your `.env` file:**
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

2. **Reset and recreate your database:**
   ```bash
   pnpm prisma db push --force-reset
   ```

3. **Optionally seed your database with test data**

### From SQLite to PostgreSQL (Production)
When deploying to production:

1. **Update your Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Add back PostgreSQL-specific field types:**
   ```prisma
   refresh_token String? @db.Text
   access_token  String? @db.Text
   id_token      String? @db.Text
   content       String  @db.Text
   value         String  @db.Text
   ```

3. **Run migrations:**
   ```bash
   pnpm prisma migrate deploy
   ```

## Security Notes

- **Never commit your `.env` file to version control**
- The `.env` file is already in `.gitignore`
- **Never commit your `dev.db` SQLite file to version control** (also in `.gitignore`)
- Use different secrets for development and production  
- For production, use environment variables provided by your hosting platform
- Consider using a password manager for storing sensitive values

## Production Environment

For production deployment, set these environment variables in your hosting platform:

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"  
3. Add each variable from your `.env` file
4. **Important:** Use PostgreSQL DATABASE_URL for production

### Railway/Render/Heroku
Use their respective environment variable configuration interfaces with PostgreSQL.

### Docker
Create a `.env.production` file or use Docker secrets with PostgreSQL.

## Troubleshooting

### SQLite Issues (Development)
- If `dev.db` gets corrupted, delete it and run `pnpm prisma db push`
- SQLite file permissions: ensure your app can write to the project directory
- For complex queries, consider switching to PostgreSQL sooner

### PostgreSQL Issues (Production)
- Ensure PostgreSQL is running
- Check if the database exists
- Verify username/password credentials
- Test connection: `psql postgresql://user:password@localhost:5432/database`

### NextAuth Issues
- Ensure `NEXTAUTH_SECRET` is set and unique
- Check that `NEXTAUTH_URL` matches your application URL
- For production, use HTTPS URLs

### File Upload Issues
- For local development, files are stored temporarily
- For production, configure AWS S3 or Cloudinary
- Ensure proper permissions for cloud storage

## Example Complete .env Files

### Development (.env)
```bash
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-generated-with-openssl"

# App
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Optional: Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"
```

### Production (.env.production)
```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/next_dashboard"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="different-super-secret-key-for-production"

# App
NODE_ENV="production"
APP_URL="https://yourdomain.com"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"

# Optional: File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="my-cloud"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="my-secret-key"
``` 

## Why SQLite for Development?

**Advantages:**
- ✅ Zero configuration - no server setup required
- ✅ Fast local development 
- ✅ Easy to reset/recreate database
- ✅ Perfect for testing and prototyping
- ✅ Portable - entire database in one file

**Why PostgreSQL for Production:**
- ✅ Better performance for concurrent users
- ✅ Advanced features (JSON, full-text search, etc.)
- ✅ Better suited for production workloads
- ✅ Industry standard for web applications
- ✅ Excellent ecosystem and tooling 