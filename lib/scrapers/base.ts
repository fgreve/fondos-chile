import type { RawCall, RawAwardedProject } from "./types"

export interface Scraper {
  agency: string
  fetchCalls(): Promise<RawCall[]>
  fetchAwardedProjects?(year: number): Promise<RawAwardedProject[]>
}

export const SCRAPER_USER_AGENT = "FondosChileBot/1.0 (+https://fondoschile.cl)"
export const SCRAPER_DELAY_MS = 500
export const SCRAPER_CONCURRENCY = 2
