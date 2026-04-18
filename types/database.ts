export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          slug: string
          name: string
          short_name: string | null
          website: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['agencies']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['agencies']['Insert']>
      }
      funds: {
        Row: {
          id: string
          agency_id: string
          slug: string
          name: string
          description: string | null
          typical_amount_clp: number | null
          target_audience: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['funds']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['funds']['Insert']>
      }
      calls: {
        Row: {
          id: string
          fund_id: string
          year: number
          title: string
          status: 'upcoming' | 'open' | 'closed' | 'awarded' | 'cancelled'
          opens_at: string | null
          closes_at: string | null
          results_at: string | null
          start_date: string | null
          max_amount_clp: number | null
          duration_months: number | null
          requirements: string | null
          official_url: string
          bases_pdf_url: string | null
          raw_source: Json | null
          last_scraped_at: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['calls']['Row'], 'id' | 'last_scraped_at' | 'created_at' | 'updated_at'> & {
          id?: string
          last_scraped_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['calls']['Insert']>
      }
      areas: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: Omit<Database['public']['Tables']['areas']['Row'], 'id'> & {
          id?: string
        }
        Update: Partial<Database['public']['Tables']['areas']['Insert']>
      }
      call_areas: {
        Row: {
          call_id: string
          area_id: string
        }
        Insert: Database['public']['Tables']['call_areas']['Row']
        Update: Partial<Database['public']['Tables']['call_areas']['Insert']>
      }
      awarded_projects: {
        Row: {
          id: string
          call_id: string
          project_code: string | null
          title: string
          principal_investigator: string | null
          institution: string | null
          amount_clp: number | null
          year: number
          abstract: string | null
          source_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['awarded_projects']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['awarded_projects']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          agency_ids: string[] | null
          area_ids: string[] | null
          min_amount_clp: number | null
          email_enabled: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'email_enabled'> & {
          id?: string
          created_at?: string
          email_enabled?: boolean
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Agency = Database['public']['Tables']['agencies']['Row']
export type Fund = Database['public']['Tables']['funds']['Row']
export type Call = Database['public']['Tables']['calls']['Row']
export type Area = Database['public']['Tables']['areas']['Row']
export type AwardedProject = Database['public']['Tables']['awarded_projects']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

// Joined types for UI
export type CallWithFundAndAgency = Call & {
  fund: Fund & {
    agency: Agency
  }
}
