import type { Scraper } from "./base"
import { SCRAPER_USER_AGENT } from "./base"
import type { RawCall } from "./types"
import { parseAnidCalls } from "@/lib/parsers/anid"

export class AnidScraper implements Scraper {
  agency = "anid"

  async fetchCalls(): Promise<RawCall[]> {
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

      await page.waitForTimeout(2000)

      const html = await page.content()
      return parseAnidCalls(html)
    } finally {
      await browser.close()
    }
  }
}
