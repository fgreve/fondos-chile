import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FundCard } from "@/components/funds/FundCard"
import { ArrowLeft } from "lucide-react"
import type { CallWithFundAndAgency } from "@/types/database"
import type { Metadata } from "next"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("agencies").select("name").eq("slug", slug).single()
  if (!data) return { title: "Agencia no encontrada" }
  return { title: data.name }
}

export default async function AgencyPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: agency } = await supabase
    .from("agencies")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!agency) notFound()

  const { data: calls } = await supabase
    .from("calls")
    .select("*, fund:funds!inner(*, agency:agencies!inner(*))")
    .eq("fund.agency_id", agency.id)
    .order("closes_at", { ascending: true })

  const typedCalls = (calls ?? []) as unknown as CallWithFundAndAgency[]

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/agencias"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-blue transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Volver a agencias
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-[2rem] font-semibold text-text-dark">
            {agency.short_name ?? agency.name}
          </h1>
          <p className="text-body-large text-text-secondary">{agency.name}</p>
          {agency.website && (
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-blue hover:underline mt-1 inline-block"
            >
              {agency.website}
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedCalls.map((call) => (
            <FundCard key={call.id} call={call} />
          ))}
        </div>

        {typedCalls.length === 0 && (
          <p className="text-text-muted text-center py-20">
            No hay convocatorias registradas para esta agencia.
          </p>
        )}
      </div>
    </div>
  )
}
