# AGENTS.md — Arqui ASM

## Setup & Run Order

```bash
cp env.example .env      # note: env.example, not .env.example
# edit .env: set DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_API_KEY
npm install               # runs `prisma generate` via postinstall — needs .env first
npx prisma migrate dev    # apply migrations (creates DB if needed)
npm run seed              # populate exercises from data/exercises.txt
npm run dev               # http://localhost:3000
```

- **PostgreSQL only.** The schema uses `postgresql` provider — there is no SQLite fallback. The README's mention of SQLite for development is outdated.
- **`env.example`** (no leading dot) is the committed template. Create `.env` BEFORE `npm install` or the postinstall `prisma generate` will fail without `DATABASE_URL`.
- **`GOOGLE_API_KEY`** is required for submission grading. The app starts without it, but `POST /api/submissions` throws.

## Commands

| Command | Notes |
|---|---|
| `npm run build` | Runs `prisma generate && next build` — never use `next build` directly |
| `npm run lint` | ESLint (Next core-web-vitals + typescript rules) |
| `npm run migrate` | `prisma migrate dev` (development) |
| `npm run migrate:prod` | `prisma migrate deploy` (production) |
| `npm run seed` | Runs `scripts/seed-exercises.js` — idempotent upsert |

- **No test command.** No test framework is installed. Don't try `npm test`.
- **No formatter.** Prettier is not configured.

## Key Files

| File | Role |
|---|---|
| `src/lib/auth.ts` | NextAuth v4 config. Credentials provider, JWT sessions. Augments session with `user.id` and `user.isAdmin` via `(session as any)` casts — this pattern is required project-wide. |
| `src/lib/prisma.ts` | Singleton PrismaClient. **Imports from `../generated/prisma`** — the output is non-standard (not `node_modules/.prisma/client`). |
| `src/lib/exercises.ts` | Custom YAML-like parser for `exercises.txt`. Defines the supported fields: `id`, `practica` (int), `title`, `prompt`, `expected_solution`, `tags` (array). Blocks separated by `\n---\s*\n`. Leading `|` on multiline values is stripped. |
| `src/lib/exercises.js` | **COMPILED ARTIFACT of `exercises.ts`. Do NOT edit directly.** Edits are lost on next TS compilation. |
| `src/lib/zod.ts` | `SubmissionCreateSchema` (exerciseId + code) and `GradeResultSchema` (AI response shape). |
| `src/services/gradeService.ts` | Gemini 2.5 Flash-Lite grading. Enforces JSON response with one retry. Called from `POST /api/submissions`. |
| `scripts/seed-exercises.js` | Active seed script (wired to `npm run seed`). Contains a **duplicate parser** — must stay in sync with `src/lib/exercises.ts`. |
| `scripts/seed-exercises.ts` | **Dead code.** Not wired to any npm script. Ignore it. |

## API Routes — Auth Requirements

| Route | Auth | Notes |
|---|---|---|
| `GET /api/exercises` | None | Public |
| `GET /api/exercises/[id]` | None | Public |
| `POST /api/submissions` | Session required | Rate-limited: 10s in-memory per user (resets on cold start) |
| `POST /api/register` | None | Public registration |
| `POST /api/admin/reparse` | Session + `isAdmin` | Re-parses `exercises.txt` into DB |

## Gotchas

- **Dual parser sync**: Changing `exercises.ts` requires updating `seed-exercises.js` (and vice versa). They are independent implementations.
- **Rate limiting is in-memory** (`Map` in `submissions/route.ts`). Won't work across serverless instances.
- **ESLint disabled during builds** (`next.config.ts` → `ignoreDuringBuilds: true`). Run `npm run lint` separately.
- **TypeScript errors DO block builds** (`ignoreBuildErrors: false`).
- **NextAuth v4** (not v5). Access session fields via `(session as any).user.id` and `(session as any).user.isAdmin`. ESLint's `no-explicit-any` is turned off for this.
- **Prisma output**: `src/generated/prisma/`. Changing `schema.prisma` output path breaks all imports.
- **Vercel**: `vercel.json` caps API functions at 30s. Gemini calls + retry can approach this limit.
- **Tailwind CSS v4**: Uses `@import "tailwindcss"` in CSS and `@tailwindcss/postcss` plugin. No `tailwind.config.ts`.
- **`suppressHydrationWarning`** on `<html>` in root layout — intentional.

## Adding Exercises

1. Edit `data/exercises.txt` — each block uses this format:
   ```
   ---
   id: exercise-id
   practica: 1
   title: Exercise Title
   tags: ["tag1", "tag2"]
   prompt: |
     Description text...
   expected_solution: |
     ORG 1000H
     ...
   ---
   ```
2. Run `npm run seed` (or POST to `/api/admin/reparse` as admin)
3. Exercises appear on `/exercises` immediately
