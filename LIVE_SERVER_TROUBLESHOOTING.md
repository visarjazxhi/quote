# Live Server Troubleshooting Guide

## Current Issue: 503 Database Connection Errors

The `/api/quotes` endpoints are returning 503 status codes, indicating database connection failures on the live server.

### Immediate Steps to Diagnose

1. **Check Health Endpoint**: Visit `/api/health` on your live server to get detailed diagnostics:

   ```
   https://your-domain.com/api/health
   ```

2. **Check Environment Variables**: Ensure `DATABASE_URL` is correctly set on your live server:
   - For Vercel: Check Environment Variables in Project Settings
   - For Netlify: Check Site Settings > Environment Variables
   - For other platforms: Check your hosting provider's environment variable configuration

### Common Causes and Solutions

#### 1. Missing DATABASE_URL Environment Variable

**Symptoms**: Health check shows `"hasDatabaseUrl": false`
**Solution**:

- Add `DATABASE_URL` environment variable to your hosting platform
- Use the same value from your local `.env` file
- Ensure it's saved and deployed

#### 2. Database Connection String Issues

**Symptoms**: Health check shows connection timeout or "ENOTFOUND" errors
**Solutions**:

- Verify the database URL is correct and accessible from external sources
- Check if your database allows external connections
- For Neon database: Ensure connection pooling is enabled
- Test the connection string locally

#### 3. Prisma Client Issues

**Symptoms**: Prisma-related errors (P1001, P1008, P1017)
**Solutions**:

- Regenerate and redeploy Prisma client
- Run `npx prisma generate` before deployment
- Ensure Prisma client is properly bundled in production build

#### 4. Network/Firewall Issues

**Symptoms**: Connection timeouts
**Solutions**:

- Check if your hosting platform's IP is whitelisted in your database
- Verify database security groups/firewall settings
- For Neon: Ensure "Allow connections from any IP" is enabled for testing

### Database URL Format for Neon

Your database URL should look like:

```
postgres://username:password@hostname:port/database?sslmode=require
```

Example:

```
postgres://neondb_owner:your_password@ep-empty-mouse-a7wl5gzy-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
```

### Debugging Commands

1. **Test locally with production DATABASE_URL**:

   ```bash
   # Temporarily use production DATABASE_URL in local .env
   npm run build
   npm start
   ```

2. **Check Prisma connection**:

   ```bash
   npx prisma db pull
   npx prisma studio
   ```

3. **Verify environment variables in build**:
   ```bash
   # In your deployment logs, look for:
   # ✅ DATABASE_URL is present
   # 🔄 Attempting database connection...
   ```

### Platform-Specific Instructions

#### Vercel

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add `DATABASE_URL` with your Neon connection string
4. Redeploy your project

#### Netlify

1. Go to Site Settings → Environment Variables
2. Add `DATABASE_URL`
3. Trigger a new deployment

### Monitoring and Logs

Check your deployment logs for these messages:

- `✅ Database connected successfully` - Connection OK
- `❌ DATABASE_URL environment variable is not set` - Missing env var
- `❌ Database connection failed` - Connection issue

### Next Steps

1. Visit `/api/health` on your live server
2. Based on the response, follow the appropriate solution above
3. If database connection is successful but quotes still fail, check Prisma schema migration status
4. Consider running `npx prisma migrate deploy` if migrations are pending

### Common Specific Errors

#### P2021: "The table does not exist in the current database"

**Root Cause**: Database tables haven't been created from Prisma schema
**Solution**:

```bash
# For development
npx prisma migrate dev --name init

# For production deployment
npx prisma migrate deploy
```

#### P1001, P1008, P1017: Connection/timeout errors

**Root Cause**: Database connection issues
**Solution**: Check DATABASE_URL and network connectivity

### Contact Support

If issues persist after following this guide:

1. Share the `/api/health` endpoint response
2. Share relevant deployment logs
3. Confirm your hosting platform and database provider
4. Include the specific Prisma error code (P2021, P1001, etc.)
