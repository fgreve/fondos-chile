import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatusBadge } from "@/components/funds/StatusBadge"
import { DeadlineBadge } from "@/components/funds/DeadlineBadge"
import { formatCLP, formatDate } from "@/lib/utils"
import { ArrowLeft, ExternalLink, FileText, Calendar, Clock, Banknote } from "lucide-react"
import type { Metadata } from "next"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getFundWithCalls(slug: string) {
  const supabase = await createClient()

  const { data: fund } = await supabase
    .from("funds")
    .select("*, agency:agencies(*)")
    .eq("slug", slug)
    .single()

  if (!fund) return null

  const { data: calls } = await supabase
    .from("calls")
    .select("*")
    .eq("fund_id", fund.id)
    .order("year", { ascending: false })

  return { fund, calls: calls ?? [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getFundWithCalls(slug)
  if (!data) return { title: "Fondo no encontrado" }

  return {
    title: data.fund.name,
    description: data.fund.description ?? `Información sobre ${data.fund.name}`,
  }
}

export default async function FundDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getFundWithCalls(slug)

  if (!data) notFound()

  const { fund, calls } = data
  const latestCall = calls[0]
  const agency = fund.agency as { name: string; short_name: string | null; website: string | null; slug: string }

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Link
          href="/fondos"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-blue transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Volver a fondos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="text-small-label font-semibold text-brand-blue uppercase tracking-wider">
            {agency.short_name ?? agency.name}
          </span>
          <h1 className="font-display text-[2rem] font-semibold text-text-dark mt-1 mb-3">
            {fund.name}
          </h1>
          {fund.description && (
            <p className="text-body-large text-text-secondary">{fund.description}</p>
          )}
          {fund.target_audience && (
            <p className="text-sm text-text-muted mt-2">
              Dirigido a: {fund.target_audience}
            </p>
          )}
        </div>

        {/* Latest call */}
        {latestCall && (
          <div className="rounded-large border border-surface-border p-6 md:p-8 mb-8 shadow-subtle">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="font-display text-sub-heading text-text-dark">
                {latestCall.title}
              </h2>
              <StatusBadge status={latestCall.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {latestCall.max_amount_clp && (
                <div className="flex items-center gap-3">
                  <Banknote size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Monto maximo</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {formatCLP(latestCall.max_amount_clp)}
                    </p>
                  </div>
                </div>
              )}
              {latestCall.duration_months && (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Duracion</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {latestCall.duration_months} meses
                    </p>
                  </div>
                </div>
              )}
              {latestCall.opens_at && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Apertura</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {formatDate(latestCall.opens_at)}
                    </p>
                  </div>
                </div>
              )}
              {latestCall.closes_at && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-text-muted" />
                  <div>
                    <p className="text-caption text-text-muted">Cierre</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {formatDate(latestCall.closes_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DeadlineBadge closesAt={latestCall.closes_at} status={latestCall.status} />

            {/* Requirements */}
            {latestCall.requirements && (
              <div className="mt-6 pt-6 border-t border-surface-border-light">
                <h3 className="font-mid text-feature-label text-text-dark mb-3">
                  Requisitos
                </h3>
                <div className="prose prose-sm max-w-none text-text-secondary whitespace-pre-line">
                  {latestCall.requirements}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mt-6 pt-6 border-t border-surface-border-light flex flex-wrap gap-3">
              <a
                href={latestCall.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-text-charcoal text-white rounded-standard font-semibold text-sm hover:bg-text-dark transition-colors"
              >
                <ExternalLink size={14} /> Ver convocatoria oficial
              </a>
              {latestCall.bases_pdf_url && (
                <a
                  href={latestCall.bases_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-light text-text-dark rounded-standard font-semibold text-sm hover:bg-surface-border transition-colors"
                >
                  <FileText size={14} /> Descargar bases
                </a>
              )}
            </div>
          </div>
        )}

        {/* Historical calls */}
        {calls.length > 1 && (
          <div>
            <h2 className="font-display text-sub-heading text-text-dark mb-4">
              Convocatorias anteriores
            </h2>
            <div className="space-y-3">
              {calls.slice(1).map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-4 rounded-comfortable border border-surface-border-light"
                >
                  <div>
                    <p className="text-sm font-medium text-text-dark">{call.title}</p>
                    <p className="text-caption text-text-muted">
                      {call.closes_at && formatDate(call.closes_at, { month: "short" })}
                    </p>
                  </div>
                  <StatusBadge status={call.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
