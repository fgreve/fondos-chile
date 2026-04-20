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
      <article className="group bg-white p-6 border border-[#e8e8e8] hover:border-[#cccccc] transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold text-[#999999] uppercase tracking-[0.06em]">
            {call.fund.agency.short_name ?? call.fund.agency.name}
          </span>
          <StatusBadge status={call.status} />
        </div>

        {/* Title */}
        <h3 className="font-[Satoshi,sans-serif] font-bold text-xl leading-snug text-[#1a1a1a] mb-1.5 group-hover:text-[#0055FF] transition-colors duration-200">
          {call.title}
        </h3>

        {/* Fund name */}
        <p className="text-sm text-[#6b6b6b] mb-5">
          {call.fund.name}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#999999]">
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
