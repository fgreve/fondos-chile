import type { Metadata } from "next"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "FondosChile — Fondos de investigación e innovación en Chile",
    template: "%s | FondosChile",
  },
  description:
    "Encuentra todos los fondos de investigación, innovación y desarrollo disponibles en Chile. ANID, Corfo, FIA, FONDEF y más.",
  keywords: [
    "fondos investigación Chile",
    "ANID",
    "Corfo",
    "Fondecyt",
    "FONDEF",
    "innovación Chile",
    "financiamiento CTCi",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
