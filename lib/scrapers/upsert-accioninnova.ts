import { createAdminClient } from "@/lib/supabase/admin"
import type { RawCall } from "./types"
import crypto from "crypto"

/**
 * Upsert calls from AcciónInnova scraper.
 * Unlike the single-fund upsert, this creates funds on-the-fly
 * based on the organization name from each detail page.
 */
export async function upsertAccionInnovaCalls(rawCalls: RawCall[]) {
  const supabase = createAdminClient()

  // Get or verify the AcciónInnova agency exists
  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("slug", "accioninnova")
    .single()

  if (!agency) {
    console.error("[upsert-accioninnova] Agency 'accioninnova' not found")
    return { inserted: 0, updated: 0, errors: 1 }
  }

  // Cache for fund lookups to avoid repeated queries
  const fundCache = new Map<string, string>()

  // Cache for beneficiary type lookups
  const beneficiaryTypeCache = new Map<string, string>()
  const { data: beneficiaryTypes } = await supabase
    .from("beneficiary_types")
    .select("id, slug")
  for (const bt of beneficiaryTypes ?? []) {
    beneficiaryTypeCache.set(bt.slug, bt.id)
  }

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const raw of rawCalls) {
    try {
      // Determine fund name (use organization from detail or title)
      const fundName = raw.fund_name || raw.title
      const fundSlug = slugify(fundName)

      // Get or create fund
      let fundId = fundCache.get(fundSlug)
      if (!fundId) {
        const { data: existingFund } = await supabase
          .from("funds")
          .select("id")
          .eq("slug", fundSlug)
          .single()

        if (existingFund) {
          fundId = existingFund.id
        } else {
          const { data: newFund } = await supabase
            .from("funds")
            .insert({
              agency_id: agency.id,
              slug: fundSlug,
              name: fundName,
              description: `Fuente: ${fundName} (vía AcciónInnova)`,
            })
            .select("id")
            .single()

          if (!newFund) {
            console.error(`[upsert-accioninnova] Failed to create fund: ${fundName}`)
            errors++
            continue
          }
          fundId = newFund.id
        }
        fundCache.set(fundSlug, fundId)
      }

      // Content hash for change detection
      const contentHash = crypto
        .createHash("md5")
        .update(JSON.stringify({ title: raw.title, closes_at: raw.closes_at, max_amount_clp: raw.max_amount_clp, requirements: raw.requirements }))
        .digest("hex")

      // Check for existing call by official_url
      const { data: existing } = await supabase
        .from("calls")
        .select("id, status, raw_source")
        .eq("official_url", raw.official_url)
        .single()

      // Resolve beneficiary type ID
      const beneficiaryTypeId = raw.beneficiary_type_slug
        ? beneficiaryTypeCache.get(raw.beneficiary_type_slug)
        : undefined

      if (existing) {
        const protectedStatuses = ["cancelled"]
        if (protectedStatuses.includes(existing.status)) continue

        const existingHash = existing.raw_source
          ? (existing.raw_source as { _hash?: string })?._hash
          : null
        if (existingHash === contentHash) continue

        await supabase
          .from("calls")
          .update({
            title: raw.title,
            status: raw.status ?? existing.status,
            closes_at: raw.closes_at,
            max_amount_clp: raw.max_amount_clp,
            requirements: raw.requirements,
            country: raw.country,
            beneficiary_type_id: beneficiaryTypeId,
            raw_source: { _hash: contentHash, scraped_at: new Date().toISOString() },
            last_scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)

        updated++
      } else {
        const currentYear = new Date().getFullYear()
        await supabase.from("calls").insert({
          fund_id: fundId,
          year: currentYear,
          title: raw.title,
          status: raw.status ?? "open",
          closes_at: raw.closes_at,
          max_amount_clp: raw.max_amount_clp,
          requirements: raw.requirements,
          official_url: raw.official_url,
          country: raw.country,
          beneficiary_type_id: beneficiaryTypeId,
          raw_source: { _hash: contentHash, scraped_at: new Date().toISOString() },
        })

        inserted++
      }
    } catch (error) {
      console.error(`[upsert-accioninnova] Error upserting: ${raw.title}`, error)
      errors++
    }
  }

  return { inserted, updated, errors }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}
