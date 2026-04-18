const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: "Abierto",
    className: "bg-green-100 text-green-700",
  },
  upcoming: {
    label: "Próximamente",
    className: "bg-primary-200 text-primary-700",
  },
  closed: {
    label: "Cerrado",
    className: "bg-gray-100 text-gray-600",
  },
  awarded: {
    label: "Adjudicado",
    className: "bg-purple-100 text-purple-700",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-600",
  },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-600" }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  )
}
