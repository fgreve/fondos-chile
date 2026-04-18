import type { Scraper } from "./base"
import { SCRAPER_USER_AGENT, SCRAPER_DELAY_MS, SCRAPER_CONCURRENCY } from "./base"
import type { RawCall } from "./types"
import {
  parseAccionInnovaListing,
  parseAccionInnovaDetail,
} from "@/lib/parsers/accioninnova"
import pLimit from "p-limit"

const BASE_URL = "https://accioninnova.org"
const LISTING_URL = `${BASE_URL}/oportunidades/listado`
const MAX_PAGES = 10

export class AccionInnovaScraper implements Scraper {
  agency = "accioninnova"

  async fetchCalls(): Promise<RawCall[]> {
    const limit = pLimit(SCRAPER_CONCURRENCY)
    const allCalls: RawCall[] = []

    // Phase 1: Fetch all listing pages to get card summaries + detail URLs
    const listingCalls: Partial<RawCall>[] = []
    let page = 1
    let hasMore = true

    while (hasMore && page <= MAX_PAGES) {
      const url = page === 1 ? LISTING_URL : `${LISTING_URL}?page=${page}`
      console.log(`[accioninnova] Fetching listing page ${page}`)

      const html = await this.fetchPage(url)
      const result = parseAccionInnovaListing(html)
      listingCalls.push(...result.calls)

      hasMore = result.calls.length > 0 && result.hasMore
      page++

      if (hasMore) await delay(SCRAPER_DELAY_MS)
    }

    console.log(`[accioninnova] Found ${listingCalls.length} opportunities across ${page - 1} pages`)

    // Phase 2: Fetch detail pages for enriched data
    const detailTasks = listingCalls.map((card) =>
      limit(async () => {
        try {
          if (!card.official_url) return null

          await delay(SCRAPER_DELAY_MS)
          const detailHtml = await this.fetchPage(card.official_url)
          const detail = parseAccionInnovaDetail(detailHtml)

          const rawCall: RawCall = {
            title: card.title ?? "",
            status: card.status ?? "open",
            closes_at: detail.closes_at ?? card.closes_at,
            max_amount_clp: detail.max_amount_clp ?? card.max_amount_clp,
            requirements: detail.description || undefined,
            official_url: detail.official_url || card.official_url,
            fund_name: detail.fund_name,
            country: detail.country ?? card.country,
            beneficiary_type_slug:
              detail.beneficiary_type_slug ?? card.beneficiary_type_slug,
            raw_html: detailHtml,
          }

          return rawCall
        } catch (error) {
          console.error(
            `[accioninnova] Error fetching detail for "${card.title}":`,
            error
          )
          // Fall back to listing data only
          return {
            title: card.title ?? "",
            status: card.status ?? "open",
            closes_at: card.closes_at,
            max_amount_clp: card.max_amount_clp,
            official_url: card.official_url ?? "",
            country: card.country,
            beneficiary_type_slug: card.beneficiary_type_slug,
            raw_html: card.raw_html,
          } satisfies RawCall
        }
      })
    )

    const results = await Promise.all(detailTasks)
    for (const r of results) {
      if (r) allCalls.push(r)
    }

    console.log(`[accioninnova] Processed ${allCalls.length} opportunities with details`)
    return allCalls
  }

  private async fetchPage(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": SCRAPER_USER_AGENT,
        Accept: "text/html",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`)
    }

    return response.text()
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
