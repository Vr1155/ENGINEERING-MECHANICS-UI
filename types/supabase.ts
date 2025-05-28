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
          full_name: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      problems: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: number
          category: string
          correct_solution: Json
          hints: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty: number
          category: string
          correct_solution: Json
          hints?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty?: number
          category?: string
          correct_solution?: Json
          hints?: string[] | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          attempts: number
          last_attempt: Json | null
          is_completed: boolean
          score: number | null
          time_spent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_id: string
          attempts?: number
          last_attempt?: Json | null
          is_completed?: boolean
          score?: number | null
          time_spent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problem_id?: string
          attempts?: number
          last_attempt?: Json | null
          is_completed?: boolean
          score?: number | null
          time_spent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}