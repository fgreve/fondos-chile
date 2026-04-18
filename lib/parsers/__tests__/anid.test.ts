import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { join } from "path"
import { parseAnidCalls } from "../anid"

const fixture = readFileSync(
  join(__dirname, "../../scrapers/__fixtures__/anid-concursos.html"),
  "utf-8"
)

describe("parseAnidCalls", () => {
  it("parses calls from ANID HTML fixture", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls).toHaveLength(3)
  })

  it("extracts titles correctly", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].title).toBe("Fondecyt Regular 2026")
    expect(calls[1].title).toBe("FONDEF IDeA I+D 2026")
  })

  it("maps status values", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].status).toBe("open")
    expect(calls[1].status).toBe("upcoming")
    expect(calls[2].status).toBe("closed")
  })

  it("extracts and formats dates", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].closes_at).toBe("2026-06-15T23:59:59Z")
    expect(calls[2].closes_at).toBe("2026-03-31T23:59:59Z")
  })

  it("builds full URLs from relative paths", () => {
    const calls = parseAnidCalls(fixture)
    expect(calls[0].official_url).toBe("https://anid.cl/concursos/fondecyt-regular-2026")
  })

  it("handles empty HTML gracefully", () => {
    const calls = parseAnidCalls("<html><body></body></html>")
    expect(calls).toHaveLength(0)
  })
})
