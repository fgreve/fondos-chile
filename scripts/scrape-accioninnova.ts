import { AccionInnovaScraper } from "../lib/scrapers/accioninnova"
import { upsertAccionInnovaCalls } from "../lib/scrapers/upsert-accioninnova"

async function main() {
  console.log("Starting AcciónInnova scraper...")

  const scraper = new AccionInnovaScraper()
  const rawCalls = await scraper.fetchCalls()

  console.log(`\nFetched ${rawCalls.length} opportunities:`)
  for (const call of rawCalls) {
    console.log(`  - ${call.title} | ${call.fund_name ?? "N/A"} | ${call.country ?? "?"} | ${call.max_amount_clp ?? "N/A"} CLP | closes: ${call.closes_at ?? "N/A"}`)
  }

  console.log("\nUpserting to database...")
  const results = await upsertAccionInnovaCalls(rawCalls)
  console.log(`\nResults: ${results.inserted} inserted, ${results.updated} updated, ${results.errors} errors`)
}

main().catch(console.error)
