import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import type { CallWithFundAndAgency } from "@/types/database"
import { ArrowRight } from "lucide-react"

export const revalidate = 3600

async function getOpenCalls(): Promise<CallWithFundAndAgency[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("calls")
    .select("*, fund:funds(*, agency:agencies(*))")
    .in("status", ["open", "upcoming"])
    .order("closes_at", { ascending: true })
    .limit(6)

  return (data ?? []) as unknown as CallWithFundAndAgency[]
}

async function getCallCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from("calls")
    .select("*", { count: "exact", head: true })
    .in("status", ["open", "upcoming"])

  return count ?? 0
}

export default async function HomePage() {
  const [calls, callCount] = await Promise.all([getOpenCalls(), getCallCount()])

  return (
    <div>
      {/* Hero */}
      <section className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[13px] font-medium text-[#0055FF] uppercase tracking-[0.08em] mb-4">
            Plataforma de fondos CTCi
          </p>
          <h1 className="font-[Satoshi,sans-serif] font-bold text-[3.5rem] leading-[1.08] tracking-tight text-[#1a1a1a] max-w-[720px] mb-6">
            Todos los fondos de investigación en Chile, en un solo lugar
          </h1>
          <p className="text-base text-[#6b6b6b] max-w-[520px] mb-10 leading-relaxed">
            Centraliza, compara y encuentra oportunidades de financiamiento de ANID, Corfo, FIA y más.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/fondos"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-[4px] hover:bg-[#333] transition-colors duration-200"
            >
              Explorar fondos
              <ArrowRight size={14} />
            </Link>
            <span className="text-sm text-[#999999]">
              <span className="font-bold text-[#1a1a1a] tabular-nums">{callCount}</span> convocatorias activas
            </span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1120px] px-6">
        <hr className="border-[#e8e8e8]" />
      </div>

      {/* Open Calls */}
      {calls.length > 0 && (
        <section className="py-16 px-6">
          <div className="mx-auto max-w-[1120px]">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-[Satoshi,sans-serif] font-bold text-[1.5rem] tracking-tight text-[#1a1a1a]">
                Convocatorias vigentes
              </h2>
              <Link
                href="/fondos?status=open"
                className="text-[13px] font-medium text-[#0055FF] hover:text-[#0044cc] transition-colors duration-200 flex items-center gap-1"
              >
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8e8]">
              {calls.map((call) => (
                <FundCard key={call.id} call={call} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
