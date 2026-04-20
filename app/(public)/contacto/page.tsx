import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para reportar errores, sugerir mejoras o consultar sobre FondosChile.",
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20">
      <div className="max-w-2xl mb-16">
        <h1 className="font-[DM_Serif_Display,serif] text-5xl leading-[1.1] text-[#1a1a1a] mb-6">
          ¿Cómo podemos ayudarte?
        </h1>
        <p className="text-lg text-[#555555] leading-relaxed">
          Preguntas, sugerencias o reportes de errores. Nos encantaría saber de ti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
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
            className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex flex-col hover:border-[#1a3c3c]/30 transition-colors"
          >
            <h2 className="font-semibold text-lg text-[#1a1a1a] mb-2">
              {card.title}
            </h2>
            <p className="text-sm text-[#555555] leading-relaxed mb-5 flex-1">
              {card.description}
            </p>
            <Link
              href={card.href}
              className="text-sm font-medium text-[#1a3c3c] hover:text-[#2a5a5a] transition-colors"
            >
              {card.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="max-w-2xl">
        <h2 className="font-[DM_Serif_Display,serif] text-2xl text-[#1a1a1a] mb-8">
          Preguntas frecuentes
        </h2>
        <div className="space-y-8">
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
            <div key={faq.q} className="border-b border-[#e5e5e5] pb-8">
              <h3 className="font-semibold text-[#1a1a1a] mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
