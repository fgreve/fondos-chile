# AcciónInnova Scraper — Design

## Goal

Recurring scraper that fetches all open opportunities from accioninnova.org, maps them to our schema, and upserts into the `calls` table following the existing `Scraper` interface.

## Data Source

- **Listing:** `GET https://accioninnova.org/oportunidades/listado?page={N}` — paginate until no more results
- **Detail:** `GET https://accioninnova.org/oportunidades/{id}/detalle` — full description, requirements, official URL, org name
- **Method:** Cheerio (server-rendered HTML, no JS rendering needed)

## Data Mapping

| AcciónInnova field | Our schema |
|---|---|
| Title | `calls.title` |
| Organization name | `funds.name` (under AcciónInnova agency) |
| Amount (CLP) | `calls.max_amount_clp` |
| Deadline | `calls.closes_at` |
| Beneficiary type | `calls.beneficiary_type_id` (match to `beneficiary_types` table) |
| Industry tags | `call_industries` junction (match to `industries` table) |
| Description + requirements | `calls.requirements` (markdown) |
| Official URL | `calls.official_url` |
| Detail page URL | Upsert key (e.g. `accioninnova.org/oportunidades/{id}/detalle`) |
| Location/country | `calls.country` |
| Raw HTML snapshot | `calls.raw_source` |

## Agency Strategy

Create a single **"AcciónInnova"** agency (`slug: accioninnova`). Each unique organization from detail pages becomes a `fund` under that agency. This keeps AcciónInnova as a distinct aggregation source without polluting curated Chilean agency entries.

## Architecture

| File | Purpose |
|---|---|
| `lib/scrapers/accioninnova.ts` | Implements `Scraper` interface |
| `lib/parsers/accioninnova.ts` | Cheerio parsing for listing + detail pages |
| `lib/parsers/__tests__/accioninnova.test.ts` | Unit tests with HTML fixtures |
| `lib/scrapers/__fixtures__/accioninnova-listing.html` | Fixture for listing page |
| `lib/scrapers/__fixtures__/accioninnova-detail.html` | Fixture for detail page |
| `app/api/cron/scrape-accioninnova/route.ts` | Cron endpoint (CRON_SECRET auth) |
| `supabase/migrations/00003_add_accioninnova_agency.sql` | Seed AcciónInnova agency |
| `vercel.json` | Add cron at 07:30 UTC |

## Rate Limiting

- `p-limit` concurrency 2, 500ms delay between requests
- ~50 funds x detail fetch = ~25 seconds total

## Error Handling

- Parse each fund independently; one broken page doesn't stop the batch
- Log errors per fund, save partial data, continue
- Store raw HTML in `raw_source` for reprocessing
