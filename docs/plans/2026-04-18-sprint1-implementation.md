# Sprint 1 Implementation Plan — FondosChile

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a working vertical slice — Next.js app with Supabase DB, ANID scraper, and public fund listing UI following MiniMax design system.

**Architecture:** Next.js 14+ App Router with Server Components for public pages (ISR 1h). Supabase for Postgres DB + auth + storage. Scrapers run via Vercel Cron hitting authenticated API routes. UI follows MiniMax-inspired design system (DESIGN.md).

**Tech Stack:** Next.js 14+, TypeScript strict, Supabase, Tailwind CSS 3, shadcn/ui, Zod, Playwright (scraping), Vitest, Resend.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.local.example`, `.gitignore`, `vercel.json`
- Create: `app/layout.tsx`, `app/globals.css`

**Step 1: Initialize Next.js project**

Run:
```bash
cd C:\Devs\fondos-chile
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: Project scaffolded with App Router, Tailwind, TypeScript.

**Step 2: Install core dependencies**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr zod date-fns date-fns-tz resend p-limit
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom playwright @playwright/test cheerio
```

**Step 3: Create `.env.local.example`**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Step 4: Create `vercel.json`**

```json
{
  "crons": [
    { "path": "/api/cron/scrape-anid", "schedule": "0 6 * * *" },
    { "path": "/api/cron/scrape-corfo", "schedule": "30 6 * * *" },
    { "path": "/api/cron/scrape-fia", "schedule": "45 6 * * *" },
    { "path": "/api/cron/send-alerts", "schedule": "0 8 * * *" }
  ]
}
```

**Step 5: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run",
"typecheck": "tsc --noEmit"
```

**Step 6: Update `.gitignore`**

Ensure it includes:
```
.env.local
.env*.local
node_modules/
.next/
```

