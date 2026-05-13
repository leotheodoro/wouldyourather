# Would You Rather — Project Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the `wouldyourather` Next.js project with TypeScript, TailwindCSS v4, Biome, Drizzle ORM, tRPC v11, TanStack React Query v5, Vercel AI SDK, and Zod — all wired together and ready for feature development.

**Architecture:** tRPC v11 handles all data operations via React Query (server-side caller for RSC, `api.xxx.useQuery()` hooks for client components). Vercel AI SDK streams via a dedicated `app/api/ai/route.ts` Route Handler. Drizzle ORM connects to PostgreSQL and its `db` instance is injected via the tRPC context.

**Tech Stack:** Next.js 15 (App Router), TypeScript (strict), TailwindCSS v4, Biome, Drizzle ORM + drizzle-kit, PostgreSQL (postgres.js driver), tRPC v11, TanStack React Query v5, Vercel AI SDK, Zod

---

## File Map

| File | Purpose |
|---|---|
| `src/server/db/schema.ts` | Drizzle table definitions |
| `src/server/db/index.ts` | Drizzle client (postgres.js) |
| `src/server/trpc/init.ts` | tRPC instance, context, procedure builders |
| `src/server/trpc/router.ts` | Root AppRouter |
| `src/server/trpc/routers/.gitkeep` | Placeholder for feature routers directory |
| `src/trpc/client.ts` | Browser-side tRPC vanilla client |
| `src/trpc/server.ts` | Server-side tRPC caller (RSC, no HTTP) |
| `src/trpc/react.tsx` | Typed React hooks via `createTRPCReact` |
| `src/components/providers.tsx` | `QueryClientProvider` + `TRPCReactProvider` |
| `src/app/layout.tsx` | Root layout — mounts `Providers` |
| `src/app/api/trpc/[trpc]/route.ts` | tRPC HTTP adapter |
| `src/app/api/ai/route.ts` | AI SDK streaming endpoint |
| `drizzle.config.ts` | Drizzle-kit config |
| `biome.json` | Biome linting + formatting |
| `.env.example` | Required env var template |
| `CLAUDE.md` | Stack reference for AI assistants |

---

### Task 1: Bootstrap Next.js project

**Files:**
- Create: whole project scaffold via `create-next-app`
- Modify: `postcss.config.mjs`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Scaffold Next.js project**

Run from inside `/Users/thdr/www/personal/wouldyourather`:

```bash
pnpm create next-app@latest . --typescript --tailwind --no-eslint --app --src-dir --import-alias "@/*" --yes
```

Expected: Next.js scaffolded into the current directory. Files created include `package.json`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `postcss.config.mjs`.

- [ ] **Step 2: Install Tailwind v4 and its PostCSS plugin**

```bash
pnpm add tailwindcss@^4 @tailwindcss/postcss
```

Expected: `tailwindcss@4.x.x` in `package.json` dependencies.

- [ ] **Step 3: Update PostCSS config for Tailwind v4**

Replace the entire `postcss.config.mjs` with:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 4: Update globals.css for Tailwind v4 CSS-first syntax**

Replace the entire `src/app/globals.css` with:

```css
@import "tailwindcss";
```

- [ ] **Step 5: Remove any Tailwind v3 config files**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

Expected: Command runs without error (files may not exist, that's fine).

- [ ] **Step 6: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "chore: bootstrap Next.js with TypeScript and TailwindCSS v4"
```

---

### Task 2: Configure Biome

**Files:**
- Create: `biome.json`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install Biome**

```bash
pnpm add -D @biomejs/biome
```

Expected: `@biomejs/biome` appears in `devDependencies` in `package.json`.

- [ ] **Step 2: Create biome.json**

Create `biome.json` at the project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "warn",
        "noUnusedVariables": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all"
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "dist",
      "drizzle",
      "docs"
    ]
  }
}
```

- [ ] **Step 3: Replace the scripts section in package.json**

Open `package.json` and replace the entire `"scripts"` block with:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "check": "biome check --write .",
  "check:ci": "biome ci .",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
},
```

- [ ] **Step 4: Verify Biome runs**

```bash
pnpm check:ci
```

Expected: Biome runs and outputs a report. Exit code may be non-zero if generated code has style issues — that's acceptable at this stage. What matters is it runs without crashing.

- [ ] **Step 5: Commit**

```bash
git add biome.json package.json
git commit -m "chore: add Biome for linting and formatting"
```

---

### Task 3: Set up Drizzle ORM

**Files:**
- Create: `src/server/db/schema.ts`
- Create: `src/server/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `.env.example`

- [ ] **Step 1: Install Drizzle packages**

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

Expected: `drizzle-orm`, `postgres` in `dependencies`; `drizzle-kit` in `devDependencies`.

- [ ] **Step 2: Create the schema file**

Create `src/server/db/schema.ts`:

```typescript
// Add Drizzle table definitions here.
// Example:
// import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
//
// export const questions = pgTable('questions', {
//   id: serial('id').primaryKey(),
//   optionA: text('option_a').notNull(),
//   optionB: text('option_b').notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// })
```

- [ ] **Step 3: Create the DB connection**

Create `src/server/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })

export type DB = typeof db
```

- [ ] **Step 4: Create drizzle.config.ts**

Create `drizzle.config.ts` at the project root:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 5: Create .env.example**

