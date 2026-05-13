# Would You Rather — Project Stack Design

**Date:** 2026-05-13  
**Status:** Approved

---

## Overview

A new Next.js application named `wouldyourather`. This document captures the agreed tech stack, architecture decisions, and project structure for the initial scaffold.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript (strict) |
| Styling | TailwindCSS v4 (CSS-first config) |
| Linting / Formatting | Biome (replaces ESLint + Prettier) |
| Validation | Zod |
| ORM | Drizzle ORM + drizzle-kit |
| Database | PostgreSQL |
| API Layer | tRPC v11 |
| Client Data Fetching | TanStack React Query v5 (via tRPC React Query integration) |
| AI | Vercel AI SDK (provider-agnostic; Anthropic + OpenAI) |

---

## Architecture

### Decision: tRPC for data, Route Handlers for AI

- **tRPC** handles all application data operations (CRUD, queries). Server Components call tRPC via a server-side caller (no HTTP overhead). Client Components use tRPC's React Query integration.
- **Next.js Route Handlers** (`app/api/ai/route.ts`) handle AI SDK streaming endpoints. The AI SDK's `streamText()` returns streaming responses that are not well-suited to tRPC's request-response model.

---

## Project Structure

```
wouldyourather/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout — mounts providers
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── trpc/[trpc]/route.ts      # tRPC HTTP adapter (fetchRequestHandler)
│   │       └── ai/route.ts               # AI SDK streaming endpoint
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts                 # Drizzle table definitions
│   │   │   └── index.ts                  # Drizzle client instance (postgres.js driver)
│   │   └── trpc/
│   │       ├── init.ts                   # createTRPCContext + procedure builders
│   │       ├── router.ts                 # Root AppRouter (merged feature routers)
│   │       └── routers/                  # One file per feature domain
│   ├── trpc/
│   │   ├── client.ts                     # createTRPCClient for browser
│   │   ├── server.ts                     # createCallerFactory for RSC
│   │   └── react.tsx                     # TRPCReactProvider + typed hooks
│   └── components/
│       └── providers.tsx                 # QueryClientProvider + TRPCReactProvider
├── drizzle.config.ts                     # Points to server/db/schema.ts + DB URL
├── biome.json                            # Biome lint + format config
├── .env.example                          # Committed list of required env vars
├── .env.local                            # Local secrets (gitignored)
└── CLAUDE.md                             # Stack reference for AI assistants
```

---

## Key Integration Details

### tRPC

- Package: `@trpc/server`, `@trpc/client`, `@trpc/react-query`
- Context (`server/trpc/init.ts`) injects the Drizzle `db` instance
- Server Components use `createCallerFactory` from `trpc/server.ts` — no HTTP round-trip
- Client Components use `api.xxx.useQuery()` / `api.xxx.useMutation()` hooks from `trpc/react.tsx`
- Route handler (`app/api/trpc/[trpc]/route.ts`) uses `fetchRequestHandler`

### React Query

- `QueryClientProvider` in `components/providers.tsx` (client component)
- tRPC's React Query integration is the primary query interface
- `staleTime` configured globally to reduce unnecessary refetches

### Drizzle ORM

- Driver: `postgres` (node-postgres compatible)
- Schema: `src/server/db/schema.ts`
- Migration scripts via drizzle-kit:
  - `pnpm db:generate` → generate migration files
  - `pnpm db:migrate` → apply migrations
  - `pnpm db:studio` → open Drizzle Studio

### AI SDK

- Package: `ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`
- Providers configured via env vars (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`)
- Streaming via `streamText()` in Route Handler
- Client hooks: `useChat()`, `useCompletion()` from `ai/react`

### Biome

- Single `biome.json` at project root
- Replaces ESLint and Prettier entirely
- Scripts: `biome check --write` (format + lint), `biome check` (CI)

---

## Environment Variables

Required vars documented in `.env.example`:

```
DATABASE_URL=

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

---

## NPM Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "check": "biome check --write .",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

---

## CLAUDE.md

A `CLAUDE.md` at the project root will document:
- The full tech stack (as above)
- Key architectural decisions (tRPC for data, route handlers for AI)
- Script reference
- File locations for schema, routers, and AI endpoints
