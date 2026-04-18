import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { join } from "path"
import {
  parseAccionInnovaListing,
  parseAccionInnovaDetail,
  parseDate,
  parseAmount,
  mapBeneficiaryType,
} from "../accioninnova"

const listingHtml = readFileSync(
  join(__dirname, "../../scrapers/__fixtures__/accioninnova-listing.html"),
  "utf-8"
)

const detailHtml = readFileSync(
  join(__dirname, "../../scrapers/__fixtures__/accioninnova-detail.html"),
  "utf-8"
)

describe("parseAccionInnovaListing", () => {
  it("extracts all cards from listing page", () => {
    const { calls } = parseAccionInnovaListing(listingHtml)
    expect(calls).toHaveLength(3)
  })

  it("parses card fields correctly", () => {
    const { calls } = parseAccionInnovaListing(listingHtml)

    expect(calls[0]).toMatchObject({
      title: "SIA Incubation Program 2026",
      official_url: "https://accioninnova.org/oportunidades/2061/detalle",
      beneficiary_type_slug: "personas-naturales",
      country: "Varios Países",
      status: "open",
    })
    expect(calls[0].closes_at).toBe("2026-05-17T23:59:59Z")
    expect(calls[0].max_amount_clp).toBeUndefined() // "No especifica"
  })

  it("parses amount correctly", () => {
    const { calls } = parseAccionInnovaListing(listingHtml)
    expect(calls[1].max_amount_clp).toBe(909090909)
    expect(calls[2].max_amount_clp).toBe(20000000)
  })

  it("detects hasMore when verMasFondos2 exists", () => {
    const { hasMore } = parseAccionInnovaListing(listingHtml)
    expect(hasMore).toBe(true)
  })

  it("detects no more when verMasFondos2 is missing", () => {
    const { hasMore } = parseAccionInnovaListing("<div id='oportunidades-tabla'></div>")
    expect(hasMore).toBe(false)
  })
})

describe("parseAccionInnovaDetail", () => {
  it("extracts organization name as fund_name", () => {
    const result = parseAccionInnovaDetail(detailHtml)
    expect(result.fund_name).toBe("Empresa Nacional de Minería")
  })

  it("extracts official URL", () => {
    const result = parseAccionInnovaDetail(detailHtml)
    expect(result.official_url).toBe("https://fondos.gob.cl/ficha/enami/rr/")
  })

  it("extracts beneficiary type and country", () => {
    const result = parseAccionInnovaDetail(detailHtml)
    expect(result.beneficiary_type_slug).toBe("empresas")
    expect(result.country).toBe("Chile")
  })

  it("extracts deadline", () => {
    const result = parseAccionInnovaDetail(detailHtml)
    expect(result.closes_at).toBe("2026-05-29T23:59:59Z")
  })

  it("extracts amount", () => {
    const result = parseAccionInnovaDetail(detailHtml)
    expect(result.max_amount_clp).toBe(216812500)
  })

  it("extracts description", () => {
    const result = parseAccionInnovaDetail(detailHtml)
    expect(result.description).toContain("ENAMI apoya")
    expect(result.description).toContain("Cofinanciamiento no reembolsable")
  })
})

describe("parseDate", () => {
  it("parses DD-MM-YYYY format", () => {
    expect(parseDate("29-05-2026")).toBe("2026-05-29T23:59:59Z")
  })

  it("returns undefined for 'Todo el año'", () => {
    expect(parseDate("Todo el año")).toBeUndefined()
  })

  it("returns undefined for empty string", () => {
    expect(parseDate("")).toBeUndefined()
  })
})

describe("parseAmount", () => {
  it("parses dotted CLP amounts", () => {
    expect(parseAmount("216.812.500")).toBe(216812500)
  })

  it("returns undefined for 'No especifica'", () => {
    expect(parseAmount("No especifica")).toBeUndefined()
  })

  it("returns undefined for 'No monetario'", () => {
    expect(parseAmount("No monetario")).toBeUndefined()
  })
})

describe("mapBeneficiaryType", () => {
  it("maps known types", () => {
    expect(mapBeneficiaryType("Personas Naturales")).toBe("personas-naturales")
    expect(mapBeneficiaryType("Empresas")).toBe("empresas")
    expect(mapBeneficiaryType("Asociaciones")).toBe("asociaciones")
    expect(mapBeneficiaryType("Todos")).toBe("todos")
  })

  it("defaults to 'todos' for unknown types", () => {
    expect(mapBeneficiaryType("Something else")).toBe("todos")
  })
})
