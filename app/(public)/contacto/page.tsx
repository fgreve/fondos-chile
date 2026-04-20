import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para reportar errores, sugerir mejoras o consultar sobre FondosChile.",
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16">
      <p className="text-sm font-medium text-[#0055FF] uppercase tracking-[0.08em] mb-3">
        Contacto
      </p>
      <h1 className="font-[Satoshi,sans-serif] font-bold text-[3rem] leading-[1.1] tracking-tight text-[#1a1a1a] max-w-[640px] mb-4">
        ¿Cómo podemos ayudarte?
      </h1>
      <p className="text-lg text-[#6b6b6b] max-w-[520px] mb-12 leading-relaxed">
        Preguntas, sugerencias o reportes de errores. Nos encantaría saber de ti.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e8e8e8] mb-16">
        {[
          {
            title: "Reportar un error",
            description:
              "Si un fondo tiene información incorrecta o desactualizada.",
            cta: "Reportar",
            href: "mailto:contacto@fondoschile.cl?subject=Reporte de error",
          },
          {
            title: "Sugerir una fuente",
            description:
              "¿Conoces una fuente de fondos que no estamos cubriendo?",
            cta: "Sugerir",
            href: "mailto:contacto@fondoschile.cl?subject=Sugerencia de fuente",
          },
          {
            title: "Colaboraciones",
            description:
              "Si representas a una agencia y quieres integrar tus datos.",
            cta: "Escribir",
            href: "mailto:contacto@fondoschile.cl?subject=Colaboración",
          },
          {
            title: "Prensa y medios",
            description:
              "Para consultas de prensa o entrevistas sobre la plataforma.",
            cta: "Contactar",
            href: "mailto:contacto@fondoschile.cl?subject=Prensa",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 border border-[#e8e8e8] flex flex-col"
          >
            <h2 className="font-[Satoshi,sans-serif] font-bold text-base text-[#1a1a1a] mb-1.5">
              {card.title}
            </h2>
            <p className="text-sm text-[#6b6b6b] leading-relaxed mb-4 flex-1">
              {card.description}
            </p>
            <Link
              href={card.href}
              className="text-sm font-medium text-[#0055FF] hover:text-[#0044cc] transition-colors duration-200"
            >
              {card.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="max-w-[640px]">
        <h2 className="font-[Satoshi,sans-serif] font-bold text-xl tracking-tight text-[#1a1a1a] mb-8">
          Preguntas frecuentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "¿Los datos son oficiales?",
              a: "Sí. Toda la información proviene directamente de fuentes oficiales públicas como ANID, Corfo, FIA y AcciónInnova.",
            },
            {
              q: "¿Puedo postular desde FondosChile?",
              a: "No. FondosChile es un catálogo informativo. Cada fondo incluye un enlace directo al sitio oficial de postulación.",
            },
            {
              q: "¿Con qué frecuencia se actualizan?",
              a: "Los scrapers se ejecutan diariamente entre las 06:00 y 08:00 UTC, revisando todas las fuentes.",
            },
            {
              q: "¿Cómo recibo alertas de nuevos fondos?",
              a: "Estamos trabajando en suscripciones personalizadas por email. Pronto podrás configurar alertas según tu perfil.",
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-[#e8e8e8] pb-6">
              <h3 className="font-[Satoshi,sans-serif] font-bold text-base text-[#1a1a1a] mb-1.5">
                {faq.q}
              </h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
