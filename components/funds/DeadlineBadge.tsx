import { differenceInDays, isPast } from "date-fns"

interface DeadlineBadgeProps {
  closesAt: string | null
  status: string
}

export function DeadlineBadge({ closesAt, status }: DeadlineBadgeProps) {
  if (!closesAt || status !== "open") return null

  const deadline = new Date(closesAt)
  const daysLeft = differenceInDays(deadline, new Date())

  if (isPast(deadline)) {
    return (
      <span className="text-sm font-medium text-[#dc2626]">
        Plazo vencido
      </span>
    )
  }

  if (daysLeft <= 7) {
    return (
      <span className="text-sm font-medium text-[#dc2626]">
        {daysLeft === 0 ? "Último día" : `${daysLeft}d restantes`}
      </span>
    )
  }

  if (daysLeft <= 30) {
    return (
      <span className="text-sm font-medium text-[#b45309]">
        {daysLeft}d restantes
      </span>
    )
  }

  return (
    <span className="text-sm font-medium text-[#1a8754]">
      {daysLeft}d restantes
    </span>
  )
}
