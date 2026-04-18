import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import { FundFilters } from "@/components/funds/FundFilters"
import type { CallWithFundAndAgency } from "@/types/database"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fondos vigentes",
  description: "Explora todos los fondos de investigación e innovación disponibles en Chile.",
}

export const revalidate = 3600

interface PageProps {
  searchParams: Promise<{
    status?: string
    agency?: string
    industry?: string
    beneficiary?: string
  }>
}

async function getCalls(filters: {
  status?: string
  agency?: string
  industry?: string
  beneficiary?: string
}): Promise<CallWithFundAndAgency[]> {
  const supabase = await createClient()

  let query = supabase
    .from("calls")
    .select("*, fund:funds(*, agency:agencies(*))")
    .order("closes_at", { ascending: true })

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  if (filters.beneficiary) {
    // Filter by beneficiary type via the FK on calls
    const { data: bt } = await supabase
      .from("beneficiary_types")
      .select("id")
      .eq("slug", filters.beneficiary)
      .single()

    if (bt) {
      query = query.eq("beneficiary_type_id", bt.id)
    }
  }

  const { data } = await query.limit(50)

  let results = (data ?? []) as unknown as CallWithFundAndAgency[]

  // Filter by agency client-side (Supabase nested filtering limitation)
  if (filters.agency) {
    results = results.filter((c) => c.fund?.agency?.slug === filters.agency)
  }

  // Filter by industry client-side (many-to-many via call_industries)
  if (filters.industry) {
    const { data: matchingCallIds } = await supabase
      .from("call_industries")
      .select("call_id, industry:industries!inner(slug)")
      .eq("industry.slug", filters.industry)

    if (matchingCallIds) {
      const callIdSet = new Set(matchingCallIds.map((ci: { call_id: string }) => ci.call_id))
      results = results.filter((c) => callIdSet.has(c.id))
    }
  }

  return results
}

export default async function FondosPage({ searchParams }: PageProps) {
  const filters = await searchParams
  const supabase = await createClient()

  const [calls, { data: agencies }, { data: industries }, { data: beneficiaryTypes }] = await Promise.all([
    getCalls(filters),
    supabase.from("agencies").select("*").order("name"),
    supabase.from("industries").select("*").order("sort_order"),
    supabase.from("beneficiary_types").select("*").order("name"),
  ])

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-section-heading text-text-dark mb-2">
          Fondos disponibles
        </h1>
        <p className="text-text-secondary mb-8">
          Explora las convocatorias de financiamiento para investigación e innovación en Chile.
        </p>

        <Suspense fallback={null}>
          <FundFilters
            agencies={agencies ?? []}
            industries={industries ?? []}
            beneficiaryTypes={beneficiaryTypes ?? []}
          />
        </Suspense>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calls.map((call) => (
            <FundCard key={call.id} call={call} />
          ))}
        </div>

        {calls.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-body-large">
              No se encontraron convocatorias con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
