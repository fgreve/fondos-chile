import { NextRequest, NextResponse } from "next/server"
import { AnidScraper } from "@/lib/scrapers/anid"
import { upsertCalls } from "@/lib/scrapers/upsert"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const scraper = new AnidScraper()
    const rawCalls = await scraper.fetchCalls()

    console.log(`[scrape-anid] Fetched ${rawCalls.length} calls`)

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
