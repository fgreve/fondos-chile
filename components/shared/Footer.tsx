import Link from "next/link"

const footerLinks = {
  plataforma: [
    { href: "/fondos", label: "Fondos vigentes" },
    { href: "/historico", label: "Archivo histórico" },
    { href: "/historico/adjudicados", label: "Proyectos adjudicados" },
  ],
  agencias: [
    { href: "/agencias/anid", label: "ANID" },
    { href: "/agencias/corfo", label: "Corfo" },
    { href: "/agencias/fia", label: "FIA" },
    { href: "/agencias/minciencia", label: "Minciencia" },
  ],
  recursos: [
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
    { href: "/contacto", label: "Preguntas frecuentes" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-text-charcoal text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-standard bg-brand-blue flex items-center justify-center">
                <span className="text-white font-display font-semibold text-sm">FC</span>
              </div>
              <span className="font-display font-semibold text-lg text-white">
                FondosChile
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              La fuente única de verdad sobre el ecosistema de financiamiento CTCi en Chile.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
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
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          © {new Date().getFullYear()} FondosChile. Datos obtenidos de fuentes oficiales públicas.
        </div>
      </div>
    </footer>
  )
}
