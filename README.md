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
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js (credentials provider)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ (tested with Node 22)
- npm or similar package manager

### Installation

1. Clone and install dependencies:

```bash
cd experiment-manager
npm install
```

2. Set up the database:

```bash
npm run db:push    # Create database schema
npm run db:seed    # Seed with demo user and sample experiment
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

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

### 🚧 Planned Enhancements
- Go-live validation and status transitions (DRAFT → LIVE → PAUSED → ENDED)
- Edit restrictions on live experiments
- Advanced filtering and search
- Export experiment configurations
- Real-time notifications
- Enhanced audit log visualization

## Go-Live Validation

Experiments cannot transition from DRAFT → LIVE unless:

1. **Traffic Allocation**: All variants sum to exactly 100%
2. **Variant Count**: At least 2 variants exist
3. **Primary KPI**: A KPI has been selected
4. **Targeting**: At least one targeting rule is defined

See [lib/validations.ts](lib/validations.ts) for implementation.

## API Routes

### Experiments
- `GET /api/experiments` - List all experiments (implemented)
- `POST /api/experiments` - Create new experiment (implemented)
- `GET /api/experiments/[id]` - Get experiment details (page route)
- `PATCH /api/experiments/[id]` - Update experiment (planned)
- `DELETE /api/experiments/[id]` - Delete experiment (planned)

## Database Scripts

```bash
npm run db:push       # Push schema changes to database
npm run db:seed       # Seed database with demo data
npm run db:studio     # Open Prisma Studio GUI
```

## Development Notes

### Why SQLite?

- Zero configuration required
- Lightweight and fast for development
- Easy to inspect with Prisma Studio (`npm run db:studio`)
- Can be swapped for PostgreSQL in production environments

### Why String instead of JSON type for targeting?

SQLite doesn't have native JSON support in Prisma, so targeting rules and secondary KPIs are stored as stringified JSON. The application handles parsing on read/write operations.

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
