const statusConfig: Record<string, { label: string; dotColor: string }> = {
  open: { label: "Abierto", dotColor: "bg-[#1a8754]" },
  upcoming: { label: "Próximamente", dotColor: "bg-[#0055FF]" },
  closed: { label: "Cerrado", dotColor: "bg-[#999999]" },
  awarded: { label: "Adjudicado", dotColor: "bg-[#7c3aed]" },
  cancelled: { label: "Cancelado", dotColor: "bg-[#dc2626]" },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, dotColor: "bg-[#999999]" }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b6b6b]">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  )
}
