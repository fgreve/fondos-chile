import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="font-display text-hero text-text-dark mb-4">404</h1>
      <p className="text-body-large text-text-secondary mb-8">
        La página que buscas no existe.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-text-charcoal text-white rounded-standard font-semibold text-sm hover:bg-text-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
