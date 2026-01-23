# Deployment Guide

This guide covers deploying the Experiment Manager application to Heroku with PostgreSQL.

## Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- Git repository initialized and connected to GitHub
- Heroku account created

## Heroku Deployment

### Step 1: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create experiment-manager-prod

# Or use a custom name
heroku create your-app-name
```

### Step 2: Add PostgreSQL Add-on

```bash
# Add PostgreSQL database (essential-0 plan, free tier)
heroku addons:create heroku-postgresql:essential-0

# Verify DATABASE_URL is set (automatic)
heroku config:get DATABASE_URL
```

### Step 3: Set Environment Variables

```bash
# Generate and set AUTH_SECRET
heroku config:set AUTH_SECRET=$(openssl rand -base64 32)

# Verify environment variables
heroku config
```

Your app now has:
- `DATABASE_URL` (set automatically by PostgreSQL add-on)
- `AUTH_SECRET` (set in previous step)

### Step 4: Deploy to Heroku

```bash
# Add Heroku remote if not already added
heroku git:remote -a your-app-name

# Push code to Heroku (triggers build and deployment)
git push heroku main

# Or if your branch is called master
git push heroku master
```

### Step 5: Run Database Migrations

Migrations run automatically via the `heroku-postbuild` script in [package.json](package.json).

To run manually if needed:
```bash
heroku run npx prisma migrate deploy
```

### Step 6: Seed Production Database

```bash
# Seed database with initial user and sample data
heroku run npm run db:seed
```

### Step 7: Open Your App

```bash
heroku open
```

## Post-Deployment

### View Logs

```bash
# Stream logs in real-time
heroku logs --tail

# View last 200 lines
heroku logs -n 200
```

### Access Database

```bash
# Open Prisma Studio (database GUI)
heroku run npx prisma studio

# Or connect via psql
heroku pg:psql
```

### Run Migrations

```bash
# Deploy migrations to production
heroku run npx prisma migrate deploy

# View migration status
heroku run npx prisma migrate status
```

## Environment Variables

Required environment variables for production:

| Variable | Description | Set By |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Heroku PostgreSQL add-on (automatic) |
| `AUTH_SECRET` | Secret key for NextAuth.js | Manual (see Step 3) |

Optional variables:
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` (automatic) |

## Database Management

### Backup Database

```bash
# Create manual backup
heroku pg:backups:capture

# View backups
heroku pg:backups

# Download backup
heroku pg:backups:download
```

### Reset Database

```bash
# WARNING: This will delete all data
heroku pg:reset DATABASE_URL

# After reset, run migrations and seed
heroku run npx prisma migrate deploy
heroku run npm run db:seed
```

### Scale Database

```bash
# Upgrade to a larger plan
heroku addons:create heroku-postgresql:standard-0

# Follow Heroku's upgrade guide
heroku pg:wait
```

## Troubleshooting

### Build Failures

```bash
# Check build logs
heroku logs --tail

# Common issues:
# 1. Missing dependencies - check package.json
# 2. Build script errors - verify heroku-postbuild script
# 3. Node version mismatch - specify engines in package.json
```

### Database Connection Issues

```bash
# Verify DATABASE_URL is set
heroku config:get DATABASE_URL

# Check database status
heroku pg:info

# View database logs
heroku logs --ps postgres
```

### Migration Issues

```bash
# View migration status
heroku run npx prisma migrate status

# Reset and re-run migrations (WARNING: deletes data)
heroku run npx prisma migrate reset

# Or manually deploy specific migration
heroku run npx prisma migrate deploy
```

### Application Crashes

```bash
# Check dyno status
heroku ps

# Restart dynos
heroku restart

# Scale dynos
heroku ps:scale web=1
```

## Monitoring

### Dyno Usage

```bash
# View dyno hours (free tier has 1000 hours/month)
heroku ps -a your-app-name
```

### Database Metrics

```bash
# View database stats
heroku pg:info

# View database connections
heroku pg:ps
```

### Application Logs

Set up log drains for production monitoring:
```bash
# Add Papertrail for log management (optional)
heroku addons:create papertrail:choklad
```

## Continuous Deployment

### GitHub Integration

1. Go to Heroku Dashboard > Your App > Deploy
2. Choose "GitHub" as deployment method
3. Connect your repository
4. Enable "Automatic Deploys" from main branch
5. Enable "Wait for CI to pass" (optional)

Now every push to main triggers automatic deployment.

### Manual Deployment

```bash
# Deploy from local git
git push heroku main

# Deploy specific branch
git push heroku feature-branch:main
```

## Security Best Practices

1. Keep dependencies updated:
   ```bash
   npm audit
   npm audit fix
   ```

2. Use secrets manager for sensitive data (don't commit `.env`)

3. Enable Heroku SSL (automatic for all apps)

4. Regularly review Heroku access logs

5. Implement rate limiting and CSRF protection (future enhancement)

## Cost Optimization

### Free Tier Limits
- Eco dynos: Sleep after 30 min of inactivity
- PostgreSQL Essential-0: 1GB storage, 20 connections
- 1000 dyno hours/month (free tier)

### Scaling
```bash
# Scale up for production traffic
heroku ps:scale web=2

# Upgrade database
heroku addons:upgrade heroku-postgresql:standard-0
```

## Rollback

### Rollback to Previous Release

```bash
# View releases
heroku releases

# Rollback to previous version
heroku rollback

# Rollback to specific version
heroku rollback v42
```

### Rollback Database Migration

```bash
# This is more complex - requires manual intervention
# 1. Restore from backup
heroku pg:backups:restore b001 DATABASE_URL

# 2. Or create down migration manually
```

## Next Steps

After successful deployment:
1. Test all features in production
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up CI/CD pipeline
5. Implement error tracking (Sentry, etc.)
6. Add performance monitoring

## Support

- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
