export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          ativa: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativa?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativa?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_settings: {
        Row: {
          id: string
          image_url: string | null
          slug: string
          type: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          slug: string
          type: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string | null
          slug?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          audio_url: string | null
          content: string | null
          course_id: string
          created_at: string
          id: string
          is_preview: boolean | null
          order_index: number | null
          slug: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          course_id: string
          created_at?: string
          id?: string
          is_preview?: boolean | null
          order_index?: number | null
          slug: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          course_id?: string
          created_at?: string
          id?: string
          is_preview?: boolean | null
          order_index?: number | null
          slug?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_purchases: {
        Row: {
          amount_cents: number
          course_id: string
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          course_id: string
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          course_id?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          level: string | null
          price_cents: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          level?: string | null
          price_cents?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          level?: string | null
          price_cents?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      entidades: {
        Row: {
          atuação: string | null
          caracteristicas: string | null
          created_at: string
          descricao: string
          id: string
          nome: string
          popularidade: number | null
          premium: boolean | null
          tipo: string
          updated_at: string
        }
        Insert: {
          atuação?: string | null
          caracteristicas?: string | null
          created_at?: string
          descricao: string
          id?: string
          nome: string
          popularidade?: number | null
          premium?: boolean | null
          tipo: string
          updated_at?: string
        }
        Update: {
          atuação?: string | null
          caracteristicas?: string | null
          created_at?: string
          descricao?: string
          id?: string
          nome?: string
          popularidade?: number | null
          premium?: boolean | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      estudo_progresso: {
        Row: {
          created_at: string
          estudo_slug: string
          id: string
          porcentagem: number
          ultima_secao: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estudo_slug: string
          id?: string
          porcentagem?: number
          ultima_secao?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estudo_slug?: string
          id?: string
          porcentagem?: number
          ultima_secao?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          created_at: string
          id: string
          item_id: string
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_path_courses: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          learning_path_id: string | null
          order_index: number
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          learning_path_id?: string | null
          order_index: number
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          learning_path_id?: string | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_courses_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          course_id: string | null
          created_at: string
          id: string
          last_watched_at: string | null
          lesson_id: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          id?: string
          last_watched_at?: string | null
          lesson_id?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          id?: string
          last_watched_at?: string | null
          lesson_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      library_item_access: {
        Row: {
          id: string
          item_id: string | null
          last_accessed_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          item_id?: string | null
          last_accessed_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          item_id?: string | null
          last_accessed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_item_access_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          file_url: string
          id: string
          is_advanced: boolean | null
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          is_advanced?: boolean | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          is_advanced?: boolean | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orixas: {
        Row: {
          caracteristicas: string | null
          cor: string | null
          created_at: string
          descricao: string | null
          elemento: string | null
          ervas: string | null
          flores: string | null
          frutas: string | null
          id: string
          imagem_url: string | null
          nome: string
          pedras: string | null
          popularidade: number | null
          saudacao: string | null
          trono: string | null
          updated_at: string
        }
        Insert: {
          caracteristicas?: string | null
          cor?: string | null
          created_at?: string
          descricao?: string | null
          elemento?: string | null
          ervas?: string | null
          flores?: string | null
          frutas?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          pedras?: string | null
          popularidade?: number | null
          saudacao?: string | null
          trono?: string | null
          updated_at?: string
        }
        Update: {
          caracteristicas?: string | null
          cor?: string | null
          created_at?: string
          descricao?: string | null
          elemento?: string | null
          ervas?: string | null
          flores?: string | null
          frutas?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          pedras?: string | null
          popularidade?: number | null
          saudacao?: string | null
          trono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          is_premium: boolean | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          modo_expandido: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          modo_expandido?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          modo_expandido?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
