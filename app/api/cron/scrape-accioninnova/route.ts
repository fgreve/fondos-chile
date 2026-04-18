import { NextRequest, NextResponse } from "next/server"
import { AccionInnovaScraper } from "@/lib/scrapers/accioninnova"
import { upsertAccionInnovaCalls } from "@/lib/scrapers/upsert-accioninnova"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const scraper = new AccionInnovaScraper()
    const rawCalls = await scraper.fetchCalls()

    console.log(`[scrape-accioninnova] Fetched ${rawCalls.length} calls`)

    const results = await upsertAccionInnovaCalls(rawCalls)

    return NextResponse.json({
      success: true,
      fetched: rawCalls.length,
      ...results,
    })
  } catch (error) {
    console.error("[scrape-accioninnova] Scraper failed:", error)
    return NextResponse.json(
      { error: "Scraper failed", details: String(error) },
      { status: 500 }
    )
  }
}
