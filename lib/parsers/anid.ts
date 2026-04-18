import * as cheerio from "cheerio"
import type { RawCall } from "@/lib/scrapers/types"

export function parseAnidCalls(html: string): RawCall[] {
  const calls: RawCall[] = []
  const $ = cheerio.load(html)

  $(".concurso-item, .contest-item, article.concurso").each((_: number, el) => {
    try {
      const $el = $(el)
      const title = $el.find("h2, h3, .title, .concurso-title").first().text().trim()
      const linkEl = $el.find("a[href]").first()
      const official_url = linkEl.attr("href") ?? ""

      if (!title || !official_url) return

      const fullUrl = official_url.startsWith("http")
        ? official_url
        : `https://anid.cl${official_url}`

      const dateText = $el.find(".fecha, .date, .deadline").text().trim()
      const closes_at = extractDate(dateText)

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
  })

  return calls
}

function extractDate(text: string): string | undefined {
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
