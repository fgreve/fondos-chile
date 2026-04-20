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
    <div className="flex flex-col sm:flex-row flex-wrap gap-6">
      {/* Status tabs */}
      <div className="flex gap-0 border-b border-[#e8e8e8]">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter("status", opt.value)}
            className={`px-4 py-2 text-[13px] font-medium transition-colors duration-200 border-b-2 -mb-px ${
              currentStatus === opt.value
                ? "border-[#1a1a1a] text-[#1a1a1a]"
                : "border-transparent text-[#999999] hover:text-[#6b6b6b]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Selects */}
      <div className="flex flex-wrap gap-3">
        <select
          value={currentAgency}
          onChange={(e) => updateFilter("agency", e.target.value)}
          className="px-3 py-2 text-[13px] font-medium border border-[#e8e8e8] bg-white text-[#1a1a1a] rounded-[4px] hover:border-[#cccccc] transition-colors duration-200"
        >
          <option value="">Todas las agencias</option>
          {agencies.map((a) => (
            <option key={a.id} value={a.slug}>
              {a.short_name ?? a.name}
            </option>
          ))}
        </select>

        <select
          value={currentIndustry}
          onChange={(e) => updateFilter("industry", e.target.value)}
          className="px-3 py-2 text-[13px] font-medium border border-[#e8e8e8] bg-white text-[#1a1a1a] rounded-[4px] hover:border-[#cccccc] transition-colors duration-200"
        >
          <option value="">Todas las industrias</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.slug}>
              {ind.name}
            </option>
          ))}
        </select>

        <select
          value={currentBeneficiary}
          onChange={(e) => updateFilter("beneficiary", e.target.value)}
          className="px-3 py-2 text-[13px] font-medium border border-[#e8e8e8] bg-white text-[#1a1a1a] rounded-[4px] hover:border-[#cccccc] transition-colors duration-200"
        >
          <option value="">Todos los beneficiarios</option>
          {beneficiaryTypes.map((bt) => (
            <option key={bt.id} value={bt.slug}>
              {bt.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
