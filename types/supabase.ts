export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price_per_kg: number
          price_per_sack: number
          sack_weight: number
          image: string
          animal_type: string
          sub_type: string | null
          benefits: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price_per_kg: number
          price_per_sack?: number
          sack_weight?: number
          image: string
          animal_type: string
          sub_type?: string | null
          benefits: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price_per_kg?: number
          price_per_sack?: number
          sack_weight?: number
          image?: string
          animal_type?: string
          sub_type?: string | null
          benefits?: string[]
          created_at?: string
          updated_at?: string
        }
      },
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      orders: {
        Row: {
          id: string
          client_id: string
          order_date: string
          status: string
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          order_date?: string
          status?: string
          total_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          order_date?: string
          status?: string
          total_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      order_items: {
        Row: {
          id: string
          order_id: string
          product_name: string
          description: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_name: string
          description?: string | null
          quantity?: number
          unit_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_name?: string
          description?: string | null
          quantity?: number
          unit_price?: number
          created_at?: string
          updated_at?: string
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
