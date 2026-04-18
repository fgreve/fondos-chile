import { describe, it, expect } from "vitest"
import { formatCLP, formatDate } from "../utils"

describe("formatCLP", () => {
  it("formats numbers as Chilean pesos", () => {
    const result = formatCLP(150000000)
    expect(result).toContain("150.000.000")
  })

  it("handles zero", () => {
    const result = formatCLP(0)
    expect(result).toContain("0")
  })
})

describe("formatDate", () => {
  it("formats dates in Chilean Spanish", () => {
    // Use midday UTC to avoid timezone offset changing the day
    const result = formatDate("2026-06-15T12:00:00Z")
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2026/)
  })
})
