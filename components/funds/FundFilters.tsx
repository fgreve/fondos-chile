"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { Agency, Industry, BeneficiaryType } from "@/types/database"

interface FundFiltersProps {
  agencies: Agency[]
  industries: Industry[]
  beneficiaryTypes: BeneficiaryType[]
}

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "open", label: "Abiertos" },
  { value: "upcoming", label: "Próximos" },
  { value: "closed", label: "Cerrados" },
]

export function FundFilters({ agencies, industries, beneficiaryTypes }: FundFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") ?? ""
  const currentAgency = searchParams.get("agency") ?? ""
  const currentIndustry = searchParams.get("industry") ?? ""
  const currentBeneficiary = searchParams.get("beneficiary") ?? ""

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/fondos?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3">
      {/* Status pills */}
      <div className="flex gap-1">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter("status", opt.value)}
            className={`px-4 py-2 text-sm font-medium rounded-pill transition-colors ${
              currentStatus === opt.value
                ? "bg-text-charcoal text-white"
                : "bg-black/5 text-text-dark hover:bg-black/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Agency select */}
      <select
        value={currentAgency}
        onChange={(e) => updateFilter("agency", e.target.value)}
        className="px-4 py-2 text-sm font-medium rounded-standard border border-surface-border bg-surface-white text-text-dark"
      >
        <option value="">Todas las agencias</option>
        {agencies.map((a) => (
          <option key={a.id} value={a.slug}>
            {a.short_name ?? a.name}
          </option>
        ))}
      </select>

      {/* Industry select */}
      <select
        value={currentIndustry}
        onChange={(e) => updateFilter("industry", e.target.value)}
        className="px-4 py-2 text-sm font-medium rounded-standard border border-surface-border bg-surface-white text-text-dark"
      >
        <option value="">Todas las industrias</option>
        {industries.map((ind) => (
          <option key={ind.id} value={ind.slug}>
            {ind.name}
          </option>
        ))}
      </select>

      {/* Beneficiary type select */}
      <select
        value={currentBeneficiary}
        onChange={(e) => updateFilter("beneficiary", e.target.value)}
        className="px-4 py-2 text-sm font-medium rounded-standard border border-surface-border bg-surface-white text-text-dark"
      >
        <option value="">Todos los beneficiarios</option>
        {beneficiaryTypes.map((bt) => (
          <option key={bt.id} value={bt.slug}>
            {bt.name}
          </option>
        ))}
      </select>
    </div>
  )
}
