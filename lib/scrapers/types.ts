export interface RawCall {
  title: string
  status?: string
  opens_at?: string
  closes_at?: string
  results_at?: string
  max_amount_clp?: number
  duration_months?: number
  requirements?: string
  official_url: string
  bases_pdf_url?: string
  raw_html?: string
  /** Name of the fund/program (used by multi-fund scrapers like AcciónInnova) */
  fund_name?: string
  /** Country or geographic scope */
  country?: string
  /** Beneficiary type slug (e.g. 'empresas', 'personas-naturales') */
  beneficiary_type_slug?: string
  /** Industry slugs for classification */
  industry_slugs?: string[]
}

export interface RawAwardedProject {
  project_code?: string
  title: string
  principal_investigator?: string
  institution?: string
  amount_clp?: number
  year: number
  abstract?: string
  source_url?: string
}