**Step 7: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with dependencies"
```

---

### Task 2: Design System — Tailwind Configuration

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Configure Tailwind with DESIGN.md tokens**

`tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["Outfit", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mid: ["Poppins", "sans-serif"],
        data: ["Roboto", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#1456f0",
          sky: "#3daeff",
          pink: "#ea5ec1",
          deep: "#17437d",
        },
        primary: {
          200: "#bfdbfe",
          light: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        surface: {
          white: "#ffffff",
          light: "#f0f0f0",
          border: "#e5e7eb",
          "border-light": "#f2f3f5",
        },
        text: {
          primary: "#222222",
          dark: "#18181b",
          charcoal: "#181e25",
          secondary: "#45515e",
          muted: "#8e8e93",
          helper: "#5f5f5f",
        },
      },
      borderRadius: {
        minimal: "4px",
        standard: "8px",
        comfortable: "13px",
        generous: "20px",
        large: "24px",
        pill: "9999px",
      },
      boxShadow: {
        subtle: "0px 4px 6px rgba(0, 0, 0, 0.08)",
        ambient: "0px 0px 22.576px rgba(0, 0, 0, 0.08)",
        "brand-glow": "0px 0px 15px rgba(44, 30, 116, 0.16)",
        "brand-offset": "6.5px 2px 17.5px rgba(44, 30, 116, 0.11)",
        elevated: "0px 12px 16px -4px rgba(36, 36, 36, 0.08)",
      },
      fontSize: {
        hero: ["5rem", { lineHeight: "1.10", fontWeight: "500" }],
        "section-heading": ["1.94rem", { lineHeight: "1.50", fontWeight: "600" }],
        "card-title": ["1.75rem", { lineHeight: "1.71", fontWeight: "600" }],
        "sub-heading": ["1.50rem", { lineHeight: "1.50", fontWeight: "500" }],
        "feature-label": ["1.13rem", { lineHeight: "1.50", fontWeight: "500" }],
        "body-large": ["1.25rem", { lineHeight: "1.50", fontWeight: "500" }],
        caption: ["0.81rem", { lineHeight: "1.70", fontWeight: "400" }],
        "small-label": ["0.75rem", { lineHeight: "1.50", fontWeight: "500" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

**Step 2: Set up globals.css with font imports and base styles**

`app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Roboto:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface-white text-text-primary font-sans antialiased;
    font-size: 16px;
    line-height: 1.50;
  }

  h1, h2, h3 {
    @apply font-display;
  }
}
```

**Step 3: Install tailwindcss-animate**

```bash
npm install tailwindcss-animate
```

**Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css package.json package-lock.json
git commit -m "feat: configure design system tokens from DESIGN.md"
```

---

### Task 3: shadcn/ui Setup

**Files:**
- Create: `components/ui/` (button, card, badge, input, select, etc.)
- Create: `components.json`
- Create: `lib/utils.ts`

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Choose: New York style, Zinc base color, CSS variables = yes.

**Step 2: Add core components**

```bash
npx shadcn@latest add button card badge input select separator sheet
```

**Step 3: Create `lib/utils.ts`**

If not already created by shadcn:
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCLP(amount: number | bigint): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(date))
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui components and utility functions"
```

---

### Task 4: Supabase Client Setup

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/admin.ts`
- Create: `types/database.ts`

**Step 1: Create browser client**

`lib/supabase/client.ts`:
```ts
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 2: Create server client**

`lib/supabase/server.ts`:
```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  )
}
```

**Step 3: Create admin client (service role)**

`lib/supabase/admin.ts`:
```ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**Step 4: Create initial type stubs**

`types/database.ts`:
```ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          slug: string
          name: string
          short_name: string | null
          website: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['agencies']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['agencies']['Insert']>
      }
      funds: {
        Row: {
          id: string
          agency_id: string
          slug: string
          name: string
          description: string | null
          typical_amount_clp: number | null
          target_audience: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['funds']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['funds']['Insert']>
      }
      calls: {
        Row: {
          id: string
          fund_id: string
          year: number
          title: string
          status: 'upcoming' | 'open' | 'closed' | 'awarded' | 'cancelled'
          opens_at: string | null
          closes_at: string | null
          results_at: string | null
          start_date: string | null
          max_amount_clp: number | null
          duration_months: number | null
          requirements: string | null
          official_url: string
          bases_pdf_url: string | null
          raw_source: Json | null
          last_scraped_at: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['calls']['Row'], 'id' | 'last_scraped_at' | 'created_at' | 'updated_at'> & {
          id?: string
          last_scraped_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['calls']['Insert']>
      }
      areas: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: Omit<Database['public']['Tables']['areas']['Row'], 'id'> & {
          id?: string
        }
        Update: Partial<Database['public']['Tables']['areas']['Insert']>
      }
      call_areas: {
        Row: {
          call_id: string
          area_id: string
        }
        Insert: Database['public']['Tables']['call_areas']['Row']
        Update: Partial<Database['public']['Tables']['call_areas']['Insert']>
      }
      awarded_projects: {
        Row: {
          id: string
          call_id: string
          project_code: string | null
          title: string
          principal_investigator: string | null
          institution: string | null
          amount_clp: number | null
          year: number
          abstract: string | null
          source_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['awarded_projects']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['awarded_projects']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          agency_ids: string[] | null
          area_ids: string[] | null
          min_amount_clp: number | null
          email_enabled: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'email_enabled'> & {
          id?: string
          created_at?: string
          email_enabled?: boolean
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Agency = Database['public']['Tables']['agencies']['Row']
export type Fund = Database['public']['Tables']['funds']['Row']
export type Call = Database['public']['Tables']['calls']['Row']
export type Area = Database['public']['Tables']['areas']['Row']
export type AwardedProject = Database['public']['Tables']['awarded_projects']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

// Joined types for UI
export type CallWithFundAndAgency = Call & {
  fund: Fund & {
    agency: Agency
  }
}
```

**Step 5: Commit**

```bash
git add lib/supabase/ types/database.ts
git commit -m "feat: add Supabase clients and database types"
```

---

### Task 5: Database Migration

**Files:**
- Create: `supabase/migrations/00001_initial_schema.sql`
- Create: `supabase/seed.sql`

**Step 1: Create migration file**

`supabase/migrations/00001_initial_schema.sql`:
```sql
-- Agencias financiadoras
create table agencies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text,
  website text,
  logo_url text,
  created_at timestamptz default now()
);

-- Programas o líneas de fondo
create table funds (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  typical_amount_clp bigint,
  target_audience text,
  created_at timestamptz default now()
);

-- Convocatorias concretas
create table calls (
  id uuid primary key default gen_random_uuid(),
  fund_id uuid references funds(id) on delete cascade,
  year int not null,
  title text not null,
  status text not null check (status in ('upcoming','open','closed','awarded','cancelled')),
  opens_at timestamptz,
  closes_at timestamptz,
  results_at timestamptz,
  start_date date,
  max_amount_clp bigint,
  duration_months int,
  requirements text,
  official_url text not null,
  bases_pdf_url text,
  raw_source jsonb,
  last_scraped_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Areas temáticas
create table areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table call_areas (
  call_id uuid references calls(id) on delete cascade,
  area_id uuid references areas(id) on delete cascade,
  primary key (call_id, area_id)
);

-- Proyectos adjudicados
create table awarded_projects (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references calls(id) on delete cascade,
  project_code text,
  title text not null,
  principal_investigator text,
  institution text,
  amount_clp bigint,
  year int not null,
  abstract text,
  source_url text,
  created_at timestamptz default now()
);

-- Suscripciones de alerta
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  agency_ids uuid[],
  area_ids uuid[],
  min_amount_clp bigint,
  email_enabled boolean default true,
  created_at timestamptz default now()
);

-- Indices
create index idx_calls_status_closes on calls(status, closes_at);
create index idx_calls_fund on calls(fund_id);
create index idx_awarded_year on awarded_projects(year desc);
create index idx_awarded_institution on awarded_projects(institution);

-- RLS
alter table agencies enable row level security;
alter table funds enable row level security;
alter table calls enable row level security;
alter table areas enable row level security;
alter table call_areas enable row level security;
alter table awarded_projects enable row level security;
alter table subscriptions enable row level security;

-- Public read for all content tables
create policy "Public read agencies" on agencies for select using (true);
create policy "Public read funds" on funds for select using (true);
create policy "Public read calls" on calls for select using (true);
create policy "Public read areas" on areas for select using (true);
create policy "Public read call_areas" on call_areas for select using (true);
create policy "Public read awarded_projects" on awarded_projects for select using (true);

-- Subscriptions: users can only see/modify their own
create policy "Users read own subscriptions" on subscriptions for select using (auth.uid() = user_id);
create policy "Users insert own subscriptions" on subscriptions for insert with check (auth.uid() = user_id);
create policy "Users update own subscriptions" on subscriptions for update using (auth.uid() = user_id);
create policy "Users delete own subscriptions" on subscriptions for delete using (auth.uid() = user_id);
```

**Step 2: Create seed data**

`supabase/seed.sql`:
```sql
-- Agencias
insert into agencies (slug, name, short_name, website) values
  ('anid', 'Agencia Nacional de Investigación y Desarrollo', 'ANID', 'https://anid.cl'),
  ('corfo', 'Corporación de Fomento de la Producción', 'Corfo', 'https://www.corfo.cl'),
  ('fia', 'Fundación para la Innovación Agraria', 'FIA', 'https://www.fia.cl'),
  ('minciencia', 'Ministerio de Ciencia, Tecnología, Conocimiento e Innovación', 'Minciencia', 'https://www.minciencia.gob.cl');

-- Areas temáticas
insert into areas (slug, name) values
  ('ciencias-naturales', 'Ciencias Naturales'),
  ('ingenieria-tecnologia', 'Ingeniería y Tecnología'),
  ('ciencias-medicas', 'Ciencias Médicas y de la Salud'),
  ('ciencias-agricolas', 'Ciencias Agrícolas y Veterinarias'),
  ('ciencias-sociales', 'Ciencias Sociales'),
  ('humanidades-artes', 'Humanidades y Artes'),
  ('multidisciplinario', 'Multidisciplinario');

-- Fondos de ejemplo (ANID)
insert into funds (agency_id, slug, name, description, typical_amount_clp, target_audience) values
  ((select id from agencies where slug = 'anid'), 'fondecyt-regular', 'Fondecyt Regular', 'Proyectos de investigación de 2 a 4 años para investigadores con doctorado.', 150000000, 'Investigadores/as con grado de Doctor/a'),
  ((select id from agencies where slug = 'anid'), 'fondecyt-iniciacion', 'Fondecyt de Iniciación', 'Proyectos de investigación para investigadores jóvenes.', 90000000, 'Investigadores/as jóvenes con doctorado'),
  ((select id from agencies where slug = 'anid'), 'fondecyt-postdoctorado', 'Fondecyt de Postdoctorado', 'Estadías de investigación postdoctoral.', 50000000, 'Investigadores/as con doctorado reciente'),
  ((select id from agencies where slug = 'anid'), 'fondef-idea', 'FONDEF IDeA', 'Investigación aplicada y desarrollo tecnológico.', 200000000, 'Equipos de investigación con vínculo empresarial'),
  ((select id from agencies where slug = 'anid'), 'fondap', 'FONDAP', 'Centros de excelencia en investigación.', 1500000000, 'Grupos de investigación consolidados');

-- Convocatorias de ejemplo
insert into calls (fund_id, year, title, status, opens_at, closes_at, max_amount_clp, duration_months, official_url, requirements) values
  ((select id from funds where slug = 'fondecyt-regular'), 2026, 'Fondecyt Regular 2026', 'open', '2026-03-01T00:00:00Z', '2026-06-15T23:59:59Z', 200000000, 48, 'https://anid.cl/concursos/fondecyt-regular-2026', '- Poseer grado de Doctor/a\n- Estar asociado a una institución chilena\n- No tener proyectos Fondecyt vigentes como investigador/a responsable'),
  ((select id from funds where slug = 'fondecyt-iniciacion'), 2026, 'Fondecyt de Iniciación 2026', 'open', '2026-04-01T00:00:00Z', '2026-07-01T23:59:59Z', 100000000, 36, 'https://anid.cl/concursos/fondecyt-iniciacion-2026', '- Poseer grado de Doctor/a obtenido hace menos de 5 años\n- Primera postulación como investigador/a responsable'),
  ((select id from funds where slug = 'fondef-idea'), 2026, 'FONDEF IDeA I+D 2026', 'upcoming', '2026-05-15T00:00:00Z', '2026-08-30T23:59:59Z', 250000000, 24, 'https://anid.cl/concursos/fondef-idea-2026', '- Equipo con al menos un Doctor/a\n- Carta de compromiso de empresa asociada\n- Cofinanciamiento mínimo de 20%'),
  ((select id from funds where slug = 'fondecyt-regular'), 2025, 'Fondecyt Regular 2025', 'awarded', '2025-03-01T00:00:00Z', '2025-06-15T23:59:59Z', 180000000, 48, 'https://anid.cl/concursos/fondecyt-regular-2025', '- Poseer grado de Doctor/a\n- Estar asociado a una institución chilena'),
  ((select id from funds where slug = 'fondecyt-postdoctorado'), 2026, 'Fondecyt Postdoctorado 2026', 'closed', '2026-01-15T00:00:00Z', '2026-03-31T23:59:59Z', 60000000, 36, 'https://anid.cl/concursos/fondecyt-postdoc-2026', '- Doctorado obtenido hace menos de 3 años\n- Institución patrocinante confirmada');

-- Link calls to areas
insert into call_areas (call_id, area_id)
select c.id, a.id from calls c, areas a
where c.title = 'Fondecyt Regular 2026' and a.slug in ('ciencias-naturales', 'ingenieria-tecnologia', 'ciencias-sociales', 'humanidades-artes');

insert into call_areas (call_id, area_id)
select c.id, a.id from calls c, areas a
where c.title = 'FONDEF IDeA I+D 2026' and a.slug in ('ingenieria-tecnologia', 'ciencias-agricolas');
```

**Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add database migration and seed data"
```

---

### Task 6: Shared Layout — Navbar Component

**Files:**
- Create: `components/shared/Navbar.tsx`
- Create: `components/shared/MobileNav.tsx`
- Create: `components/shared/Logo.tsx`

**Step 1: Create Logo component**

`components/shared/Logo.tsx`:
```tsx
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-standard bg-brand-blue flex items-center justify-center">
        <span className="text-white font-display font-semibold text-sm">FC</span>
      </div>
      <span className="font-display font-semibold text-lg text-text-dark">
        FondosChile
      </span>
    </Link>
  )
}
```

**Step 2: Create Navbar**

`components/shared/Navbar.tsx`:
```tsx
import Link from "next/link"
import { Logo } from "./Logo"
import { MobileNav } from "./MobileNav"

const navItems = [
  { href: "/fondos", label: "Fondos" },
  { href: "/historico", label: "Histórico" },
  { href: "/agencias", label: "Agencias" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface-white/80 backdrop-blur-md border-b border-surface-border-light">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-text-dark rounded-pill hover:bg-black/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-text-dark hover:text-brand-blue transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <MobileNav items={navItems} />
        </div>
      </nav>
    </header>
  )
}
```

**Step 3: Create MobileNav**

`components/shared/MobileNav.tsx`:
```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface MobileNavProps {
  items: { href: string; label: string }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-text-dark"
        aria-label="Menú"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-surface-white border-b border-surface-border shadow-subtle p-4">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-text-dark rounded-standard hover:bg-black/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-surface-border-light" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-medium text-brand-blue"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
```

**Step 4: Install lucide-react**

```bash
npm install lucide-react
```

**Step 5: Commit**

```bash
git add components/shared/ package.json package-lock.json
git commit -m "feat: add navbar with mobile navigation"
```

---

### Task 7: Shared Layout — Footer Component

**Files:**
- Create: `components/shared/Footer.tsx`

**Step 1: Create Footer**

`components/shared/Footer.tsx`:
```tsx
import Link from "next/link"
import { Logo } from "./Logo"

const footerLinks = {
  plataforma: [
    { href: "/fondos", label: "Fondos vigentes" },
    { href: "/historico", label: "Archivo histórico" },
    { href: "/historico/adjudicados", label: "Proyectos adjudicados" },
  ],
  agencias: [
    { href: "/agencias/anid", label: "ANID" },
    { href: "/agencias/corfo", label: "Corfo" },
    { href: "/agencias/fia", label: "FIA" },
    { href: "/agencias/minciencia", label: "Minciencia" },
  ],
  recursos: [
    { href: "#", label: "Guía de postulación" },
    { href: "#", label: "Preguntas frecuentes" },
    { href: "#", label: "API para desarrolladores" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-text-charcoal text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-standard bg-brand-blue flex items-center justify-center">
                <span className="text-white font-display font-semibold text-sm">FC</span>
              </div>
              <span className="font-display font-semibold text-lg text-white">
                FondosChile
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              La fuente única de verdad sobre el ecosistema de financiamiento CTCi en Chile.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          © {new Date().getFullYear()} FondosChile. Datos obtenidos de fuentes oficiales públicas.
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add components/shared/Footer.tsx
git commit -m "feat: add dark footer component"
```

---

### Task 8: Root Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update root layout**

`app/layout.tsx`:
```tsx
import type { Metadata } from "next"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "FondosChile — Fondos de investigación e innovación en Chile",
    template: "%s | FondosChile",
  },
  description:
    "Encuentra todos los fondos de investigación, innovación y desarrollo disponibles en Chile. ANID, Corfo, FIA, FONDEF y más.",
  keywords: [
    "fondos investigación Chile",
    "ANID",
    "Corfo",
    "Fondecyt",
    "FONDEF",
    "innovación Chile",
    "financiamiento CTCi",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: set up root layout with navbar and footer"
```

---

### Task 9: Fund UI Components

**Files:**
- Create: `components/funds/DeadlineBadge.tsx`
- Create: `components/funds/StatusBadge.tsx`
- Create: `components/funds/FundCard.tsx`
- Create: `components/funds/FundFilters.tsx`

**Step 1: Create DeadlineBadge**

`components/funds/DeadlineBadge.tsx`:
```tsx
import { differenceInDays, isPast } from "date-fns"

interface DeadlineBadgeProps {
  closesAt: string | null
  status: string
}

export function DeadlineBadge({ closesAt, status }: DeadlineBadgeProps) {
  if (!closesAt || status !== "open") return null

  const deadline = new Date(closesAt)
  const daysLeft = differenceInDays(deadline, new Date())

  if (isPast(deadline)) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-red-100 text-red-700">
        Plazo vencido
      </span>
    )
  }

  if (daysLeft <= 7) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-orange-100 text-orange-700">
        {daysLeft === 0 ? "Último día" : `${daysLeft}d restantes`}
      </span>
    )
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-yellow-100 text-yellow-700">
        {daysLeft}d restantes
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-green-100 text-green-700">
      {daysLeft}d restantes
    </span>
  )
}
```

**Step 2: Create StatusBadge**

`components/funds/StatusBadge.tsx`:
```tsx
const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: "Abierto",
    className: "bg-green-100 text-green-700",
  },
  upcoming: {
    label: "Próximamente",
    className: "bg-primary-200 text-primary-700",
  },
  closed: {
    label: "Cerrado",
    className: "bg-gray-100 text-gray-600",
  },
  awarded: {
    label: "Adjudicado",
    className: "bg-purple-100 text-purple-700",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-600",
  },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-600" }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  )
}
```

**Step 3: Create FundCard**

`components/funds/FundCard.tsx`:
```tsx
import Link from "next/link"
import { StatusBadge } from "./StatusBadge"
import { DeadlineBadge } from "./DeadlineBadge"
import { formatCLP, formatDate } from "@/lib/utils"
import type { CallWithFundAndAgency } from "@/types/database"

interface FundCardProps {
  call: CallWithFundAndAgency
}

export function FundCard({ call }: FundCardProps) {
  return (
    <Link href={`/fondos/${call.fund.slug}`}>
      <article className="group bg-surface-white rounded-generous border border-surface-border p-6 hover:shadow-brand-glow transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-small-label font-semibold text-brand-blue uppercase tracking-wider">
            {call.fund.agency.short_name ?? call.fund.agency.name}
          </span>
          <StatusBadge status={call.status} />
        </div>

        {/* Title */}
        <h3 className="font-display text-card-title text-text-dark mb-2 group-hover:text-brand-blue transition-colors">
          {call.title}
        </h3>

        {/* Fund name */}
        <p className="text-sm text-text-secondary mb-4">
          {call.fund.name}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-caption text-text-muted">
          {call.max_amount_clp && (
            <span>Hasta {formatCLP(call.max_amount_clp)}</span>
          )}
          {call.duration_months && (
            <span>{call.duration_months} meses</span>
          )}
          {call.closes_at && (
            <span>Cierre: {formatDate(call.closes_at, { month: "short" })}</span>
          )}
        </div>

        {/* Deadline */}
        <div className="mt-4">
          <DeadlineBadge closesAt={call.closes_at} status={call.status} />
        </div>
      </article>
    </Link>
  )
}
```

**Step 4: Create FundFilters**

`components/funds/FundFilters.tsx`:
```tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { Agency, Area } from "@/types/database"

interface FundFiltersProps {
  agencies: Agency[]
  areas: Area[]
}

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "open", label: "Abiertos" },
  { value: "upcoming", label: "Próximos" },
  { value: "closed", label: "Cerrados" },
]

export function FundFilters({ agencies, areas }: FundFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") ?? ""
  const currentAgency = searchParams.get("agency") ?? ""
  const currentArea = searchParams.get("area") ?? ""

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/fondos?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3">
      {/* Status pills */}
      <div className="flex gap-1">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter("status", opt.value)}
            className={`px-4 py-2 text-sm font-medium rounded-pill transition-colors ${
              currentStatus === opt.value
                ? "bg-text-charcoal text-white"
                : "bg-black/5 text-text-dark hover:bg-black/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Agency select */}
      <select
        value={currentAgency}
        onChange={(e) => updateFilter("agency", e.target.value)}
        className="px-4 py-2 text-sm font-medium rounded-standard border border-surface-border bg-surface-white text-text-dark"
      >
        <option value="">Todas las agencias</option>
        {agencies.map((a) => (
          <option key={a.id} value={a.slug}>
            {a.short_name ?? a.name}
          </option>
        ))}
      </select>

      {/* Area select */}
      <select
        value={currentArea}
        onChange={(e) => updateFilter("area", e.target.value)}
        className="px-4 py-2 text-sm font-medium rounded-standard border border-surface-border bg-surface-white text-text-dark"
      >
        <option value="">Todas las áreas</option>
        {areas.map((a) => (
          <option key={a.id} value={a.slug}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

**Step 5: Commit**

```bash
git add components/funds/
git commit -m "feat: add fund card, filters, status and deadline badges"
```

---

### Task 10: Home Page

**Files:**
- Create: `app/(public)/page.tsx`

**Step 1: Create home page**

`app/(public)/page.tsx`:
```tsx
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import type { CallWithFundAndAgency } from "@/types/database"
import { ArrowRight, Search, Bell, Database } from "lucide-react"

export const revalidate = 3600 // 1 hour ISR

async function getOpenCalls(): Promise<CallWithFundAndAgency[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("calls")
    .select("*, fund:funds(*, agency:agencies(*))")
    .in("status", ["open", "upcoming"])
    .order("closes_at", { ascending: true })
    .limit(6)

  return (data ?? []) as unknown as CallWithFundAndAgency[]
}

const features = [
  {
    icon: Search,
    title: "Búsqueda centralizada",
    description: "Todos los fondos de ANID, Corfo, FIA y más en un solo lugar.",
  },
  {
    icon: Bell,
    title: "Alertas personalizadas",
    description: "Recibe notificaciones cuando se publique un fondo que coincida con tu perfil.",
  },
  {
    icon: Database,
    title: "Archivo histórico",
    description: "Consulta convocatorias anteriores y proyectos adjudicados.",
  },
]

export default async function HomePage() {
  const calls = await getOpenCalls()

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-hero text-text-dark mb-6">
            Fondos de investigación en Chile
          </h1>
          <p className="text-body-large text-text-secondary max-w-2xl mx-auto mb-10">
            Encuentra, compara y postula a todos los fondos de investigación, innovación
            y desarrollo disponibles en Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fondos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-text-charcoal text-white rounded-standard font-semibold text-sm hover:bg-text-dark transition-colors"
            >
              Explorar fondos
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/historico"
              className="inline-flex items-center justify-center px-6 py-3 bg-surface-light text-text-dark rounded-standard font-semibold text-sm hover:bg-surface-border transition-colors"
            >
              Ver histórico
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-surface-border-light">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-section-heading text-text-dark text-center mb-12">
            Todo sobre fondos CTCi en un solo lugar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="text-center p-8 rounded-generous bg-surface-white border border-surface-border-light"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-comfortable bg-primary-200 flex items-center justify-center">
                  <f.icon size={24} className="text-primary-600" />
                </div>
                <h3 className="font-mid text-feature-label text-text-dark mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Calls */}
      {calls.length > 0 && (
        <section className="py-20 px-4 border-t border-surface-border-light">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-section-heading text-text-dark">
                Convocatorias vigentes
              </h2>
              <Link
                href="/fondos?status=open"
                className="text-sm font-medium text-brand-blue hover:text-primary-700 transition-colors flex items-center gap-1"
              >
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calls.map((call) => (
                <FundCard key={call.id} call={call} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/\(public\)/page.tsx
git commit -m "feat: add home page with hero, features, and open calls"
```

---

### Task 11: Fund Listing Page

**Files:**
- Create: `app/(public)/fondos/page.tsx`

**Step 1: Create fund listing page**

`app/(public)/fondos/page.tsx`:
```tsx
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import { FundFilters } from "@/components/funds/FundFilters"
import type { CallWithFundAndAgency } from "@/types/database"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fondos vigentes",
  description: "Explora todos los fondos de investigación e innovación disponibles en Chile.",
}

export const revalidate = 3600

interface PageProps {
  searchParams: Promise<{
    status?: string
    agency?: string
    area?: string
  }>
}

async function getCalls(filters: {
  status?: string
  agency?: string
  area?: string
}): Promise<CallWithFundAndAgency[]> {
  const supabase = await createClient()

  let query = supabase
    .from("calls")
    .select("*, fund:funds(*, agency:agencies(*))")
    .order("closes_at", { ascending: true })

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  if (filters.agency) {
    query = query.eq("fund.agency.slug", filters.agency)
  }

  const { data } = await query.limit(50)

  let results = (data ?? []) as unknown as CallWithFundAndAgency[]

  // Filter out results where the join didn't match (agency filter)
  if (filters.agency) {
    results = results.filter((c) => c.fund?.agency?.slug === filters.agency)
  }

  return results
}

export default async function FondosPage({ searchParams }: PageProps) {
  const filters = await searchParams
  const supabase = await createClient()

  const [calls, { data: agencies }, { data: areas }] = await Promise.all([
    getCalls(filters),
    supabase.from("agencies").select("*").order("name"),
    supabase.from("areas").select("*").order("name"),
  ])

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-section-heading text-text-dark mb-2">
          Fondos disponibles
        </h1>
        <p className="text-text-secondary mb-8">
          Explora las convocatorias de financiamiento para investigación e innovación en Chile.
        </p>

        <Suspense fallback={null}>
          <FundFilters agencies={agencies ?? []} areas={areas ?? []} />
        </Suspense>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calls.map((call) => (
            <FundCard key={call.id} call={call} />
          ))}
        </div>

        {calls.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-body-large">
              No se encontraron convocatorias con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/\(public\)/fondos/page.tsx
git commit -m "feat: add fund listing page with filters"
```

---

### Task 12: Fund Detail Page

**Files:**
- Create: `app/(public)/fondos/[slug]/page.tsx`

**Step 1: Create fund detail page**

`app/(public)/fondos/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatusBadge } from "@/components/funds/StatusBadge"
import { DeadlineBadge } from "@/components/funds/DeadlineBadge"
import { formatCLP, formatDate } from "@/lib/utils"
import { ArrowLeft, ExternalLink, FileText, Calendar, Clock, Banknote } from "lucide-react"
import type { Metadata } from "next"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getFundWithCalls(slug: string) {
  const supabase = await createClient()

  const { data: fund } = await supabase
    .from("funds")
    .select("*, agency:agencies(*)")
    .eq("slug", slug)
    .single()

  if (!fund) return null

  const { data: calls } = await supabase
    .from("calls")
    .select("*")
    .eq("fund_id", fund.id)
    .order("year", { ascending: false })

  return { fund, calls: calls ?? [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getFundWithCalls(slug)
  if (!data) return { title: "Fondo no encontrado" }

  return {
    title: data.fund.name,
    description: data.fund.description ?? `Información sobre ${data.fund.name}`,
  }
}

export default async function FundDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getFundWithCalls(slug)

  if (!data) notFound()

  const { fund, calls } = data
  const latestCall = calls[0]
  const agency = fund.agency as { name: string; short_name: string | null; website: string | null; slug: string }

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Link
          href="/fondos"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-blue transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Volver a fondos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="text-small-label font-semibold text-brand-blue uppercase tracking-wider">
            {agency.short_name ?? agency.name}
          </span>
          <h1 className="font-display text-[2rem] font-semibold text-text-dark mt-1 mb-3">
            {fund.name}
          </h1>
          {fund.description && (
            <p className="text-body-large text-text-secondary">{fund.description}</p>
          )}
          {fund.target_audience && (
            <p className="text-sm text-text-muted mt-2">
              Dirigido a: {fund.target_audience}
            </p>
          )}
        </div>

        {/* Latest call */}
        {latestCall && (
          <div className="rounded-large border border-surface-border p-6 md:p-8 mb-8 shadow-subtle">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="font-display text-sub-heading text-text-dark">
                {latestCall.title}
              </h2>
              <StatusBadge status={latestCall.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {latestCall.max_amount_clp && (
                <div className="flex items-center gap-3">
                  <Banknote size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Monto máximo</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {formatCLP(latestCall.max_amount_clp)}
                    </p>
                  </div>
                </div>
              )}
              {latestCall.duration_months && (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Duración</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {latestCall.duration_months} meses
                    </p>
                  </div>
                </div>
              )}
              {latestCall.opens_at && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Apertura</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {formatDate(latestCall.opens_at)}
                    </p>
                  </div>
                </div>
              )}
              {latestCall.closes_at && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Cierre</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {formatDate(latestCall.closes_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DeadlineBadge closesAt={latestCall.closes_at} status={latestCall.status} />

            {/* Requirements */}
            {latestCall.requirements && (
              <div className="mt-6 pt-6 border-t border-surface-border-light">
                <h3 className="font-mid text-feature-label text-text-dark mb-3">
                  Requisitos
                </h3>
                <div className="prose prose-sm max-w-none text-text-secondary whitespace-pre-line">
                  {latestCall.requirements}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mt-6 pt-6 border-t border-surface-border-light flex flex-wrap gap-3">
              <a
                href={latestCall.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-text-charcoal text-white rounded-standard font-semibold text-sm hover:bg-text-dark transition-colors"
              >
                <ExternalLink size={14} /> Ver convocatoria oficial
              </a>
              {latestCall.bases_pdf_url && (
                <a
                  href={latestCall.bases_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-light text-text-dark rounded-standard font-semibold text-sm hover:bg-surface-border transition-colors"
                >
                  <FileText size={14} /> Descargar bases
                </a>
              )}
            </div>
          </div>
        )}

        {/* Historical calls */}
        {calls.length > 1 && (
          <div>
            <h2 className="font-display text-sub-heading text-text-dark mb-4">
              Convocatorias anteriores
            </h2>
            <div className="space-y-3">
              {calls.slice(1).map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-4 rounded-comfortable border border-surface-border-light"
                >
                  <div>
                    <p className="text-sm font-medium text-text-dark">{call.title}</p>
                    <p className="text-caption text-text-muted">
                      {call.closes_at && formatDate(call.closes_at, { month: "short" })}
                    </p>
                  </div>
                  <StatusBadge status={call.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/\(public\)/fondos/\[slug\]/page.tsx
git commit -m "feat: add fund detail page with call info and requirements"
```

---

### Task 13: Scraper Base Interface

**Files:**
- Create: `lib/scrapers/base.ts`
- Create: `lib/scrapers/types.ts`

**Step 1: Create scraper types**

`lib/scrapers/types.ts`:
```ts
export interface RawCall {
  title: string
  status?: string
  opens_at?: string
  closes_at?: string
  results_at?: string
  max_amount_clp?: number
  duration_months?: number
  requirements?: string
  official_url: string
  bases_pdf_url?: string
  raw_html?: string
}

export interface RawAwardedProject {
  project_code?: string
  title: string
  principal_investigator?: string
  institution?: string
  amount_clp?: number
  year: number
  abstract?: string
  source_url?: string
}
```

**Step 2: Create base scraper interface**

`lib/scrapers/base.ts`:
```ts
import type { RawCall, RawAwardedProject } from "./types"

export interface Scraper {
  agency: string
  fetchCalls(): Promise<RawCall[]>
  fetchAwardedProjects?(year: number): Promise<RawAwardedProject[]>
}

export const SCRAPER_USER_AGENT = "FondosChileBot/1.0 (+https://fondoschile.cl)"
export const SCRAPER_DELAY_MS = 500
export const SCRAPER_CONCURRENCY = 2
```

**Step 3: Commit**

```bash
git add lib/scrapers/
git commit -m "feat: add scraper base interface and types"
```

---

### Task 14: ANID Scraper

**Files:**
- Create: `lib/scrapers/anid.ts`
- Create: `lib/parsers/anid.ts`
- Create: `lib/scrapers/__fixtures__/anid-concursos.html` (sample fixture)

**Step 1: Create ANID parser**

`lib/parsers/anid.ts`:
```ts
import type { RawCall } from "@/lib/scrapers/types"

export function parseAnidCalls(html: string): RawCall[] {
  const calls: RawCall[] = []

  // Use cheerio to parse the HTML
  const cheerio = require("cheerio")
  const $ = cheerio.load(html)

  $(".concurso-item, .contest-item, article.concurso").each(
    (_: number, el: cheerio.Element) => {
      try {
        const $el = $(el)
        const title = $el.find("h2, h3, .title, .concurso-title").first().text().trim()
        const linkEl = $el.find("a[href]").first()
        const official_url = linkEl.attr("href") ?? ""

        if (!title || !official_url) return

        const fullUrl = official_url.startsWith("http")
          ? official_url
          : `https://anid.cl${official_url}`

        // Extract dates if available
        const dateText = $el.find(".fecha, .date, .deadline").text().trim()
        const closes_at = extractDate(dateText)

        // Extract status
        const statusText = $el.find(".estado, .status, .badge").text().trim().toLowerCase()
        const status = mapStatus(statusText)

        calls.push({
          title,
          official_url: fullUrl,
          status,
          closes_at,
          raw_html: $.html(el),
        })
      } catch {
        // Skip individual failures
      }
    }
  )

  return calls
}

function extractDate(text: string): string | undefined {
  // Match common date patterns: dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd
  const match = text.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T23:59:59Z`
  }

  const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    return `${isoMatch[0]}T23:59:59Z`
  }

  return undefined
}

function mapStatus(text: string): string | undefined {
  if (text.includes("abiert") || text.includes("vigente")) return "open"
  if (text.includes("próxim") || text.includes("pronto")) return "upcoming"
  if (text.includes("cerrad")) return "closed"
  if (text.includes("adjudic") || text.includes("resultado")) return "awarded"
  return undefined
}
```

**Step 2: Create ANID scraper**

`lib/scrapers/anid.ts`:
```ts
import type { Scraper } from "./base"
import { SCRAPER_USER_AGENT } from "./base"
import type { RawCall } from "./types"
import { parseAnidCalls } from "@/lib/parsers/anid"

export class AnidScraper implements Scraper {
  agency = "anid"

  async fetchCalls(): Promise<RawCall[]> {
    // Use Playwright for JS-rendered content
    const { chromium } = await import("playwright")
    const browser = await chromium.launch({ headless: true })

    try {
      const context = await browser.newContext({
        userAgent: SCRAPER_USER_AGENT,
      })
      const page = await context.newPage()

      await page.goto("https://anid.cl/concursos/", {
        waitUntil: "networkidle",
        timeout: 30_000,
      })

      // Wait for content to render
      await page.waitForTimeout(2000)

      const html = await page.content()
      return parseAnidCalls(html)
    } finally {
      await browser.close()
    }
  }
}
```

**Step 3: Create fixture for testing**

`lib/scrapers/__fixtures__/anid-concursos.html`:
```html
<html>
<body>
  <div class="concurso-item">
    <h3 class="concurso-title">Fondecyt Regular 2026</h3>
    <span class="estado">Abierto</span>
    <span class="fecha">15/06/2026</span>
    <a href="/concursos/fondecyt-regular-2026">Ver más</a>
  </div>
  <div class="concurso-item">
    <h3 class="concurso-title">FONDEF IDeA I+D 2026</h3>
    <span class="estado">Próximamente</span>
    <span class="fecha">30/08/2026</span>
    <a href="/concursos/fondef-idea-2026">Ver más</a>
  </div>
  <div class="concurso-item">
    <h3 class="concurso-title">Fondecyt Postdoctorado 2026</h3>
    <span class="estado">Cerrado</span>
    <span class="fecha">31/03/2026</span>
    <a href="/concursos/fondecyt-postdoc-2026">Ver más</a>
  </div>
</body>
</html>
```

**Step 4: Commit**

```bash
git add lib/scrapers/ lib/parsers/
git commit -m "feat: add ANID scraper with Playwright and parser"
```

---

### Task 15: Parser Unit Tests

**Files:**
- Create: `lib/parsers/__tests__/anid.test.ts`

**Step 1: Write parser tests**

`lib/parsers/__tests__/anid.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { join } from "path"
import { parseAnidCalls } from "../anid"

const fixture = readFileSync(
  join(__dirname, "../../scrapers/__fixtures__/anid-concursos.html"),
  "utf-8"
)

describe("parseAnidCalls", () => {
  it("parses calls from ANID HTML fixture", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls).toHaveLength(3)
  })

  it("extracts titles correctly", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].title).toBe("Fondecyt Regular 2026")
    expect(calls[1].title).toBe("FONDEF IDeA I+D 2026")
  })

  it("maps status values", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].status).toBe("open")
    expect(calls[1].status).toBe("upcoming")
    expect(calls[2].status).toBe("closed")
  })

  it("extracts and formats dates", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].closes_at).toBe("2026-06-15T23:59:59Z")
    expect(calls[2].closes_at).toBe("2026-03-31T23:59:59Z")
  })

  it("builds full URLs from relative paths", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].official_url).toBe("https://anid.cl/concursos/fondecyt-regular-2026")
  })

  it("handles empty HTML gracefully", () => {
    const calls = parseAnidCalls("<html><body></body></html>")
    expect(calls).toHaveLength(0)
  })
})
```

**Step 2: Run tests**

```bash
npm run test:run -- lib/parsers/__tests__/anid.test.ts
```

Expected: all tests pass.

**Step 3: Commit**

```bash
git add lib/parsers/__tests__/
git commit -m "test: add ANID parser unit tests with HTML fixtures"
```

---

### Task 16: Cron API Route for ANID Scraper

**Files:**
- Create: `app/api/cron/scrape-anid/route.ts`
- Create: `lib/scrapers/upsert.ts`

**Step 1: Create upsert logic**

`lib/scrapers/upsert.ts`:
```ts
import { createAdminClient } from "@/lib/supabase/admin"
import type { RawCall } from "./types"
import crypto from "crypto"

export async function upsertCalls(agencySlug: string, fundSlug: string, rawCalls: RawCall[]) {
  const supabase = createAdminClient()

  // Get fund ID
  const { data: fund } = await supabase
    .from("funds")
    .select("id")
    .eq("slug", fundSlug)
    .single()

  if (!fund) {
    console.error(`Fund not found: ${fundSlug}`)
    return { inserted: 0, updated: 0, errors: 1 }
  }

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const raw of rawCalls) {
    try {
      // Check if call exists by official_url
      const { data: existing } = await supabase
        .from("calls")
        .select("id, status, raw_source")
        .eq("official_url", raw.official_url)
        .single()

      const contentHash = crypto
        .createHash("md5")
        .update(JSON.stringify(raw))
        .digest("hex")

      if (existing) {
        // Don't overwrite manually set statuses
        const protectedStatuses = ["cancelled"]
        if (protectedStatuses.includes(existing.status)) continue

        // Check if content actually changed
        const existingHash = existing.raw_source
          ? (existing.raw_source as { _hash?: string })?._hash
          : null
        if (existingHash === contentHash) continue

        await supabase
          .from("calls")
          .update({
            title: raw.title,
            status: raw.status ?? existing.status,
            opens_at: raw.opens_at,
            closes_at: raw.closes_at,
            max_amount_clp: raw.max_amount_clp,
            duration_months: raw.duration_months,
            requirements: raw.requirements,
            bases_pdf_url: raw.bases_pdf_url,
            raw_source: { ...raw, _hash: contentHash },
            last_scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)

        updated++
      } else {
        const currentYear = new Date().getFullYear()
        await supabase.from("calls").insert({
          fund_id: fund.id,
          year: currentYear,
          title: raw.title,
          status: raw.status ?? "open",
          opens_at: raw.opens_at,
          closes_at: raw.closes_at,
          max_amount_clp: raw.max_amount_clp,
          duration_months: raw.duration_months,
          requirements: raw.requirements,
          official_url: raw.official_url,
          bases_pdf_url: raw.bases_pdf_url,
          raw_source: { ...raw, _hash: contentHash },
        })

        inserted++
      }
    } catch (error) {
      console.error(`Error upserting call: ${raw.title}`, error)
      errors++
    }
  }

  return { inserted, updated, errors }
}
```

**Step 2: Create cron route**

`app/api/cron/scrape-anid/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server"
import { AnidScraper } from "@/lib/scrapers/anid"
import { upsertCalls } from "@/lib/scrapers/upsert"

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const scraper = new AnidScraper()
    const rawCalls = await scraper.fetchCalls()

    console.log(`[scrape-anid] Fetched ${rawCalls.length} calls`)

    // Upsert each call — in Sprint 2 we'll map to specific funds dynamically
    const results = await upsertCalls("anid", "fondecyt-regular", rawCalls)

    return NextResponse.json({
      success: true,
      fetched: rawCalls.length,
      ...results,
    })
  } catch (error) {
    console.error("[scrape-anid] Scraper failed:", error)
    return NextResponse.json(
      { error: "Scraper failed", details: String(error) },
      { status: 500 }
    )
  }
}
```

**Step 3: Commit**

```bash
git add app/api/cron/ lib/scrapers/upsert.ts
git commit -m "feat: add ANID cron scraper route with upsert logic"
```

---

### Task 17: Utility Tests

**Files:**
- Create: `lib/__tests__/utils.test.ts`

**Step 1: Write utility tests**

`lib/__tests__/utils.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { formatCLP, formatDate } from "../utils"

describe("formatCLP", () => {
  it("formats numbers as Chilean pesos", () => {
    const result = formatCLP(150000000)
    expect(result).toContain("150.000.000")
  })

  it("handles zero", () => {
    const result = formatCLP(0)
    expect(result).toContain("0")
  })
})

describe("formatDate", () => {
  it("formats dates in Chilean Spanish", () => {
    const result = formatDate("2026-06-15T00:00:00Z")
    expect(result).toMatch(/15/)
    expect(result).toMatch(/junio|jun/i)
    expect(result).toMatch(/2026/)
  })
})
```

**Step 2: Run all tests**

```bash
npm run test:run
```

Expected: all tests pass.

**Step 3: Commit**

```bash
git add lib/__tests__/
git commit -m "test: add utility function tests"
```

---

### Task 18: Build & Type Check

**Step 1: Run typecheck**

```bash
npm run typecheck
```

Fix any type errors that arise.

**Step 2: Run build**

```bash
npm run build
```

Fix any build errors.

**Step 3: Run lint**

```bash
npm run lint
```

Fix any lint errors.

**Step 4: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve type and lint errors"
```

---

### Task 19: Agencies Listing Page

**Files:**
- Create: `app/(public)/agencias/page.tsx`
- Create: `app/(public)/agencias/[slug]/page.tsx`

**Step 1: Create agencies listing**

`app/(public)/agencias/page.tsx`:
```tsx
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agencias",
  description: "Agencias financiadoras de investigación e innovación en Chile.",
}

export const revalidate = 3600

export default async function AgenciasPage() {
  const supabase = await createClient()
  const { data: agencies } = await supabase
    .from("agencies")
    .select("*, funds(count)")
    .order("name")

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-section-heading text-text-dark mb-2">
          Agencias financiadoras
        </h1>
        <p className="text-text-secondary mb-8">
          Organismos que financian investigación, innovación y desarrollo en Chile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(agencies ?? []).map((agency) => (
            <Link key={agency.id} href={`/agencias/${agency.slug}`}>
              <div className="group p-6 rounded-generous border border-surface-border hover:shadow-brand-glow transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-comfortable bg-primary-200 flex items-center justify-center">
                    <span className="text-primary-700 font-display font-semibold text-sm">
                      {(agency.short_name ?? agency.name).slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-feature-label text-text-dark group-hover:text-brand-blue transition-colors">
                      {agency.short_name ?? agency.name}
                    </h2>
                    <p className="text-caption text-text-muted">{agency.name}</p>
                  </div>
                </div>
                {agency.website && (
                  <p className="text-caption text-text-muted truncate">{agency.website}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Create agency detail page**

`app/(public)/agencias/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import { ArrowLeft } from "lucide-react"
import type { CallWithFundAndAgency } from "@/types/database"
import type { Metadata } from "next"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("agencies").select("name").eq("slug", slug).single()
  if (!data) return { title: "Agencia no encontrada" }
  return { title: data.name }
}

export default async function AgencyPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: agency } = await supabase
    .from("agencies")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!agency) notFound()

  const { data: calls } = await supabase
    .from("calls")
    .select("*, fund:funds!inner(*, agency:agencies!inner(*))")
    .eq("fund.agency_id", agency.id)
    .order("closes_at", { ascending: true })

  const typedCalls = (calls ?? []) as unknown as CallWithFundAndAgency[]

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/agencias"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-blue transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Volver a agencias
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-[2rem] font-semibold text-text-dark">
            {agency.short_name ?? agency.name}
          </h1>
          <p className="text-body-large text-text-secondary">{agency.name}</p>
          {agency.website && (
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-blue hover:underline mt-1 inline-block"
            >
              {agency.website}
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedCalls.map((call) => (
            <FundCard key={call.id} call={call} />
          ))}
        </div>

        {typedCalls.length === 0 && (
          <p className="text-text-muted text-center py-20">
            No hay convocatorias registradas para esta agencia.
          </p>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add app/\(public\)/agencias/
git commit -m "feat: add agencies listing and detail pages"
```

---

### Task 20: Historical Page (Stub)

**Files:**
- Create: `app/(public)/historico/page.tsx`

**Step 1: Create historical page stub**

`app/(public)/historico/page.tsx`:
```tsx
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import type { CallWithFundAndAgency } from "@/types/database"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Archivo histórico",
  description: "Convocatorias cerradas y proyectos adjudicados.",
}

export const revalidate = 3600

export default async function HistoricoPage() {
  const supabase = await createClient()

  const { data: calls } = await supabase
    .from("calls")
    .select("*, fund:funds(*, agency:agencies(*))")
    .in("status", ["closed", "awarded"])
    .order("closes_at", { ascending: false })
    .limit(30)

  const typedCalls = (calls ?? []) as unknown as CallWithFundAndAgency[]

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-section-heading text-text-dark mb-2">
          Archivo histórico
        </h1>
        <p className="text-text-secondary mb-8">
          Convocatorias cerradas y proyectos adjudicados de años anteriores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedCalls.map((call) => (
            <FundCard key={call.id} call={call} />
          ))}
        </div>

        {typedCalls.length === 0 && (
          <p className="text-text-muted text-center py-20">
            No hay convocatorias históricas registradas aún.
          </p>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/\(public\)/historico/
git commit -m "feat: add historical calls page"
```

---

### Task 21: Not Found & Error Pages

**Files:**
- Create: `app/not-found.tsx`

**Step 1: Create not found page**

`app/not-found.tsx`:
```tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="font-display text-hero text-text-dark mb-4">404</h1>
      <p className="text-body-large text-text-secondary mb-8">
        La página que buscas no existe.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-text-charcoal text-white rounded-standard font-semibold text-sm hover:bg-text-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add 404 not found page"
```

---

### Task 22: Final Build Verification

**Step 1: Run full test suite**

```bash
npm run test:run
```

**Step 2: Type check**

```bash
npm run typecheck
```

**Step 3: Build**

```bash
npm run build
```

**Step 4: Fix any remaining issues and commit**

```bash
git add -A
git commit -m "chore: final build verification and fixes"
```
