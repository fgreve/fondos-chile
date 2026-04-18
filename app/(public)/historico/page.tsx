import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import type { CallWithFundAndAgency } from "@/types/database"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Archivo histórico",
  description: "Convocatorias cerradas y proyectos adjudicados.",
}

export const revalidate = 3600

export default async function HistoricoPage() {
  const supabase = await createClient()

  const { data: calls } = await supabase
    .from("calls")
    .select("*, fund:funds(*, agency:agencies(*))")
    .in("status", ["closed", "awarded"])
    .order("closes_at", { ascending: false })
    .limit(30)

  const typedCalls = (calls ?? []) as unknown as CallWithFundAndAgency[]

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-section-heading text-text-dark mb-2">
          Archivo histórico
        </h1>
        <p className="text-text-secondary mb-8">
          Convocatorias cerradas y proyectos adjudicados de años anteriores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedCalls.map((call) => (
            <FundCard key={call.id} call={call} />
          ))}
        </div>

        {typedCalls.length === 0 && (
          <p className="text-text-muted text-center py-20">
            No hay convocatorias históricas registradas aún.
          </p>
        )}
      </div>
    </div>
  )
}
