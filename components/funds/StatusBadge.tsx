const statusConfig: Record<string, { label: string; dotColor: string }> = {
  open: { label: "Abierto", dotColor: "bg-emerald-500" },
  upcoming: { label: "Próximamente", dotColor: "bg-[#1a3c3c]" },
  closed: { label: "Cerrado", dotColor: "bg-gray-400" },
  awarded: { label: "Adjudicado", dotColor: "bg-violet-500" },
  cancelled: { label: "Cancelado", dotColor: "bg-red-500" },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, dotColor: "bg-gray-400" }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#555555]">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  )
}
