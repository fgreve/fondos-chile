import Link from "next/link"
import { StatusBadge } from "./StatusBadge"
import { DeadlineBadge } from "./DeadlineBadge"
import { formatCLP, formatDate } from "@/lib/utils"
import type { CallWithFundAndAgency } from "@/types/database"

interface FundCardProps {
  call: CallWithFundAndAgency
}

export function FundCard({ call }: FundCardProps) {
  return (
    <Link href={`/fondos/${call.fund.slug}`}>
      <article className="group bg-white rounded-xl border border-[#e5e5e5] p-6 hover:border-[#1a3c3c]/30 hover:shadow-sm transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold text-[#1a3c3c] uppercase tracking-wider">
            {call.fund.agency.short_name ?? call.fund.agency.name}
          </span>
          <StatusBadge status={call.status} />
        </div>

        {/* Title */}
        <h3 className="font-[DM_Serif_Display,serif] text-xl leading-snug text-[#1a1a1a] mb-2 group-hover:text-[#1a3c3c] transition-colors duration-200">
          {call.title}
        </h3>

        {/* Fund name */}
        <p className="text-sm text-[#555555] mb-5">
          {call.fund.name}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#888888]">
          {call.max_amount_clp && (
            <span>Hasta {formatCLP(call.max_amount_clp)}</span>
          )}
          {call.duration_months && (
            <span>{call.duration_months} meses</span>
          )}
          {call.closes_at && (
            <span>Cierre {formatDate(call.closes_at, { month: "short" })}</span>
          )}
        </div>

        {/* Deadline */}
        <div className="mt-4">
          <DeadlineBadge closesAt={call.closes_at} status={call.status} />
        </div>
      </article>
    </Link>
  )
}
