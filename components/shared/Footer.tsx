import Link from "next/link"
import { Logo } from "./Logo"

const navLinks = [
  { href: "/fondos", label: "Fondos" },
  { href: "/historico", label: "Histórico" },
  { href: "/agencias", label: "Agencias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

const contactLinks = [
  { label: "Santiago de Chile", href: "#" },
  { label: "contacto@fondoschile.cl", href: "mailto:contacto@fondoschile.cl" },
]

export function Footer() {
  return (
    <>
      {/* CTA Band */}
      <section className="bg-[#1a3c3c] py-20 px-6 text-center">
        <h2 className="font-[DM_Serif_Display,serif] text-3xl md:text-4xl text-white mb-4">
          ¿Buscas financiamiento para tu proyecto?
        </h2>
        <p className="text-white/70 mb-8 max-w-lg mx-auto">
          Explora cientos de oportunidades de fondos de investigación e innovación en Chile.
        </p>
        <Link
          href="/fondos"
          className="inline-flex items-center px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-[#1a3c3c] transition-all duration-200 text-sm font-medium"
        >
          Explorar fondos
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#15302f] text-white/70">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <Logo variant="light" />
              <p className="text-sm text-white/50 mt-4 leading-relaxed max-w-xs">
                Plataforma que centraliza los fondos de investigación, innovación y desarrollo en Chile.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                Navegación
              </h3>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                Contacto
              </h3>
              <ul className="space-y-2.5">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/40">
            © {new Date().getFullYear()} FondosChile. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  )
}
