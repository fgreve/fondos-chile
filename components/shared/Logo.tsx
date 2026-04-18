import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-standard bg-brand-blue flex items-center justify-center">
        <span className="text-white font-display font-semibold text-sm">FC</span>
      </div>
      <span className="font-display font-semibold text-lg text-text-dark">
        FondosChile
      </span>
    </Link>
  )
}
