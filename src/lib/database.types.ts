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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'organizer' | 'promoter'
          organization_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'organizer' | 'promoter'
          organization_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'organizer' | 'promoter'
          organization_id?: string | null
          created_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          owner_id: string
          active_events_count: number
          total_promoters: number
          total_teams: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          active_events_count?: number
          total_promoters?: number
          total_teams?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          active_events_count?: number
          total_promoters?: number
          total_teams?: number
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          description: string
          location: string
          date: string
          image_url: string
          organization_id: string
          status: 'active' | 'finished' | 'cancelled'
          guest_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          location: string
          date: string
          image_url: string
          organization_id: string
          status?: 'active' | 'finished' | 'cancelled'
          guest_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location?: string
          date?: string
          image_url?: string
          organization_id?: string
          status?: 'active' | 'finished' | 'cancelled'
          guest_count?: number
          created_at?: string
        }
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
  }
}