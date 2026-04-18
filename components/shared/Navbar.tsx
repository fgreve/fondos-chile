import Link from "next/link"
import { Logo } from "./Logo"
import { MobileNav } from "./MobileNav"

const navItems = [
  { href: "/fondos", label: "Fondos" },
  { href: "/historico", label: "Hist\u00f3rico" },
  { href: "/agencias", label: "Agencias" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface-white/80 backdrop-blur-md border-b border-surface-border-light">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-text-dark rounded-pill hover:bg-black/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-text-dark hover:text-brand-blue transition-colors"
          >
            Iniciar sesi\u00f3n
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
