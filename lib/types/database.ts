export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      models: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          location: string
          image_url: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          location: string
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          location?: string
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          model_id: string
          client_name: string
          client_email: string
          event_name: string
          start_date: string
          end_date: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          model_id: string
          client_name: string
          client_email: string
          event_name: string
          start_date: string
          end_date: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          client_name?: string
          client_email?: string
          event_name?: string
          start_date?: string
          end_date?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

