import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce FondosChile, la plataforma que centraliza los fondos de investigación e innovación en Chile.",
}

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20">
      {/* Hero */}
      <div className="max-w-2xl mb-20">
        <h1 className="font-[DM_Serif_Display,serif] text-5xl leading-[1.1] text-[#1a1a1a] mb-6">
          La fuente única sobre financiamiento CTCi en Chile.
        </h1>
        <p className="text-lg text-[#555555] leading-relaxed">
          Centralizamos información dispersa en decenas de sitios gubernamentales para que nunca te pierdas una convocatoria.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-20 max-w-2xl">
        <h2 className="font-[DM_Serif_Display,serif] text-2xl text-[#1a1a1a] mb-4">
          Nuestra misión
        </h2>
        <p className="text-[#555555] leading-relaxed mb-4">
          FondosChile nació de una necesidad concreta: la información sobre
          fondos de investigación, innovación y emprendimiento en Chile está
          dispersa en decenas de sitios gubernamentales, agencias y
          organizaciones. Investigadores, emprendedores y empresas pierden horas
          buscando oportunidades que podrían transformar sus proyectos.
        </p>
        <p className="text-[#555555] leading-relaxed">
          Nuestra plataforma centraliza, actualiza y organiza toda esta
          información en un solo lugar, con scrapers automáticos que revisan
          diariamente las fuentes oficiales.
        </p>
      </section>

      {/* What we do */}
      <section className="mb-20">
        <h2 className="font-[DM_Serif_Display,serif] text-2xl text-[#1a1a1a] mb-8">
          Qué hacemos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Catálogo vigente",
              description:
                "Concursos abiertos y próximos con fechas, requisitos, monto y bases oficiales.",
            },
            {
              title: "Archivo histórico",
              description:
                "Convocatorias cerradas y proyectos adjudicados, buscables por año e institución.",
            },
            {
              title: "Actualización diaria",
              description:
                "Scrapers programados que revisan las fuentes oficiales cada 24 horas.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-[#e5e5e5] p-6"
            >
              <h3 className="font-semibold text-[#1a1a1a] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="mb-20 max-w-2xl">
        <h2 className="font-[DM_Serif_Display,serif] text-2xl text-[#1a1a1a] mb-4">
          Nuestras fuentes
        </h2>
        <p className="text-[#555555] leading-relaxed mb-6">
          Todos los datos provienen de fuentes oficiales públicas:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["ANID", "Corfo", "FIA", "AcciónInnova", "Fondos.gob.cl", "Minciencia"].map((source) => (
            <span key={source} className="flex items-center gap-2 text-sm text-[#555555]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a3c3c]" />
              {source}
            </span>
          ))}
        </div>
      </section>

      {/* Open data */}
      <section className="max-w-2xl border-t border-[#e5e5e5] pt-12">
        <h2 className="font-[DM_Serif_Display,serif] text-2xl text-[#1a1a1a] mb-4">
          Datos abiertos
        </h2>
        <p className="text-[#555555] leading-relaxed">
          Creemos en la transparencia y el acceso libre a la información.
          FondosChile utiliza exclusivamente datos públicos obtenidos de fuentes
          oficiales. Nuestro objetivo es democratizar el acceso a las
          oportunidades de financiamiento para la innovación en Chile.
        </p>
      </section>
    </div>
  )
}
