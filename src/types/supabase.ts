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
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          date: string
          location: string | null
          user_id: string
          template_id: string | null
          banner_image: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          date: string
          location?: string | null
          user_id: string
          template_id?: string | null
          banner_image?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          date?: string
          location?: string | null
          user_id?: string
          template_id?: string | null
          banner_image?: string | null
          status?: string
        }
      }
      vendors: {
        Row: {
          id: string
          created_at: string
          name: string
          category: string
          description: string | null
          contact_email: string | null
          contact_phone: string | null
          website: string | null
          rating: number | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          category: string
          description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          rating?: number | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          category?: string
          description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          rating?: number | null
          image_url?: string | null
        }
      }
      event_vendors: {
        Row: {
          id: string
          event_id: string
          vendor_id: string
          status: string
          price: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          event_id: string
          vendor_id: string
          status?: string
          price?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          vendor_id?: string
          status?: string
          price?: number | null
          notes?: string | null
        }
      }
      guests: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string
          phone: string | null
          rsvp_status: string
          plus_ones: number
          notes: string | null
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email: string
          phone?: string | null
          rsvp_status?: string
          plus_ones?: number
          notes?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          email?: string
          phone?: string | null
          rsvp_status?: string
          plus_ones?: number
          notes?: string | null
        }
      }
      budget_items: {
        Row: {
          id: string
          event_id: string
          category: string
          item: string
          estimated_cost: number
          actual_cost: number | null
          paid: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          event_id: string
          category: string
          item: string
          estimated_cost: number
          actual_cost?: number | null
          paid?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          category?: string
          item?: string
          estimated_cost?: number
          actual_cost?: number | null
          paid?: boolean
          notes?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          event_id: string
          title: string
          description: string | null
          due_date: string | null
          status: string
          priority: string
        }
        Insert: {
          id?: string
          event_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: string
          priority?: string
        }
        Update: {
          id?: string
          event_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: string
          priority?: string
        }
      }
      event_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          tasks: Json[] | null
          budget_categories: Json[] | null
          banner_image: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          tasks?: Json[] | null
          budget_categories?: Json[] | null
          banner_image?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          tasks?: Json[] | null
          budget_categories?: Json[] | null
          banner_image?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          email: string | null
          phone: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          phone?: string | null
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