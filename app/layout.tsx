import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