Create `.env.example` at the project root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/wouldyourather

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/server/db/ drizzle.config.ts .env.example
git commit -m "chore: add Drizzle ORM with PostgreSQL config"
```

---

### Task 4: Set up tRPC server

**Files:**
- Create: `src/server/trpc/init.ts`
- Create: `src/server/trpc/router.ts`
- Create: `src/server/trpc/routers/.gitkeep`
- Create: `src/app/api/trpc/[trpc]/route.ts`
- Create: `src/trpc/server.ts`

- [ ] **Step 1: Install tRPC server packages and Zod**

```bash
pnpm add @trpc/server@11 zod
```

Expected: `@trpc/server` and `zod` in `dependencies`.

- [ ] **Step 2: Create tRPC init file**

Create `src/server/trpc/init.ts`:

```typescript
import { initTRPC } from '@trpc/server'
import { cache } from 'react'
import { ZodError } from 'zod'
import { db } from '../db'

export const createTRPCContext = cache(async () => {
  return { db }
})

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure
```

- [ ] **Step 3: Create the root router**

Create `src/server/trpc/router.ts`:

```typescript
import { createTRPCRouter } from './init'

export const appRouter = createTRPCRouter({
  // Register feature routers here:
  // example: exampleRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 4: Create the routers directory**

```bash
mkdir -p src/server/trpc/routers
touch src/server/trpc/routers/.gitkeep
```

- [ ] **Step 5: Create the tRPC Route Handler**

Create `src/app/api/trpc/[trpc]/route.ts`:

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type NextRequest } from 'next/server'
import { createTRPCContext } from '@/server/trpc/init'
import { appRouter } from '@/server/trpc/router'

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`tRPC error on ${path ?? '<no-path>'}:`, error)
          }
        : undefined,
  })

export { handler as GET, handler as POST }
```

- [ ] **Step 6: Create the server-side tRPC caller for RSC**

Create `src/trpc/server.ts`:

```typescript
import 'server-only'
import { createCallerFactory, createTRPCContext } from '@/server/trpc/init'
import { appRouter } from '@/server/trpc/router'

const createCaller = createCallerFactory(appRouter)

export const trpc = createCaller(createTRPCContext)
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/server/trpc/ src/app/api/trpc/ src/trpc/server.ts
git commit -m "feat: add tRPC server with context, router, and route handler"
```

---

### Task 5: Set up tRPC client and React Query providers

**Files:**
- Create: `src/trpc/react.tsx`
- Create: `src/trpc/client.ts`
- Create: `src/components/providers.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install tRPC client and React Query packages**

```bash
pnpm add @trpc/client@11 @trpc/react-query@11 @tanstack/react-query@5 @tanstack/react-query-devtools@5
```

Expected: All four packages in `dependencies`.

- [ ] **Step 2: Create the typed React hooks**

Create `src/trpc/react.tsx`:

```typescript
'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/trpc/router'

export const api = createTRPCReact<AppRouter>()
```

- [ ] **Step 3: Create the browser vanilla client**

Create `src/trpc/client.ts`:

```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/server/trpc/router'

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
})
```

- [ ] **Step 4: Create the Providers component**

Create `src/components/providers.tsx`:

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import { api } from '@/trpc/react'

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClientInstance] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  )

  return (
    <api.Provider client={trpcClientInstance} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </api.Provider>
  )
}
```

- [ ] **Step 5: Mount Providers in root layout**

Replace the entire contents of `src/app/layout.tsx` with:

```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Would You Rather',
  description: 'Would you rather...',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Verify the production build passes**

```bash
pnpm build
```

Expected: Build completes with no errors. Output shows pages compiled successfully.

- [ ] **Step 8: Commit**

```bash
git add src/trpc/ src/components/ src/app/layout.tsx
git commit -m "feat: add tRPC client, React Query providers, and root layout"
```

---

### Task 6: Set up Vercel AI SDK

**Files:**
- Create: `src/app/api/ai/route.ts`

- [ ] **Step 1: Install AI SDK packages**

```bash
pnpm add ai @ai-sdk/anthropic @ai-sdk/openai
```

Expected: `ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai` in `dependencies`.

- [ ] **Step 2: Create the AI streaming Route Handler**

Create `src/app/api/ai/route.ts`:

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { streamText, type CoreMessage } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const {
    messages,
    provider = 'anthropic',
  }: { messages: CoreMessage[]; provider?: 'anthropic' | 'openai' } = await req.json()

  const model =
    provider === 'openai'
      ? openai('gpt-4o')
      : anthropic('claude-sonnet-4-6')

  const result = streamText({
    model,
    messages,
  })

  return result.toDataStreamResponse()
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai/
git commit -m "feat: add Vercel AI SDK streaming route handler"
```

---

### Task 7: Create CLAUDE.md and finalize

**Files:**
- Create: `CLAUDE.md`
- Verify: `.gitignore` includes `.env.local`

- [ ] **Step 1: Ensure .env.local is gitignored**

```bash
grep -q "\.env\.local" .gitignore || echo ".env.local" >> .gitignore
```

Expected: `.env.local` is present in `.gitignore`.

- [ ] **Step 2: Create CLAUDE.md**

Create `CLAUDE.md` at the project root:

```markdown
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
```

- [ ] **Step 3: Run final Biome format pass**

```bash
pnpm check
```

Expected: All files formatted and linted. Exit code 0.

- [ ] **Step 4: Run final TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Run final production build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Final commit**

```bash
git add CLAUDE.md .gitignore
git commit -m "docs: add CLAUDE.md with stack reference and architecture guide"
```
