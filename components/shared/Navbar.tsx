import Link from "next/link"
import { Logo } from "./Logo"
import { MobileNav } from "./MobileNav"

const navItems = [
  { href: "/fondos", label: "Fondos" },
  { href: "/historico", label: "Histórico" },
  { href: "/agencias", label: "Agencias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 lg:px-8 h-16">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#555555] hover:text-[#1a3c3c] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            className="text-sm text-[#1a3c3c] border border-[#1a3c3c] px-5 py-2 rounded-full hover:bg-[#1a3c3c] hover:text-white transition-all duration-200"
          >
            Iniciar sesión
          </Link>
        </div>

        <div className="md:hidden">
          <MobileNav items={navItems} />
        </div>
      </nav>
    </header>
  )
}
