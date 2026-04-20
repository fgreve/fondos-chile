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
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f0]/95 backdrop-blur-sm border-b border-[#e8e8e8]">
      <nav className="mx-auto max-w-[1120px] flex items-center justify-between px-6 h-14">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#1a1a1a] hover:after:w-full after:transition-all after:duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[#0055FF] hover:text-[#0044cc] transition-colors duration-200"
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
