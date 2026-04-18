import * as cheerio from "cheerio"
import type { RawCall } from "@/lib/scrapers/types"

const BASE_URL = "https://accioninnova.org"

/** Parse a listing page and extract basic card data + detail URLs */
export function parseAccionInnovaListing(html: string): {
  calls: Partial<RawCall>[]
  hasMore: boolean
} {
  const $ = cheerio.load(html)
  const calls: Partial<RawCall>[] = []

  $("#oportunidades-tabla > div").each((_: number, el) => {
    try {
      const $el = $(el)

      // Title and detail URL from <h5> > <a>
      const linkEl = $el.find("h5 a.verMas")
      const title = linkEl.text().trim()
      const detailUrl = linkEl.attr("href") ?? ""
      if (!title || !detailUrl) return

      // Extract AcciónInnova ID from URL
      const idMatch = detailUrl.match(/oportunidades\/(\d+)\/detalle/)
      if (!idMatch) return

      // Beneficiary type: first div with "text-base font-normal"
      const beneficiaryText = $el
        .find("div.text-base.font-normal")
        .first()
        .text()
        .trim()

      // Meta fields are inside "flex flex-col p-1 gap-1" > "flex flex-row items-center" divs
      const metaRows = $el.find("div.flex.flex-row.items-center")
      const country = metaRows.eq(0).find("div.text-sm.font-semibold").text().trim()

      // Amount: second row (after currency SVG)
      const amountText = metaRows.eq(1).find("div.text-sm.font-semibold").text().trim()
      const max_amount_clp = parseAmount(amountText)

      // Deadline: third row (after calendar SVG)
      const deadlineText = metaRows.eq(2).find("div.text-sm.font-semibold").text().trim()
      const closes_at = parseDate(deadlineText)

      calls.push({
        title,
        official_url: detailUrl,
        closes_at,
        max_amount_clp,
        country,
        beneficiary_type_slug: mapBeneficiaryType(beneficiaryText),
        status: "open",
        raw_html: $.html(el),
      })
    } catch {
      // Skip individual card failures
    }
  })

  // Check if there's a "Ver más" button
  const hasMore = html.includes("verMasFondos2")

  return { calls, hasMore }
}

/** Parse a detail page for rich fund information */
export function parseAccionInnovaDetail(html: string): {
  fund_name: string
  description: string
  official_url: string
  beneficiary_type_slug: string
  country: string
  closes_at: string | undefined
  max_amount_clp: number | undefined
} {
  const $ = cheerio.load(html)

  // Title
  const title = $("h1.text-lg.lg\\:text-3xl").text().trim()

  // Source/organization: "Fuente: <span>Organization Name</span>"
  const fund_name =
    $("h3")
      .filter((_, el) => $(el).text().includes("Fuente:"))
      .find("span.font-semibold")
      .text()
      .trim() || title

  // Beneficiary type + country from "Empresas, Chile" h2
  const subtitleText = $("h2.text-base.lg\\:text-xl").text().trim()
  const [beneficiaryRaw, countryRaw] = subtitleText
    .split(",")
    .map((s) => s.trim())

  // Deadline
  const deadlineEl = $("h3")
    .filter((_, el) => $(el).text().includes("Fecha postulaci"))
    .find("span.font-semibold")
  const closes_at = parseDate(deadlineEl.text().trim())

  // Amount
  const amountEl = $("h3")
    .filter((_, el) => $(el).text().includes("Monto máximo"))
    .find("span.font-semibold")
  const max_amount_clp = parseAmount(amountEl.text().trim())

  // Description paragraph
  const descriptionP = $("h2.text-base.lg\\:text-xl")
    .parent()
    .parent()
    .find("p")
    .first()
    .text()
    .trim()

  // More info section (rich text)
  const moreInfo = $("div.textoEnriquecido").html() ?? ""
  const moreInfoText = $("div.textoEnriquecido").text().trim()

  // Combine description
  const description = [descriptionP, moreInfoText].filter(Boolean).join("\n\n")

  // Official external URL
  const officialLink = $('a[href]:contains("Ir a link de postulaci")')
    .attr("href") ?? ""

  return {
    fund_name,
    description,
    official_url: officialLink,
    beneficiary_type_slug: mapBeneficiaryType(beneficiaryRaw),
    country: countryRaw ?? "",
    closes_at,
    max_amount_clp,
  }
}

/** Parse DD-MM-YYYY date format to ISO string */
export function parseDate(text: string): string | undefined {
  if (!text || text.toLowerCase().includes("todo el año")) return undefined

  const match = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T23:59:59Z`
  }

  return undefined
}

/** Parse CLP amount from text like "216.812.500" or "No especifica" */
export function parseAmount(text: string): number | undefined {
  if (
    !text ||
    text.toLowerCase().includes("no especifica") ||
    text.toLowerCase().includes("no monetario")
  ) {
    return undefined
  }

  // Remove dots (thousand separators) and parse
  const cleaned = text.replace(/\./g, "").replace(/\$/g, "").trim()
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? undefined : num
}

/** Map beneficiary type text to our slug */
export function mapBeneficiaryType(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes("personas naturales")) return "personas-naturales"
  if (lower.includes("empresas")) return "empresas"
  if (lower.includes("asociaciones")) return "asociaciones"
  if (lower.includes("todos")) return "todos"
  return "todos"
}
