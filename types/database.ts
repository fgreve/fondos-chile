export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Insert: {
          id?: string
          slug: string
          name: string
          short_name?: string | null
          website?: string | null
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          short_name?: string | null
          website?: string | null
          logo_url?: string | null
          created_at?: string
        }
        Relationships: []
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
          category_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          slug: string
          name: string
          description?: string | null
          typical_amount_clp?: number | null
          target_audience?: string | null
          category_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          slug?: string
          name?: string
          description?: string | null
          typical_amount_clp?: number | null
          target_audience?: string | null
          category_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funds_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funds_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "fund_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          id: string
          fund_id: string
          year: number
          title: string
          status: string
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
          beneficiary_type_id: string | null
          country: string | null
          last_scraped_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fund_id: string
          year: number
          title: string
          status: string
          opens_at?: string | null
          closes_at?: string | null
          results_at?: string | null
          start_date?: string | null
          max_amount_clp?: number | null
          duration_months?: number | null
          requirements?: string | null
          official_url: string
          bases_pdf_url?: string | null
          raw_source?: Json | null
          beneficiary_type_id?: string | null
          country?: string | null
          last_scraped_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fund_id?: string
          year?: number
          title?: string
          status?: string
          opens_at?: string | null
          closes_at?: string | null
          results_at?: string | null
          start_date?: string | null
          max_amount_clp?: number | null
          duration_months?: number | null
          requirements?: string | null
          official_url?: string
          bases_pdf_url?: string | null
          raw_source?: Json | null
          beneficiary_type_id?: string | null
          country?: string | null
          last_scraped_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_beneficiary_type_id_fkey"
            columns: ["beneficiary_type_id"]
            isOneToOne: false
            referencedRelation: "beneficiary_types"
            referencedColumns: ["id"]
          },
        ]
      }
      areas: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
        }
        Relationships: []
      }
      call_areas: {
        Row: {
          call_id: string
          area_id: string
        }
        Insert: {
          call_id: string
          area_id: string
        }
        Update: {
          call_id?: string
          area_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_areas_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          id: string
          slug: string
          name: string
          sort_order: number
        }
        Insert: {
          id?: string
          slug: string
          name: string
          sort_order?: number
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      beneficiary_types: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
        }
        Relationships: []
      }
      fund_categories: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
        }
        Relationships: []
      }
      call_industries: {
        Row: {
          call_id: string
          industry_id: string
        }
        Insert: {
          call_id: string
          industry_id: string
        }
        Update: {
          call_id?: string
          industry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_industries_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
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
        Insert: {
          id?: string
          call_id: string
          project_code?: string | null
          title: string
          principal_investigator?: string | null
          institution?: string | null
          amount_clp?: number | null
          year: number
          abstract?: string | null
          source_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          call_id?: string
          project_code?: string | null
          title?: string
          principal_investigator?: string | null
          institution?: string | null
          amount_clp?: number | null
          year?: number
          abstract?: string | null
          source_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "awarded_projects_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
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
        Insert: {
          id?: string
          user_id: string
          agency_ids?: string[] | null
          area_ids?: string[] | null
          min_amount_clp?: number | null
          email_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agency_ids?: string[] | null
          area_ids?: string[] | null
          min_amount_clp?: number | null
          email_enabled?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Agency = Database['public']['Tables']['agencies']['Row']
export type Fund = Database['public']['Tables']['funds']['Row']
export type Call = Database['public']['Tables']['calls']['Row']
export type Area = Database['public']['Tables']['areas']['Row']
export type AwardedProject = Database['public']['Tables']['awarded_projects']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Industry = Database['public']['Tables']['industries']['Row']
export type BeneficiaryType = Database['public']['Tables']['beneficiary_types']['Row']
export type FundCategory = Database['public']['Tables']['fund_categories']['Row']

// Joined types for UI
export type CallWithFundAndAgency = Call & {
  fund: Fund & {
    agency: Agency
  }
}
