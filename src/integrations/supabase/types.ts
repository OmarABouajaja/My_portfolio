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
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          items: Json
          notes: string | null
          status: string
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          items?: Json
          notes?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          items?: Json
          notes?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: { id: string, slug: string, title_en: string, title_es: string | null, title_fr: string | null, title_ar: string | null, summary_en: string, summary_es: string | null, summary_fr: string | null, summary_ar: string | null, content_en: string, content_es: string | null, content_fr: string | null, content_ar: string | null, image_url: string | null, published: boolean, published_at: string | null, created_at: string, updated_at: string }
        Insert: { id?: string, slug: string, title_en: string, title_es?: string | null, title_fr?: string | null, title_ar?: string | null, summary_en?: string, summary_es?: string | null, summary_fr?: string | null, summary_ar?: string | null, content_en: string, content_es?: string | null, content_fr?: string | null, content_ar?: string | null, image_url?: string | null, published?: boolean, published_at?: string | null, created_at?: string, updated_at?: string }
        Update: { id?: string, slug?: string, title_en?: string, title_es?: string | null, title_fr?: string | null, title_ar?: string | null, summary_en?: string, summary_es?: string | null, summary_fr?: string | null, summary_ar?: string | null, content_en?: string, content_es?: string | null, content_fr?: string | null, content_ar?: string | null, image_url?: string | null, published?: boolean, published_at?: string | null, created_at?: string, updated_at?: string }
        Relationships: []
      }
      chat_messages: {
        Row: { id: string, client_token_id: string, sender: 'client' | 'omar', text: string, read: boolean, created_at: string }
        Insert: { id?: string, client_token_id: string, sender: 'client' | 'omar', text: string, read?: boolean, created_at?: string }
        Update: { id?: string, client_token_id?: string, sender?: 'client' | 'omar', text?: string, read?: boolean, created_at?: string }
        Relationships: []
      }
      client_projects: {
        Row: { id: string, client_token_id: string, name: string, status: string, progress: number, milestones: Json, last_update: string | null, created_at: string, updated_at: string }
        Insert: { id?: string, client_token_id: string, name: string, status?: string, progress?: number, milestones?: Json, last_update?: string | null, created_at?: string, updated_at?: string }
        Update: { id?: string, client_token_id?: string, name?: string, status?: string, progress?: number, milestones?: Json, last_update?: string | null, created_at?: string, updated_at?: string }
        Relationships: []
      }
      client_tokens: {
        Row: { id: string, token: string, client_name: string, client_email: string | null, active: boolean, created_at: string }
        Insert: { id?: string, token: string, client_name: string, client_email?: string | null, active?: boolean, created_at?: string }
        Update: { id?: string, token?: string, client_name?: string, client_email?: string | null, active?: boolean, created_at?: string }
        Relationships: []
      }
      contact_submissions: {
        Row: { id: string, name: string, email: string, message: string, status: string, created_at: string }
        Insert: { id?: string, name: string, email: string, message: string, status?: string, created_at?: string }
        Update: { id?: string, name?: string, email?: string, message?: string, status?: string, created_at?: string }
        Relationships: []
      }
      equipment: {
        Row: { id: string, name: string, category: string, description_en: string | null, description_fr: string | null, description_es: string | null, description_ar: string | null, image_url: string | null, link_url: string | null, display_order: number, created_at: string, updated_at: string }
        Insert: { id?: string, name: string, category?: string, description_en?: string | null, description_fr?: string | null, description_es?: string | null, description_ar?: string | null, image_url?: string | null, link_url?: string | null, display_order?: number, created_at?: string, updated_at?: string }
        Update: { id?: string, name?: string, category?: string, description_en?: string | null, description_fr?: string | null, description_es?: string | null, description_ar?: string | null, image_url?: string | null, link_url?: string | null, display_order?: number, created_at?: string, updated_at?: string }
        Relationships: []
      }
      certifications: {
        Row: {
          id: string
          title_en: string
          title_fr: string | null
          title_es: string | null
          title_ar: string | null
          issuer: string
          issue_date: string | null
          credential_id: string | null
          credential_url: string | null
          image_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_en: string
          title_fr?: string | null
          title_es?: string | null
          title_ar?: string | null
          issuer: string
          issue_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          image_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_en?: string
          title_fr?: string | null
          title_es?: string | null
          title_ar?: string | null
          issuer?: string
          issue_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          image_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_settings: {
        Row: { id: string, user_id: string | null, monthly_goal: number, currency: string, updated_at: string }
        Insert: { id?: string, user_id?: string | null, monthly_goal?: number, currency?: string, updated_at?: string }
        Update: { id?: string, user_id?: string | null, monthly_goal?: number, currency?: string, updated_at?: string }
        Relationships: []
      }
      services: {
        Row: { id: string, title_en: string, title_fr: string | null, title_es: string | null, title_ar: string | null, description_en: string, description_fr: string | null, description_es: string | null, description_ar: string | null, features_en: string[], features_fr: string[], features_es: string[], features_ar: string[], icon: string, price_tier: string | null, display_order: number, created_at: string, updated_at: string }
        Insert: { id?: string, title_en: string, title_fr?: string | null, title_es?: string | null, title_ar?: string | null, description_en: string, description_fr?: string | null, description_es?: string | null, description_ar?: string | null, features_en?: string[], features_fr?: string[], features_es?: string[], features_ar?: string[], icon?: string, price_tier?: string | null, display_order?: number, created_at?: string, updated_at?: string }
        Update: { id?: string, title_en?: string, title_fr?: string | null, title_es?: string | null, title_ar?: string | null, description_en?: string, description_fr?: string | null, description_es?: string | null, description_ar?: string | null, features_en?: string[], features_fr?: string[], features_es?: string[], features_ar?: string[], icon?: string, price_tier?: string | null, display_order?: number, created_at?: string, updated_at?: string }
        Relationships: []
      }
      skills: {
        Row: { id: string, name: string, category: string, icon: string, proficiency: number, display_order: number, created_at: string }
        Insert: { id?: string, name: string, category: string, icon: string, proficiency: number, display_order?: number, created_at?: string }
        Update: { id?: string, name?: string, category?: string, icon?: string, proficiency?: number, display_order?: number, created_at?: string }
        Relationships: []
      }
      testimonials: {
        Row: { id: string, client_name: string, client_role: string, content_en: string, content_es: string | null, content_fr: string | null, content_ar: string | null, avatar_url: string | null, rating: number, featured: boolean, display_order: number, created_at: string }
        Insert: { id?: string, client_name: string, client_role: string, content_en: string, content_es?: string | null, content_fr?: string | null, content_ar?: string | null, avatar_url?: string | null, rating?: number, featured?: boolean, display_order?: number, created_at?: string }
        Update: { id?: string, client_name?: string, client_role?: string, content_en?: string, content_es?: string | null, content_fr?: string | null, content_ar?: string | null, avatar_url?: string | null, rating?: number, featured?: boolean, display_order?: number, created_at?: string }
        Relationships: []
      }
      transactions: {
        Row: { id: string, user_id: string | null, title: string, amount: number, type: 'income' | 'expense', date: string, created_at: string }
        Insert: { id?: string, user_id?: string | null, title: string, amount?: number, type?: 'income' | 'expense', date?: string, created_at?: string }
        Update: { id?: string, user_id?: string | null, title?: string, amount?: number, type?: 'income' | 'expense', date?: string, created_at?: string }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          description_ar: string | null
          description_en: string
          description_es: string | null
          description_fr: string | null
          display_order: number
          featured: boolean
          github_url: string | null
          drive_url: string | null
          id: string
          image_url: string | null
          live_url: string | null
          slug: string
          tech_stack: string[]
          title_ar: string | null
          title_en: string
          title_es: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description_ar?: string | null
          description_en: string
          description_es?: string | null
          description_fr?: string | null
          display_order?: number
          featured?: boolean
          github_url?: string | null
          drive_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          slug: string
          tech_stack?: string[]
          title_ar?: string | null
          title_en: string
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string
          description_es?: string | null
          description_fr?: string | null
          display_order?: number
          featured?: boolean
          github_url?: string | null
          drive_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          slug?: string
          tech_stack?: string[]
          title_ar?: string | null
          title_en?: string
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_metadata: {
        Row: {
          active_projects_count: number
          contact_email: string | null
          hiring_status: boolean
          id: string
          last_build: string
          primary_theme_color: string
          resume_url: string | null
          system_status: string
          enable_projects: boolean
          enable_timeline: boolean
          enable_tech_stack: boolean
          enable_testimonials: boolean
          enable_blog: boolean
          enable_contact: boolean
          updated_at: string
        }
        Insert: {
          active_projects_count?: number
          contact_email?: string | null
          hiring_status?: boolean
          id?: string
          last_build?: string
          primary_theme_color?: string
          resume_url?: string | null
          system_status?: string
          enable_projects?: boolean
          enable_timeline?: boolean
          enable_tech_stack?: boolean
          enable_testimonials?: boolean
          enable_blog?: boolean
          enable_contact?: boolean
          updated_at?: string
        }
        Update: {
          active_projects_count?: number
          contact_email?: string | null
          hiring_status?: boolean
          id?: string
          last_build?: string
          primary_theme_color?: string
          resume_url?: string | null
          system_status?: string
          enable_projects?: boolean
          enable_timeline?: boolean
          enable_tech_stack?: boolean
          enable_testimonials?: boolean
          enable_blog?: boolean
          enable_contact?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: { id: string, platform: string, label: string, url: string, icon: string, display_order: number, visible: boolean, created_at: string, updated_at: string }
        Insert: { id?: string, platform: string, label: string, url: string, icon?: string, display_order?: number, visible?: boolean, created_at?: string, updated_at?: string }
        Update: { id?: string, platform?: string, label?: string, url?: string, icon?: string, display_order?: number, visible?: boolean, created_at?: string, updated_at?: string }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string
          description_es: string | null
          description_fr: string | null
          display_order: number
          highlight: boolean
          icon: string
          id: string
          title_ar: string | null
          title_en: string
          title_es: string | null
          title_fr: string | null
          year: number
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en: string
          description_es?: string | null
          description_fr?: string | null
          display_order?: number
          highlight?: boolean
          icon?: string
          id?: string
          title_ar?: string | null
          title_en: string
          title_es?: string | null
          title_fr?: string | null
          year: number
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string
          description_es?: string | null
          description_fr?: string | null
          display_order?: number
          highlight?: boolean
          icon?: string
          id?: string
          title_ar?: string | null
          title_en?: string
          title_es?: string | null
          title_fr?: string | null
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_logs: {
        Row: {
          id: string
          ip_address: string | null
          os: string | null
          browser: string | null
          location: string | null
          user_agent: string | null
          resolution: string | null
          languages: string | null
          device_memory: string | null
          hardware_concurrency: number | null
          gpu_renderer: string | null
          network_type: string | null
          touch_support: boolean | null
          pixel_ratio: number | null
          country: string | null
          region: string | null
          city: string | null
          isp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          os?: string | null
          browser?: string | null
          location?: string | null
          user_agent?: string | null
          resolution?: string | null
          languages?: string | null
          device_memory?: string | null
          hardware_concurrency?: number | null
          gpu_renderer?: string | null
          network_type?: string | null
          touch_support?: boolean | null
          pixel_ratio?: number | null
          country?: string | null
          region?: string | null
          city?: string | null
          isp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          os?: string | null
          browser?: string | null
          location?: string | null
          user_agent?: string | null
          resolution?: string | null
          languages?: string | null
          device_memory?: string | null
          hardware_concurrency?: number | null
          gpu_renderer?: string | null
          network_type?: string | null
          touch_support?: boolean | null
          pixel_ratio?: number | null
          country?: string | null
          region?: string | null
          city?: string | null
          isp?: string | null
          created_at?: string
        }
        Relationships: []
      }
      system_secrets: {
        Row: {
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_client_token: {
        Args: { p_token: string }
        Returns: { token_id: string, client_name: string, client_email: string }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
