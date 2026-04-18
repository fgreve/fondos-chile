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
      <article className="group bg-surface-white rounded-generous border border-surface-border p-6 hover:shadow-brand-glow transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-small-label font-semibold text-brand-blue uppercase tracking-wider">
            {call.fund.agency.short_name ?? call.fund.agency.name}
          </span>
          <StatusBadge status={call.status} />
        </div>

        {/* Title */}
        <h3 className="font-display text-card-title text-text-dark mb-2 group-hover:text-brand-blue transition-colors">
          {call.title}
        </h3>

        {/* Fund name */}
        <p className="text-sm text-text-secondary mb-4">
          {call.fund.name}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-caption text-text-muted">
          {call.max_amount_clp && (
            <span>Hasta {formatCLP(call.max_amount_clp)}</span>
          )}
          {call.duration_months && (
            <span>{call.duration_months} meses</span>
          )}
          {call.closes_at && (
            <span>Cierre: {formatDate(call.closes_at, { month: "short" })}</span>
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
