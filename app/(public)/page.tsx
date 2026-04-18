import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import type { CallWithFundAndAgency } from "@/types/database"
import { ArrowRight, Search, Bell, Database } from "lucide-react"

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

const features = [
  {
    icon: Search,
    title: "Búsqueda centralizada",
    description: "Todos los fondos de ANID, Corfo, FIA y más en un solo lugar.",
  },
  {
    icon: Bell,
    title: "Alertas personalizadas",
    description: "Recibe notificaciones cuando se publique un fondo que coincida con tu perfil.",
  },
  {
    icon: Database,
    title: "Archivo histórico",
    description: "Consulta convocatorias anteriores y proyectos adjudicados.",
  },
]

export default async function HomePage() {
  const calls = await getOpenCalls()

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-hero text-text-dark mb-6">
            Fondos de investigación en Chile
          </h1>
          <p className="text-body-large text-text-secondary max-w-2xl mx-auto mb-10">
            Encuentra, compara y postula a todos los fondos de investigación, innovación
            y desarrollo disponibles en Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fondos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-text-charcoal text-white rounded-standard font-semibold text-sm hover:bg-text-dark transition-colors"
            >
              Explorar fondos
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/historico"
              className="inline-flex items-center justify-center px-6 py-3 bg-surface-light text-text-dark rounded-standard font-semibold text-sm hover:bg-surface-border transition-colors"
            >
              Ver histórico
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-surface-border-light">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-section-heading text-text-dark text-center mb-12">
            Todo sobre fondos CTCi en un solo lugar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="text-center p-8 rounded-generous bg-surface-white border border-surface-border-light"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-comfortable bg-primary-200 flex items-center justify-center">
                  <f.icon size={24} className="text-primary-600" />
                </div>
                <h3 className="font-mid text-feature-label text-text-dark mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Calls */}
      {calls.length > 0 && (
        <section className="py-20 px-4 border-t border-surface-border-light">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-section-heading text-text-dark">
                Convocatorias vigentes
              </h2>
              <Link
                href="/fondos?status=open"
                className="text-sm font-medium text-brand-blue hover:text-primary-700 transition-colors flex items-center gap-1"
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
