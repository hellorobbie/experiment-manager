# Experiment Manager

A full-stack experiment management platform for internal teams to create, manage, and track A/B tests. Built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## What This Is

This is a **control-plane application** for managing experiment configurations—not a feature flagging SDK or traffic routing system. Think of it as an internal admin tool where PMs and marketers can:

- Define experiment variants and traffic splits
- Set targeting rules (device, country, channel)
- Enforce validation before going live
- Track changes via an audit log

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (credentials provider)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ (tested with Node 22)
- npm or similar package manager
- PostgreSQL 14+ installed and running
  - Download from [postgresql.org](https://www.postgresql.org/download/)
  - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

### Installation

1. Clone and install dependencies:

```bash
cd experiment-manager
npm install
```

2. Set up PostgreSQL database:

```bash
# Using psql (SQL Shell)
psql -U postgres
CREATE DATABASE experiment_manager_dev;
\q
```

3. Configure environment variables:

Copy [.env.example](.env.example) to `.env` and update with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/experiment_manager_dev?schema=public"
```

4. Run database migrations and seed:

```bash
npm run db:migrate:dev    # Run migrations
npm run db:seed           # Seed with demo user and sample experiment
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

```
Email: demo@example.com
Password: password123
```

## Project Structure

```
experiment-manager/
├── app/
│   ├── (auth)/               # Authentication routes (login)
│   │   └── login/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   └── experiments/
│   │       ├── [id]/        # Experiment detail pages
│   │       └── new/         # Create new experiment
│   ├── api/
│   │   ├── auth/            # NextAuth API routes
│   │   └── experiments/     # Experiment CRUD API
│   └── layout.tsx           # Root layout
│
├── components/
│   └── experiments/         # Experiment wizard step components
│
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── auth.ts              # NextAuth configuration
│   ├── validations.ts       # Zod schemas and go-live validation
│   ├── audit.ts             # Audit log helpers
│   └── types.ts             # Shared TypeScript types
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seed script
│
└── types/
    └── next-auth.d.ts       # NextAuth TypeScript definitions
```

## Data Model

### User
- Basic auth (email/password)
- Owns experiments

### Experiment
- **Metadata**: name, description, hypothesis, owner
- **Status**: DRAFT → LIVE → PAUSED → ENDED
- **Targeting**: JSON object with device, country, channel, user type, and language rules
- **KPIs**: Primary KPI and up to 5 secondary KPIs
- **Variants**: Array of test variations with traffic allocation

### Variant
- Name, description, traffic percentage (0-100)
- `isControl` flag for baseline

### AuditLog
- Tracks all changes to experiments
- Stores JSON diffs of what changed

## Features

### ✅ Completed
- **5-step experiment creation wizard**
  - Basic information (name, description, hypothesis)
  - Variant configuration with traffic allocation
  - Targeting rules (device, country, channel, user type, language)
  - KPI selection (1 primary + up to 5 secondary KPIs)
  - Review and confirmation
- **Authentication** - NextAuth.js with credential provider
- **Experiment management** - List, view, and create experiments
- **Audit logging** - Track all changes to experiments
- **Dark theme UI** - Professional dark gray color palette

### ✅ Phase 2 & 3 - Status Management
- **Status transitions** - DRAFT → LIVE → PAUSED → ENDED with validation
- **Go-live validation** - Enforces traffic allocation, variant count, KPI selection, and targeting rules
- **Status controls** - Action buttons for status transitions with validation error display
- **Experiment lock notice** - Visual indicator when experiments are locked

### ✅ Phase 4 - Advanced Features
- **Filtering and search** - Filter experiments by status, search by name/description, sort options
- **Audit log timeline** - Visual timeline with expandable change diffs
- **Dashboard overview** - Stats cards, recent experiments, and activity feed

### ✅ Phase 5 - Production Readiness
- **PostgreSQL migration** - Full migration from SQLite to PostgreSQL
- **Database indexes** - Performance optimization for queries
- **Heroku deployment configuration** - Production-ready setup with Procfile and app.json

### 🚧 Planned Enhancements
- Export experiment configurations (JSON, CSV)
- Edit restrictions on live experiments
- Real-time notifications
- Enhanced error handling and UX improvements
- Security hardening (CSRF, rate limiting)

## Go-Live Validation

Experiments cannot transition from DRAFT → LIVE unless:

1. **Traffic Allocation**: All variants sum to exactly 100%
2. **Variant Count**: At least 2 variants exist
3. **Primary KPI**: A KPI has been selected
4. **Targeting**: At least one targeting rule is defined

See [lib/validations.ts](lib/validations.ts) for implementation.

## Deployment

This application is configured for deployment to Heroku with PostgreSQL.

For complete deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick deployment:
```bash
# Create Heroku app with PostgreSQL
heroku create your-app-name
heroku addons:create heroku-postgresql:essential-0

# Set environment variables
heroku config:set AUTH_SECRET=$(openssl rand -base64 32)

# Deploy
git push heroku main

# Run migrations and seed
heroku run npx prisma migrate deploy
heroku run npm run db:seed
```

## API Routes

### Experiments
- `GET /api/experiments` - List all experiments
- `POST /api/experiments` - Create new experiment
- `GET /api/experiments/[id]` - Get experiment details (page route)
- `PATCH /api/experiments/[id]` - Update experiment status
- `DELETE /api/experiments/[id]` - Delete experiment (planned)

## Database Scripts

```bash
npm run db:migrate:dev    # Run migrations in development (creates migration files)
npm run db:migrate        # Deploy migrations in production
npm run db:seed           # Seed database with demo data
npm run db:studio         # Open Prisma Studio GUI
```

## Development Notes

### Why PostgreSQL?

- Production-ready database for both local and deployed environments
- Native JSON support for complex data structures
- Better performance at scale
- Database parity between development and production

### Database Migrations

This project uses Prisma Migrate for database schema management:
- Migration files are stored in [prisma/migrations](prisma/migrations)
- Run `npm run db:migrate:dev` after schema changes
- Migrations are automatically applied on Heroku deployment via `heroku-postbuild`

### Why String for JSON fields?

Although PostgreSQL supports native JSON types, we're using String fields for `targeting`, `secondaryKPIs`, and `changes` to maintain compatibility with the initial SQLite setup and simplify data handling in the application layer.

### Why NextAuth credentials provider?

The credentials provider keeps the auth setup simple and self-contained. Production deployments should consider OAuth providers (Google, GitHub, etc.) for enhanced security.

## Scope & Limitations

This application focuses on the experiment configuration management layer. The following are intentionally excluded:

- ❌ Traffic routing SDK or feature flagging engine
- ❌ Real-time analytics or event processing
- ❌ Multi-user approval workflows
- ❌ Role-based access control (RBAC)
- ❌ Multi-tenancy support

## License

MIT
