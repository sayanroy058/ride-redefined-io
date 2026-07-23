# DriveHub — Premium Used Car Marketplace

A full-stack marketplace for buying and selling certified pre-owned cars. **React + Vite** frontend with a **Node.js + Express** backend and **SQLite3** database.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS v4, TanStack Router, TanStack Query |
| Backend | Node.js, Express 5, TypeScript |
| Database | SQLite3 (via `better-sqlite3`) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| UI | Radix UI, Lucide Icons, Recharts, Sonner |
| Forms | React Hook Form + Zod |

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start both servers (backend + frontend)
npm run dev:all
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@drivehub.io` | `admin` |
| Agent | `agent@drivehub.io` | `agent` |

## Available Scripts

```bash
# Development
npm run dev           # Start Vite frontend only
npm run dev:server    # Start Express backend only (hot-reload via tsx watch)
npm run dev:all       # Start both concurrently

# Build
npm run build         # Production Vite build
npm run build:dev     # Development Vite build
npm run preview       # Preview production build

# Database
npm run migrate       # Run pending migrations
npm run seed          # Seed the database with sample data
npm run server        # Start backend (one-shot, no watch)

# Quality
npm run typecheck     # TypeScript type checking
npm run lint          # ESLint
npm run format        # Prettier
```

## Project Structure

```
ride-redefined-io/
├── server/                  # Backend
│   ├── server.ts            # Express entry point
│   ├── db.ts                # SQLite connection + pragmas
│   ├── migrate.ts           # Migration runner
│   ├── seed.ts              # Seed data (cars, users, offers, reviews, tickets)
│   ├── middleware/
│   │   └── auth.ts          # JWT auth middleware (requireAuth, optionalAuth)
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Full schema
│   └── routes/
│       ├── auth.ts          # Login, register, profile
│       ├── listings.ts      # CRUD + search
│       ├── offers.ts        # Offers CRUD
│       ├── bookings.ts      # Bookings CRUD
│       ├── tickets.ts       # Support tickets
│       ├── reviews.ts       # Reviews (GET public, POST auth)
│       ├── conversations.ts # Chat messages
│       ├── saved-searches.ts
│       └── wishlist.ts
├── src/                     # Frontend
│   ├── main.tsx             # React entry point
│   ├── router.tsx           # TanStack Router setup
│   ├── lib/
│   │   ├── api.ts           # HTTP client (JWT Bearer auth)
│   │   ├── store.tsx         # React Context state
│   │   ├── types.ts         # TypeScript types
│   │   ├── constants.ts     # BRANDS, BODY_TYPES, etc.
│   │   ├── validations.ts   # Zod schemas
│   │   └── queries.ts       # React Query keys
│   ├── components/
│   │   ├── site/            # Feature components
│   │   └── ui/              # shadcn/ui components
│   └── routes/              # File-based routes
├── vite.config.ts           # Vite config (API proxy to :3001)
├── tsconfig.json
└── package.json
```

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/login` | Login (returns JWT) |
| `POST` | `/api/auth/register` | Register (returns JWT) |
| `GET` | `/api/listings` | All listings |
| `GET` | `/api/listings/search?brand=Tesla` | Search/filter |
| `GET` | `/api/listings/:id` | Single listing |
| `GET` | `/api/listings/:id/similar` | Similar cars |
| `GET` | `/api/reviews?listingId=:id` | Reviews for a listing |

### Protected (Bearer token required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/me` | Current user profile |
| `PATCH` | `/api/auth/profile` | Update profile |
| `GET` | `/api/offers?listingId=:id` | Offers |
| `POST` | `/api/offers` | Create offer |
| `PATCH` | `/api/offers/:id` | Update offer |
| `GET` | `/api/bookings?userId=:id` | Bookings |
| `POST` | `/api/bookings` | Create booking |
| `GET` | `/api/tickets` | Support tickets |
| `POST` | `/api/tickets` | Create ticket |
| `POST` | `/api/reviews` | Add review |
| `GET` | `/api/conversations?userId=:id` | Conversations |
| `POST` | `/api/conversations` | Start conversation |
| `POST` | `/api/conversations/:id/messages` | Send message |
| `GET/POST/DELETE` | `/api/saved-searches` | Saved searches |
| `GET/POST` | `/api/wishlist` | Wishlist |

## Database Migrations

Migrations live in `server/migrations/` as numbered SQL files. They run automatically on server start.

```bash
# Run migrations manually
npm run migrate

# Add a new migration
# 1. Create server/migrations/002_your_change.sql
# 2. Run: npm run migrate
# 3. Or restart the server — pending migrations apply automatically
```

The `_migrations` table tracks applied migrations so they never run twice.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Backend server port |
| `JWT_SECRET` | `drivehub-dev-secret-change-in-production` | JWT signing secret |

## How It Works

1. **Server starts** → runs pending migrations → seeds sample data (14 cars, tickets, offers, reviews)
2. **Vite dev server** proxies `/api/*` requests to `http://localhost:3001`
3. **Frontend** calls API endpoints with JWT Bearer token in `Authorization` header
4. **Auth middleware** verifies the token and attaches `userId`/`userRole` to the request
