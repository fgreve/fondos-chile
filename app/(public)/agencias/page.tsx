import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agencias",
  description: "Agencias financiadoras de investigación e innovación en Chile.",
}

export const revalidate = 3600

export default async function AgenciasPage() {
  const supabase = await createClient()
  const { data: agencies } = await supabase
    .from("agencies")
    .select("*")
    .order("name")

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-section-heading text-text-dark mb-2">
          Agencias financiadoras
        </h1>
        <p className="text-text-secondary mb-8">
          Organismos que financian investigación, innovación y desarrollo en Chile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(agencies ?? []).map((agency) => (
            <Link key={agency.id} href={`/agencias/${agency.slug}`}>
              <div className="group p-6 rounded-generous border border-surface-border hover:shadow-brand-glow transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-comfortable bg-primary-200 flex items-center justify-center">
                    <span className="text-primary-700 font-display font-semibold text-sm">
                      {(agency.short_name ?? agency.name).slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-feature-label text-text-dark group-hover:text-brand-blue transition-colors">
                      {agency.short_name ?? agency.name}
                    </h2>
                    <p className="text-caption text-text-muted">{agency.name}</p>
                  </div>
                </div>
                {agency.website && (
                  <p className="text-caption text-text-muted truncate">{agency.website}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
