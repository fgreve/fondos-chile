import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contacto — FondosChile",
  description:
    "Contáctanos para reportar errores, sugerir mejoras o consultar sobre FondosChile.",
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl font-bold text-text-dark mb-4">
        Contacto
      </h1>
      <p className="text-lg text-text-secondary mb-12 max-w-2xl">
        ¿Tienes preguntas, sugerencias o encontraste un error? Nos encantaría
        saber de ti.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Contact cards */}
        {[
          {
            title: "Reportar un error",
            description:
              "Si un fondo tiene información incorrecta o desactualizada, ayúdanos a corregirlo.",
            cta: "Reportar error",
            href: "mailto:contacto@fondoschile.cl?subject=Reporte de error",
          },
          {
            title: "Sugerir una fuente",
            description:
              "¿Conoces una fuente de fondos que no estamos cubriendo? Queremos saberlo.",
            cta: "Sugerir fuente",
            href: "mailto:contacto@fondoschile.cl?subject=Sugerencia de fuente",
          },
          {
            title: "Colaboraciones",
            description:
              "Si representas a una agencia o institución y quieres integrar tus datos, conversemos.",
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
            className="bg-surface-white rounded-generous border border-surface-border p-6 flex flex-col"
          >
            <h2 className="font-display font-semibold text-lg text-text-dark mb-2">
              {card.title}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
              {card.description}
            </p>
            <Link
              href={card.href}
              className="inline-flex items-center text-sm font-medium text-brand-blue hover:underline"
            >
              {card.cta} &rarr;
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ-like section */}
      <section className="bg-surface-light rounded-generous p-8">
        <h2 className="font-display text-2xl font-semibold text-text-dark mb-6">
          Preguntas frecuentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "¿Los datos son oficiales?",
              a: "Sí. Toda la información proviene directamente de fuentes oficiales públicas como ANID, Corfo, FIA y AcciónInnova. Nuestros scrapers verifican las fuentes diariamente.",
            },
            {
              q: "¿Puedo postular a los fondos desde FondosChile?",
              a: "No. FondosChile es un catálogo informativo. Cada fondo incluye un enlace directo al sitio oficial donde puedes realizar tu postulación.",
            },
            {
              q: "¿Con qué frecuencia se actualizan los datos?",
              a: "Los scrapers se ejecutan diariamente entre las 06:00 y 08:00 UTC, revisando todas las fuentes en busca de nuevas convocatorias o cambios en las existentes.",
            },
            {
              q: "¿Cómo puedo recibir alertas de nuevos fondos?",
              a: "Estamos trabajando en un sistema de suscripciones personalizadas por email. Pronto podrás configurar alertas según tu perfil e intereses.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold text-text-dark mb-1">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
