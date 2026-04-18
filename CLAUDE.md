# CLAUDE.md

Este archivo guía a Claude Code (claude.ai/code) al trabajar en este repositorio.

## Descripción del proyecto

**FondosChile** es una plataforma web que centraliza, muestra y mantiene actualizados los fondos de investigación, innovación y desarrollo disponibles en Chile (ANID, Corfo, FIA, FONDEF, FONDAP, FONIS, FIU, etc.).

El sitio ofrece:

1. **Catálogo vigente** — concursos abiertos y próximos con fechas, requisitos, monto, área y bases oficiales.
2. **Archivo histórico** — convocatorias cerradas y proyectos adjudicados, buscables por año, institución, área y postulante.
3. **Actualización automática** — scrapers programados que ingieren nuevas publicaciones de las fuentes oficiales cada 24 h.
4. **Alertas personalizadas** — los usuarios suscritos reciben notificaciones por email cuando se publica un fondo que coincide con su perfil.

El objetivo es ser la fuente única de verdad sobre el ecosistema de financiamiento CTCi en Chile, reemplazando la búsqueda manual en múltiples sitios gubernamentales.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router, Server Components) |
| Lenguaje | TypeScript (modo `strict`) |
| Base de datos | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth (email + magic link) |
| Storage | Supabase Storage (PDFs de bases concursales) |
| Styling | Tailwind CSS + shadcn/ui |
| Validación | Zod |
| ORM / Cliente | `@supabase/supabase-js` + `@supabase/ssr` |
| Scraping | Playwright (sitios con JS) + Cheerio (HTML estático) |
| Jobs programados | Vercel Cron Jobs |
| Emails | Resend |
| Deploy | Vercel |
| Observabilidad | Vercel Analytics + Supabase logs |

## Arquitectura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Next.js (App   │◄────►│  Supabase        │◄────►│  Vercel Cron    │
│  Router) en     │      │  (Postgres +     │      │  (scrapers      │
│  Vercel         │      │  Auth + Storage) │      │   diarios)      │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                                                   │
        │                                                   ▼
        │                                          ┌─────────────────┐
        └─────────────────────────────────────────►│ Fuentes         │
                                                    │ oficiales       │
                                                    │ (ANID, Corfo...)│
                                                    └─────────────────┘
