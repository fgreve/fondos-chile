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
      <section className="min-h-[80vh] flex items-center px-6 lg:px-8">
        <div className="mx-auto max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-[DM_Serif_Display,serif] text-5xl md:text-6xl leading-[1.1] text-[#1a1a1a] mb-6">
              Fondos de investigación para quienes exigen resultados.
            </h1>
            <p className="text-lg text-[#555555] leading-relaxed mb-8 max-w-md">
              Centralizamos {callCount} oportunidades de financiamiento de ANID, Corfo, FIA y más agencias en Chile.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/fondos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3c3c] text-white text-sm font-medium rounded-full hover:bg-[#2a5a5a] transition-colors duration-200"
              >
                Explorar fondos
              </Link>
              <Link
                href="/historico"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a3c3c] text-[#1a3c3c] text-sm font-medium rounded-full hover:bg-[#1a3c3c] hover:text-white transition-all duration-200"
              >
                Ver histórico
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none" className="opacity-60">
              <path d="M140 20L260 140L140 260L20 140L140 20Z" stroke="#1a3c3c" strokeWidth="1" fill="none" />
              <path d="M140 60L220 140L140 220L60 140L140 60Z" stroke="#1a3c3c" strokeWidth="0.5" fill="none" opacity="0.5" />
              <circle cx="140" cy="140" r="4" fill="#1a3c3c" />
              <circle cx="140" cy="80" r="3" fill="#1a3c3c" opacity="0.6" />
              <circle cx="200" cy="140" r="3" fill="#1a3c3c" opacity="0.6" />
              <circle cx="140" cy="200" r="3" fill="#1a3c3c" opacity="0.6" />
              <circle cx="80" cy="140" r="3" fill="#1a3c3c" opacity="0.6" />
              <circle cx="170" cy="110" r="2" fill="#1a3c3c" opacity="0.3" />
              <circle cx="170" cy="170" r="2" fill="#1a3c3c" opacity="0.3" />
              <circle cx="110" cy="170" r="2" fill="#1a3c3c" opacity="0.3" />
              <circle cx="110" cy="110" r="2" fill="#1a3c3c" opacity="0.3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Open Calls */}
      {calls.length > 0 && (
        <section className="py-20 px-6 lg:px-8 bg-[#fafafa]">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-[DM_Serif_Display,serif] text-3xl md:text-4xl text-[#1a1a1a] mb-2">
                  Convocatorias vigentes
                </h2>
                <p className="text-[#555555]">
                  Las últimas oportunidades de financiamiento disponibles.
                </p>
              </div>
              <Link
                href="/fondos?status=open"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#1a3c3c] hover:text-[#2a5a5a] transition-colors"
              >
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
