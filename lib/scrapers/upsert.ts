import { createAdminClient } from "@/lib/supabase/admin"
import type { RawCall } from "./types"
import crypto from "crypto"

export async function upsertCalls(agencySlug: string, fundSlug: string, rawCalls: RawCall[]) {
  const supabase = createAdminClient()

  const { data: fund } = await supabase
    .from("funds")
    .select("id")
    .eq("slug", fundSlug)
    .single()

  if (!fund) {
    console.error(`Fund not found: ${fundSlug}`)
    return { inserted: 0, updated: 0, errors: 1 }
  }

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const raw of rawCalls) {
    try {
      const { data: existing } = await supabase
        .from("calls")
        .select("id, status, raw_source")
        .eq("official_url", raw.official_url)
        .single()

      const contentHash = crypto
        .createHash("md5")
        .update(JSON.stringify(raw))
        .digest("hex")

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
            opens_at: raw.opens_at,
            closes_at: raw.closes_at,
            max_amount_clp: raw.max_amount_clp,
            duration_months: raw.duration_months,
            requirements: raw.requirements,
            bases_pdf_url: raw.bases_pdf_url,
            raw_source: { ...raw, _hash: contentHash },
            last_scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)

        updated++
      } else {
        const currentYear = new Date().getFullYear()
        await supabase.from("calls").insert({
          fund_id: fund.id,
          year: currentYear,
          title: raw.title,
          status: raw.status ?? "open",
          opens_at: raw.opens_at,
          closes_at: raw.closes_at,
          max_amount_clp: raw.max_amount_clp,
          duration_months: raw.duration_months,
          requirements: raw.requirements,
          official_url: raw.official_url,
          bases_pdf_url: raw.bases_pdf_url,
          raw_source: { ...raw, _hash: contentHash },
        })

        inserted++
      }
    } catch (error) {
      console.error(`Error upserting call: ${raw.title}`, error)
      errors++
    }
  }

  return { inserted, updated, errors }
}
