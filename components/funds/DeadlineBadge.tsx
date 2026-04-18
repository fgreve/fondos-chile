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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-red-100 text-red-700">
        Plazo vencido
      </span>
    )
  }

  if (daysLeft <= 7) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-orange-100 text-orange-700">
        {daysLeft === 0 ? "Último día" : `${daysLeft}d restantes`}
      </span>
    )
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-yellow-100 text-yellow-700">
        {daysLeft}d restantes
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-small-label font-semibold bg-green-100 text-green-700">
      {daysLeft}d restantes
    </span>
  )
}