```

- **Páginas públicas**: Server Components con revalidación ISR (1 h).
- **Dashboard usuario**: Client Components + Supabase Auth helpers.
- **API routes** (`app/api/*`): endpoints internos para scrapers, cron y notificaciones.
- **Cron jobs**: definidos en `vercel.json`, ejecutan endpoints autenticados con `CRON_SECRET`.

## Estructura de carpetas

```
.
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Home: fondos abiertos destacados
│   │   ├── fondos/
│   │   │   ├── page.tsx              # Listado con filtros
│   │   │   └── [slug]/page.tsx       # Detalle de un fondo
│   │   ├── historico/
│   │   │   ├── page.tsx              # Archivo de concursos cerrados
│   │   │   └── adjudicados/page.tsx  # Proyectos adjudicados
│   │   └── agencias/[slug]/page.tsx  # Vista por agencia
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── perfil/page.tsx
│   ├── api/
│   │   ├── cron/
│   │   │   ├── scrape-anid/route.ts
│   │   │   ├── scrape-corfo/route.ts
│   │   │   ├── scrape-fia/route.ts
│   │   │   └── send-alerts/route.ts
│   │   └── webhooks/
│   └── layout.tsx
├── components/
│   ├── ui/                           # shadcn/ui
│   ├── funds/
│   │   ├── FundCard.tsx
│   │   ├── FundFilters.tsx
│   │   └── DeadlineBadge.tsx
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # cliente browser
│   │   ├── server.ts                 # cliente server
│   │   └── admin.ts                  # service role (solo server)
│   ├── scrapers/
│   │   ├── anid.ts
│   │   ├── corfo.ts
│   │   ├── fia.ts
│   │   └── base.ts                   # interfaz común Scraper
│   ├── parsers/                      # normalización de datos crudos
│   ├── notifications/
│   └── utils.ts
├── types/
│   └── database.ts                   # tipos generados por Supabase CLI
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── vercel.json
├── CLAUDE.md
└── README.md
```

## Esquema de base de datos (Supabase)

```sql
-- Agencias financiadoras
create table agencies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'anid', 'corfo', 'fia'
  name text not null,                 -- 'Agencia Nacional de Investigación y Desarrollo'
  short_name text,                    -- 'ANID'
  website text,
  logo_url text,
  created_at timestamptz default now()
);

-- Programas o líneas de fondo (Fondecyt Regular, FONDEF IDeA, etc.)
create table funds (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  slug text unique not null,
  name text not null,                 -- 'Fondecyt Regular'
  description text,
  typical_amount_clp bigint,          -- monto típico referencial
  target_audience text,               -- 'Investigadores doctorados'
  created_at timestamptz default now()
);

-- Convocatorias concretas (una por año/versión)
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
  requirements text,                  -- markdown
  official_url text not null,
  bases_pdf_url text,
  raw_source jsonb,                   -- snapshot del scrape para debug
  last_scraped_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Áreas temáticas (ciencias, ingeniería, salud...)
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

-- Proyectos adjudicados (histórico)
create table awarded_projects (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references calls(id) on delete cascade,
  project_code text,                  -- ej. '1230123'
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

-- Índices clave
create index idx_calls_status_closes on calls(status, closes_at);
create index idx_calls_fund on calls(fund_id);
create index idx_awarded_year on awarded_projects(year desc);
create index idx_awarded_institution on awarded_projects(institution);
```

**RLS (Row Level Security)**: todas las tablas públicas con `select` abierto a `anon`; escritura solo con `service_role` (desde scrapers). `subscriptions` restringida a `user_id = auth.uid()`.

## Fuentes de datos

Los scrapers deben respetar `robots.txt` y usar un User-Agent identificable (`FondosChileBot/1.0`).

| Fuente | URL | Método | Frecuencia |
|---|---|---|---|
| ANID Concursos | https://anid.cl/concursos/ | Playwright (paginación JS) | Diario 06:00 UTC |
| ANID Resultados | https://anid.cl/resultados-concursos/ | Playwright | Diario 06:15 UTC |
| Corfo | https://www.corfo.cl/sites/cpp/convocatorias | Playwright | Diario 06:30 UTC |
| FIA | https://www.fia.cl/convocatorias/ | Cheerio | Diario 06:45 UTC |
| Portal Fondos | https://fondos.gob.cl/ | Cheerio | Diario 07:00 UTC |
| Minciencia | https://www.minciencia.gob.cl/noticias/ | RSS si existe, si no Cheerio | Diario 07:15 UTC |

**Estrategia de scraping**:

1. Cada scraper implementa la interfaz `Scraper` en `lib/scrapers/base.ts`:
   ```ts
   interface Scraper {
     agency: string;
     fetchCalls(): Promise<RawCall[]>;
     fetchAwardedProjects?(year: number): Promise<RawAwardedProject[]>;
   }
   ```
2. Los datos crudos se pasan por un `parser` que los normaliza al esquema de `calls`.
3. Se hace **upsert** con `official_url` como clave natural. Nunca se sobreescriben estados manuales (ej. `status = 'cancelled'` marcado por admin).
4. Cambios relevantes (nueva convocatoria, cambio de fecha) disparan `send-alerts`.
5. Todo lo crudo se guarda en `raw_source` para auditoría.

## Vercel Cron (vercel.json)

```json
{
  "crons": [
    { "path": "/api/cron/scrape-anid",   "schedule": "0 6 * * *" },
    { "path": "/api/cron/scrape-corfo",  "schedule": "30 6 * * *" },
    { "path": "/api/cron/scrape-fia",    "schedule": "45 6 * * *" },
    { "path": "/api/cron/send-alerts",   "schedule": "0 8 * * *" }
  ]
}
```

Cada endpoint verifica el header `Authorization: Bearer $CRON_SECRET` antes de ejecutar.

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # solo server
CRON_SECRET=                     # autenticación de crons
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` ni `CRON_SECRET` al cliente. Usar `lib/supabase/admin.ts` solo desde route handlers o server actions.

## Comandos

```bash
# Desarrollo
npm run dev                      # Next.js en localhost:3000
npm run build
npm run start
npm run lint
npm run typecheck                # tsc --noEmit

# Supabase
npx supabase start               # inicia Supabase local (Docker)
npx supabase db push             # aplica migraciones a proyecto remoto
npx supabase db reset            # resetea DB local y aplica seed
npx supabase gen types typescript --project-id $PROJECT_ID > types/database.ts

# Scrapers (manual, para debug)
npx tsx scripts/scrape-manual.ts --agency=anid
```

## Convenciones de código

- **Server Components por defecto**. Marcar `"use client"` solo cuando se necesita estado o eventos.
- **Data fetching**: en Server Components usar `createClient()` de `lib/supabase/server.ts`. En Client Components usar `lib/supabase/client.ts`.
- **Formularios**: Server Actions + Zod para validación. Nunca confiar en validación solo del cliente.
- **Fechas**: todo en UTC en la DB. Formatear en la UI con `date-fns-tz` usando `America/Santiago`.
- **Montos**: siempre en CLP como `bigint` (pesos enteros). Formato con `Intl.NumberFormat('es-CL')`.
- **Idioma UI**: español de Chile. Nombres de variables y código en inglés.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `scraper:`).
- **Componentes**: PascalCase. Archivos utilitarios: camelCase.
- **Imports**: alias `@/` apuntando a la raíz (`tsconfig.json` `paths`).

## Principios para scrapers

1. **Idempotencia**: correr el mismo scraper dos veces no debe duplicar datos.
2. **Tolerancia a fallos**: si una fuente cambia su HTML, el scraper debe loggear el error y no romper los demás. Capturar excepciones por convocatoria, no por corrida completa.
3. **Detección de cambios**: comparar hash del contenido normalizado antes de hacer update; evita notificaciones falsas.
4. **Rate limiting**: `p-limit` con concurrencia máxima 2 y delay 500 ms entre requests al mismo dominio.
5. **Snapshots**: guardar el HTML/JSON crudo en `calls.raw_source` para poder reprocesar sin volver a scrapear.

## Flujo de notificaciones

1. Cron `send-alerts` corre después de los scrapers.
2. Busca `calls` creadas o modificadas (`updated_at > last_notification_run`) con `status in ('upcoming','open')`.
3. Hace match contra `subscriptions` por `agency_ids` y `area_ids`.
4. Agrupa por usuario, renderiza email con Resend, envía.
5. Actualiza tabla `notifications_log` para evitar duplicados.

## Testing

- **Unit**: Vitest para parsers y utilidades. Mockear HTML de fuentes oficiales.
- **E2E**: Playwright para flujos críticos (búsqueda, suscripción).
- **Scrapers**: cada scraper debe tener fixtures HTML en `lib/scrapers/__fixtures__/`.

## Deploy

- `main` → producción (Vercel auto-deploy).
- `develop` → preview.
- Migraciones de Supabase se aplican manualmente con `supabase db push` tras review en PR.
- Secrets en Vercel project settings, nunca en el repo.

## Roadmap

- **Sprint 1**: esquema DB + scraper ANID + UI listado básico.
- **Sprint 2**: scrapers Corfo + FIA, página de detalle, filtros.
- **Sprint 3**: histórico de adjudicados, búsqueda full-text (`pg_trgm`).
- **Sprint 4**: auth + suscripciones + emails.
- **Sprint 5**: API pública (rate-limited) para terceros, sitemap, SEO.

## Notas importantes para Claude

- Antes de modificar scrapers, revisar `raw_source` de al menos 3 registros recientes para entender el formato actual.
- Al agregar una nueva fuente, crear migración, tipo, scraper, parser y test en el mismo PR.
- Los montos en bases oficiales a veces vienen como texto ("treinta millones de pesos") — el parser debe convertirlos a `bigint`.
- ANID cambia la estructura HTML ~1 vez al año; los scrapers deben fallar ruidosamente (no silenciosamente) cuando eso pase.
- Nunca borrar `calls` antiguas: cambiar `status = 'closed'` o `'cancelled'`. El histórico es parte del valor del producto.
