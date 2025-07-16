# Database Setup Instructions

This application requires a PostgreSQL database to store quotes and related data.

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database URL for PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/quote_database"

# Email configuration (for quote sending functionality)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Database Setup Steps

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** on your system
2. **Create a database**:
   ```sql
   CREATE DATABASE quote_database;
   ```
3. **Create a user** (optional):
   ```sql
   CREATE USER quote_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE quote_database TO quote_user;
   ```
4. **Update DATABASE_URL** in your `.env` file:
   ```env
   DATABASE_URL="postgresql://quote_user:your_password@localhost:5432/quote_database"
   ```

### Option 2: Cloud Database (Recommended for Production)

#### Supabase (Free tier available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string and update your `.env` file

#### Railway

1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string from the database settings

#### Vercel Postgres

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string

## Database Migration

After setting up your database connection:

1. **Generate Prisma client**:

   ```bash
   npx prisma generate
   ```

2. **Push database schema**:

   ```bash
   npx prisma db push
   ```

3. **Verify the setup**:
   ```bash
   npx prisma studio
   ```

## Common Issues

### Connection Refused

- Ensure PostgreSQL is running
- Check the hostname and port in your DATABASE_URL
- Verify firewall settings

### Authentication Failed

- Double-check username and password
- Ensure the user has necessary permissions

### Database Does Not Exist

- Create the database manually
- Or use `createdb quote_database` command

### SSL Issues

For cloud databases, you might need to add SSL parameters:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

## Testing the Connection

The application includes a database connection test. Check your terminal/console for:

- ✅ Database connected successfully
- ❌ Database connection failed: [error details]

If you see connection errors, review this guide and ensure your DATABASE_URL is correctly configured.
