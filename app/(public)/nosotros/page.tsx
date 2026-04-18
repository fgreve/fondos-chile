import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros — FondosChile",
  description:
    "Conoce al equipo detrás de FondosChile, la plataforma que centraliza los fondos de investigación e innovación en Chile.",
}

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <h1 className="font-display text-4xl font-bold text-text-dark mb-4">
        Sobre FondosChile
      </h1>
      <p className="text-lg text-text-secondary mb-12 max-w-2xl">
        La fuente única de verdad sobre el ecosistema de financiamiento CTCi en
        Chile.
      </p>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-semibold text-text-dark mb-4">
          Nuestra misión
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          FondosChile nació de una necesidad concreta: la información sobre
          fondos de investigación, innovación y emprendimiento en Chile está
          dispersa en decenas de sitios gubernamentales, agencias y
          organizaciones. Investigadores, emprendedores y empresas pierden horas
          buscando oportunidades que podrían transformar sus proyectos.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Nuestra plataforma centraliza, actualiza y organiza toda esta
          información en un solo lugar, con scrapers automáticos que revisan
          diariamente las fuentes oficiales para que nunca te pierdas una
          convocatoria.
        </p>
      </section>

      {/* What we do */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-semibold text-text-dark mb-6">
          Qué hacemos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Catálogo vigente",
              description:
                "Concursos abiertos y próximos con fechas, requisitos, monto y bases oficiales de ANID, Corfo, FIA, AcciónInnova y más.",
            },
            {
              title: "Archivo histórico",
              description:
                "Convocatorias cerradas y proyectos adjudicados, buscables por año, institución, área y postulante.",
            },
            {
              title: "Actualización diaria",
              description:
                "Scrapers programados que revisan las fuentes oficiales cada 24 horas para mantener los datos siempre frescos.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-surface-white rounded-generous border border-surface-border p-6"
            >
              <h3 className="font-display font-semibold text-text-dark mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-semibold text-text-dark mb-4">
          Nuestras fuentes
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Todos los datos provienen de fuentes oficiales públicas. Actualmente
          cubrimos:
        </p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "ANID",
            "Corfo",
            "FIA",
            "AcciónInnova",
            "Fondos.gob.cl",
            "Minciencia",
          ].map((source) => (
            <li
              key={source}
              className="flex items-center gap-2 text-text-secondary"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue" />
              {source}
            </li>
          ))}
        </ul>
      </section>

      {/* Open data */}
      <section className="bg-surface-light rounded-generous p-8">
        <h2 className="font-display text-2xl font-semibold text-text-dark mb-4">
          Datos abiertos
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Creemos en la transparencia y el acceso libre a la información.
          FondosChile utiliza exclusivamente datos públicos obtenidos de fuentes
          oficiales. Nuestro objetivo es democratizar el acceso a las
          oportunidades de financiamiento para la innovación en Chile.
        </p>
      </section>
    </div>
  )
}
