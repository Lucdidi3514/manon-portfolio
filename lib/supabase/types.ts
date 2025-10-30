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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          image_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          image_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      creations: {
        Row: {
          id: string
          title: string
          slug: string
          category_id: string | null
          description: string
          materials: string[]
          sizes: string[]
          colors: string[]
          featured: boolean
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category_id?: string | null
          description?: string
          materials?: string[]
          sizes?: string[]
          colors?: string[]
          featured?: boolean
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category_id?: string | null
          description?: string
          materials?: string[]
          sizes?: string[]
          colors?: string[]
          featured?: boolean
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      creation_images: {
        Row: {
          id: string
          creation_id: string
          url: string
          alt_text: string
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          creation_id: string
          url: string
          alt_text?: string
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          creation_id?: string
          url?: string
          alt_text?: string
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
          read?: boolean
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

export type Category = Database['public']['Tables']['categories']['Row']
export type Creation = Database['public']['Tables']['creations']['Row']
export type CreationImage = Database['public']['Tables']['creation_images']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']

export type CreationWithDetails = Creation & {
  category: Category | null
  images: CreationImage[]
}
