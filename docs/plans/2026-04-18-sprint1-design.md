# Sprint 1 Design — FondosChile

## Goal
Deliver a complete vertical slice: DB schema, ANID scraper, and public UI with fund listing.

## Stack
Next.js 14+ (App Router), TypeScript strict, Supabase (Postgres), Tailwind CSS + shadcn/ui, Zod, Playwright (scraping), Vercel deploy.

## UI Design System
MiniMax-inspired per DESIGN.md:
- White-dominant backgrounds, colorful fund cards as accents
- Fonts: DM Sans (UI), Outfit (display headings), Poppins (mid-tier), Roboto (data)
- Pill buttons (9999px radius) for nav/filters, 8px radius for CTAs
- Cards: 20-24px radius, purple-tinted shadows for featured
- Colors: Brand blue #1456f0, primary #3b82f6, text #222222, secondary text #45515e

## Architecture

### Pages
1. **Home** (`app/(public)/page.tsx`) — Hero + featured open funds
2. **Fund listing** (`app/(public)/fondos/page.tsx`) — Filterable grid with status/agency/area filters
3. **Fund detail** (`app/(public)/fondos/[slug]/page.tsx`) — Full call info, dates, requirements, PDF link
4. **Layout** (`app/layout.tsx`) — Nav header + dark footer

### Components
- `FundCard` — Card with agency badge, title, deadline, amount, status
- `FundFilters` — Filter bar with pill toggles for status, agency, area
- `DeadlineBadge` — Color-coded countdown badge
- `Navbar` — White sticky header with pill nav items
- `Footer` — Dark (#181e25) multi-column footer

### Data Flow
- Server Components fetch from Supabase via `lib/supabase/server.ts`
- ISR revalidation at 1 hour for public pages
- Client Components only for interactive filters

### DB Schema
All tables as specified in CLAUDE.md: agencies, funds, calls, areas, call_areas, awarded_projects, subscriptions.

### Scraper
- Base `Scraper` interface in `lib/scrapers/base.ts`
- ANID scraper using Playwright for JS-rendered pages
- Parser normalizing raw data to `calls` schema
- Upsert on `official_url`, preserve manual status overrides
- Raw HTML stored in `calls.raw_source`

### API Routes
- `app/api/cron/scrape-anid/route.ts` — CRON_SECRET authenticated
- Vercel cron config in `vercel.json`

## Out of Scope (Sprint 1)
- Auth & subscriptions (Sprint 4)
- Corfo/FIA scrapers (Sprint 2)
- Historical/awarded projects view (Sprint 3)
- Public API (Sprint 5)
