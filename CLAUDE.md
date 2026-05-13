# Would You Rather — Claude Reference

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript (strict) |
| Styling | TailwindCSS v4 (CSS-first, no config file needed) |
| Linting / Formatting | Biome (`biome.json` at root — replaces ESLint + Prettier) |
| Validation | Zod |
| ORM | Drizzle ORM + drizzle-kit |
| Database | PostgreSQL (postgres.js driver) |
| API Layer | tRPC v11 |
| Client Data Fetching | TanStack React Query v5 (via tRPC React Query integration) |
| AI | Vercel AI SDK (provider-agnostic: Anthropic + OpenAI) |

## Architecture

**tRPC for data, Route Handlers for AI streaming.**

- `src/server/trpc/` — tRPC server: context, root router, feature routers
- `src/app/api/trpc/[trpc]/route.ts` — tRPC HTTP adapter
- `src/app/api/ai/route.ts` — AI SDK streaming endpoint (`streamText` via `@ai-sdk/anthropic` or `@ai-sdk/openai`)
- `src/trpc/server.ts` — Server-side caller for React Server Components (no HTTP round-trip)
- `src/trpc/react.tsx` — Typed React Query hooks (`api.xxx.useQuery()`, `api.xxx.useMutation()`)
- `src/components/providers.tsx` — `QueryClientProvider` + `TRPCReactProvider` (mounted in root layout)

## Key Files

| File | Purpose |
|---|---|
| `src/server/db/schema.ts` | Drizzle table definitions — add tables here |
| `src/server/db/index.ts` | Drizzle `db` client (imported by tRPC context) |
| `src/server/trpc/init.ts` | tRPC instance, `publicProcedure`, `createTRPCRouter` |
| `src/server/trpc/router.ts` | Root `AppRouter` — register feature routers here |
| `src/server/trpc/routers/` | Feature routers — one file per domain |
| `src/app/api/ai/route.ts` | AI streaming endpoint — POST `{ messages, provider? }` |

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm check        # Biome format + lint (auto-fix)
pnpm check:ci     # Biome check (no auto-fix, for CI)
pnpm db:generate  # Generate Drizzle migration files
pnpm db:migrate   # Apply migrations to the database
pnpm db:studio    # Open Drizzle Studio
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```
DATABASE_URL=postgresql://user:password@localhost:5432/wouldyourather

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

## Adding a New tRPC Router

1. Create `src/server/trpc/routers/my-feature.ts`:
   ```typescript
   import { createTRPCRouter, publicProcedure } from '../init'

   export const myFeatureRouter = createTRPCRouter({
     list: publicProcedure.query(({ ctx }) => {
       return ctx.db.select()...
     }),
   })
   ```

2. Register it in `src/server/trpc/router.ts`:
   ```typescript
   import { myFeatureRouter } from './routers/my-feature'

   export const appRouter = createTRPCRouter({
     myFeature: myFeatureRouter,
   })
   ```

3. Use it in a Client Component:
   ```typescript
   const { data } = api.myFeature.list.useQuery()
   ```

   Or in a Server Component:
   ```typescript
   import { trpc } from '@/trpc/server'
   const data = await trpc.myFeature.list()
   ```

## Using the AI SDK

POST to `/api/ai` with body `{ messages: CoreMessage[], provider?: 'anthropic' | 'openai' }`.

Default provider is Anthropic (`claude-sonnet-4-6`). Use `useChat()` from `ai/react` for chat UIs, `useCompletion()` for single-turn text completion.
