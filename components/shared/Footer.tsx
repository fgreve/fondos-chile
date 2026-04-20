import Link from "next/link"

const footerLinks = [
  { href: "/fondos", label: "Fondos" },
  { href: "/historico", label: "Histórico" },
  { href: "/agencias", label: "Agencias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/70">
      <div className="mx-auto max-w-[1120px] px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-[Satoshi,sans-serif] font-bold text-sm text-white tracking-tight">
            FondosChile
          </Link>
          <nav className="hidden sm:flex items-center gap-5">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} FondosChile
        </p>
      </div>
    </footer>
  )
}
