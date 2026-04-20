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
    return <span className="text-xs font-medium text-red-600">Plazo vencido</span>
  }

  if (daysLeft <= 7) {
    return (
      <span className="text-xs font-medium text-red-600">
        {daysLeft === 0 ? "Último día" : `${daysLeft}d restantes`}
      </span>
    )
  }

  if (daysLeft <= 30) {
    return <span className="text-xs font-medium text-amber-600">{daysLeft}d restantes</span>
  }

  return <span className="text-xs font-medium text-emerald-600">{daysLeft}d restantes</span>
}
