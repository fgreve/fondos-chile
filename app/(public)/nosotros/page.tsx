import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce FondosChile, la plataforma que centraliza los fondos de investigación e innovación en Chile.",
}

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16">
      {/* Hero */}
      <p className="text-sm font-medium text-[#0055FF] uppercase tracking-[0.08em] mb-3">
        Sobre nosotros
      </p>
      <h1 className="font-[Satoshi,sans-serif] font-bold text-[3rem] leading-[1.1] tracking-tight text-[#1a1a1a] max-w-[640px] mb-4">
        La fuente única sobre financiamiento CTCi en Chile
      </h1>
      <p className="text-lg text-[#6b6b6b] max-w-[560px] mb-16 leading-relaxed">
        Centralizamos información dispersa en decenas de sitios gubernamentales para que nunca te pierdas una convocatoria.
      </p>

      {/* Mission */}
      <section className="mb-16 max-w-[640px]">
        <h2 className="font-[Satoshi,sans-serif] font-bold text-xl tracking-tight text-[#1a1a1a] mb-4">
          Nuestra misión
        </h2>
        <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
          FondosChile nació de una necesidad concreta: la información sobre
          fondos de investigación, innovación y emprendimiento en Chile está
          dispersa en decenas de sitios gubernamentales, agencias y
          organizaciones. Investigadores, emprendedores y empresas pierden horas
          buscando oportunidades que podrían transformar sus proyectos.
        </p>
        <p className="text-base text-[#6b6b6b] leading-relaxed">
          Nuestra plataforma centraliza, actualiza y organiza toda esta
          información en un solo lugar, con scrapers automáticos que revisan
          diariamente las fuentes oficiales.
        </p>
      </section>

      {/* What we do */}
      <section className="mb-16">
        <h2 className="font-[Satoshi,sans-serif] font-bold text-xl tracking-tight text-[#1a1a1a] mb-6">
          Qué hacemos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e8e8e8]">
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
              className="bg-white p-6 border border-[#e8e8e8]"
            >
              <h3 className="font-[Satoshi,sans-serif] font-bold text-base text-[#1a1a1a] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="mb-16 max-w-[640px]">
        <h2 className="font-[Satoshi,sans-serif] font-bold text-xl tracking-tight text-[#1a1a1a] mb-4">
          Fuentes
        </h2>
        <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
          Todos los datos provienen de fuentes oficiales públicas:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {["ANID", "Corfo", "FIA", "AcciónInnova", "Fondos.gob.cl", "Minciencia"].map((source) => (
            <span key={source} className="text-sm text-[#6b6b6b] py-1">
              {source}
            </span>
          ))}
        </div>
      </section>

      {/* Open data */}
      <section className="border-t border-[#e8e8e8] pt-12 max-w-[640px]">
        <h2 className="font-[Satoshi,sans-serif] font-bold text-xl tracking-tight text-[#1a1a1a] mb-4">
          Datos abiertos
        </h2>
        <p className="text-base text-[#6b6b6b] leading-relaxed">
          Creemos en la transparencia y el acceso libre a la información.
          FondosChile utiliza exclusivamente datos públicos obtenidos de fuentes
          oficiales. Nuestro objetivo es democratizar el acceso a las
          oportunidades de financiamiento para la innovación en Chile.
        </p>
      </section>
    </div>
  )
}
