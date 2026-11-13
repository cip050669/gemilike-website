# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 16 (App Router, React 19, Turbopack) e-commerce app for a gemstone
shop ("Gemilike"). It uses Prisma 7 + PostgreSQL, NextAuth (credentials), and next-intl
(locale-prefixed routes, default `de`). There is one product/service: the web app.

### Services and how to run them

- Dev server: `npm run dev` (Next.js on http://localhost:3000). Standard scripts live in
  `package.json` (`lint`, `test`, `build`, `dev`). Prefer `npm run dev`, not `build`/`start`.
- PostgreSQL is required. It is installed in the VM image but is NOT auto-started. Start it
  before running the app or any Prisma command:
  `sudo pg_ctlcluster 16 main start`
  The dev database/role already exist: role `gemilike` / password `dev-password` / database
  `gemilike_dev`, matching `DATABASE_URL` in `.env`.

### Non-obvious gotchas

- `.env` is gitignored and lives only in the VM snapshot (not in git). It contains
  `DATABASE_URL`, `NEXTAUTH_SECRET`, and the dev admin fallback creds. If it is missing,
  recreate it from `.env.example` / `docker-compose.dev.yml` values.
- Prisma 7 CLI commands (`prisma generate`, `prisma db push`) read `prisma.config.ts`, which
  THROWS if `DATABASE_URL` is not set in the process env. `.env` is NOT auto-loaded for the
  Prisma CLI, so load it first, e.g.: `set -a && . ./.env && set +a && npx prisma db push`.
  (Next.js itself does auto-load `.env`, so the running app does not need this.)
- Seeding is broken under Prisma 7: `npx prisma db seed` and the scripts in `prisma/` and
  `scripts/` construct `new PrismaClient()` without an adapter, which Prisma 7 rejects. Only
  `lib/prisma.ts` was migrated (it wires the `@prisma/adapter-pg` adapter). The running app,
  API routes, and `prisma db push`/`generate` work fine; the standalone seed scripts do not.
  Create data through the app/API instead of the seed scripts.
- Admin login: there is an env-based fallback admin in `lib/auth.ts`, so you can log in
  without a seeded DB user. Use `admin@gemilike.com` / `admin123` at `/de/admin/login`.
- Routing: `next.config.ts` sets trailing slashes and all routes are locale-prefixed. Use
  `/de/...` for pages and `/api/.../` (with trailing slash) for API calls; a missing trailing
  slash returns a 308 redirect. The gemstone list API is `/api/admin/gemstones/` and the
  public shop API is `/api/shop/gemstones/`.
- Node: `.nvmrc` pins Node 22. The VM's Node 22.x works; some deps warn `EBADENGINE`
  (want >=22.19.0) but this is only a warning and does not break dev/build/test.
- `npm install` MUST use `--legacy-peer-deps` (a `nodemailer` peer-dependency conflict with
  `@auth/core` otherwise fails the install).

### Tests / lint

- `npm run lint` passes clean.
- `npm test` (jest, jsdom): the large majority pass. Two suites currently fail with pre-existing
  assertion mismatches unrelated to environment setup:
  `__tests__/components/shop/GemstoneGrid.test.tsx` and `__tests__/admin/dashboard.test.tsx`.
