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
          id: number
          username: string
          password: string
          full_name: string
          role: string
          created_at: string
        }
        Insert: {
          id?: number
          username: string
          password: string
          full_name: string
          role: string
          created_at?: string
        }
        Update: {
          id?: number
          username?: string
          password?: string
          full_name?: string
          role?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: number
          customer_name: string
          business_name: string
          business_type: string
          phone: string
          address: string
          activation_code: string
          subscription_type: string
          device_count: number
          subscription_start: string
          subscription_end: string
          notes?: string
          created_at: string
          created_by: number
          agent_name: string
          version_type: string
        }
        Insert: {
          id?: number
          customer_name: string
          business_name: string
          business_type: string
          phone: string
          address: string
          activation_code: string
          subscription_type: string
          device_count: number
          subscription_start: string
          subscription_end: string
          notes?: string
          created_at?: string
          created_by: number
          agent_name: string
          version_type: string
        }
        Update: {
          id?: number
          customer_name?: string
          business_name?: string
          business_type?: string
          phone?: string
          address?: string
          activation_code?: string
          subscription_type?: string
          device_count?: number
          subscription_start?: string
          subscription_end?: string
          notes?: string
          created_at?: string
          created_by?: number
          agent_name?: string
          version_type?: string
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