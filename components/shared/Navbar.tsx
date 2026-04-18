import Link from "next/link"
import { Logo } from "./Logo"
import { MobileNav } from "./MobileNav"

const navItems = [
  { href: "/fondos", label: "Fondos" },
  { href: "/historico", label: "Histórico" },
  { href: "/agencias", label: "Agencias" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-text-charcoal/95 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Logo variant="light" />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-white/80 rounded-pill hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <MobileNav items={navItems} />
        </div>
      </nav>
    </header>
  )
}
