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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      city_config: {
        Row: {
          accent_color: string | null
          alert_spending_threshold: number | null
          always_flag_developers: string[] | null
          city_name: string
          city_state: string
          city_state_abbr: string
          city_website: string | null
          county: string | null
          created_at: string | null
          custom_domain: string | null
          display_name: string
          email_from: string | null
          full_url: string | null
          id: string
          logo_url: string | null
          population: number | null
          primary_color: string | null
          repeat_applicant_threshold: number | null
          slack_channel_id: string | null
          state_display_name: string | null
          state_domain: string | null
          subdomain: string | null
          tagline: string | null
          timezone: string | null
        }
        Insert: {
          accent_color?: string | null
          alert_spending_threshold?: number | null
          always_flag_developers?: string[] | null
          city_name: string
          city_state: string
          city_state_abbr: string
          city_website?: string | null
          county?: string | null
          created_at?: string | null
          custom_domain?: string | null
          display_name: string
          email_from?: string | null
          full_url?: string | null
          id?: string
          logo_url?: string | null
          population?: number | null
          primary_color?: string | null
          repeat_applicant_threshold?: number | null
          slack_channel_id?: string | null
          state_display_name?: string | null
          state_domain?: string | null
          subdomain?: string | null
          tagline?: string | null
          timezone?: string | null
        }
        Update: {
          accent_color?: string | null
          alert_spending_threshold?: number | null
          always_flag_developers?: string[] | null
          city_name?: string
          city_state?: string
          city_state_abbr?: string
          city_website?: string | null
          county?: string | null
          created_at?: string | null
          custom_domain?: string | null
          display_name?: string
          email_from?: string | null
          full_url?: string | null
          id?: string
          logo_url?: string | null
          population?: number | null
          primary_color?: string | null
          repeat_applicant_threshold?: number | null
          slack_channel_id?: string | null
          state_display_name?: string | null
          state_domain?: string | null
          subdomain?: string | null
          tagline?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          city_response: string | null
          created_at: string | null
          group_name: string
          id: string
          source_url: string | null
          summary: string
          theme: string | null
        }
        Insert: {
          city_response?: string | null
          created_at?: string | null
          group_name: string
          id?: string
          source_url?: string | null
          summary: string
          theme?: string | null
        }
        Update: {
          city_response?: string | null
          created_at?: string | null
          group_name?: string
          id?: string
          source_url?: string | null
          summary?: string
          theme?: string | null
        }
        Relationships: []
      }
      developers: {
        Row: {
          appearance_count: number | null
          applicant_name: string
          application_type: string | null
          created_at: string | null
          id: string
          location: string | null
          meeting_ids: string[] | null
          notes: string | null
          project_name: string | null
          source_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appearance_count?: number | null
          applicant_name: string
          application_type?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          meeting_ids?: string[] | null
          notes?: string | null
          project_name?: string | null
          source_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appearance_count?: number | null
          applicant_name?: string
          application_type?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          meeting_ids?: string[] | null
          notes?: string | null
          project_name?: string | null
          source_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      grama_requests: {
        Row: {
          created_at: string | null
          due_date: string | null
          filed_date: string | null
          id: string
          notes: string | null
          recipient: string | null
          request_text: string | null
          response_text: string | null
          status: string | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          filed_date?: string | null
          id?: string
          notes?: string | null
          recipient?: string | null
          request_text?: string | null
          response_text?: string | null
          status?: string | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          filed_date?: string | null
          id?: string
          notes?: string | null
          recipient?: string | null
          request_text?: string | null
          response_text?: string | null
          status?: string | null
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      high_priority_flags: {
        Row: {
          category: string
          flagged_at: string | null
          id: string
          resolved: boolean | null
          resolved_at: string | null
          source_url: string | null
          summary: string
          why_it_matters: string | null
        }
        Insert: {
          category: string
          flagged_at?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          source_url?: string | null
          summary: string
          why_it_matters?: string | null
        }
        Update: {
          category?: string
          flagged_at?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          source_url?: string | null
          summary?: string
          why_it_matters?: string | null
        }
        Relationships: []
      }
      issues: {
        Row: {
          category: string | null
          created_at: string | null
          financial_impact: string | null
          id: string
          legally_current: string | null
          priority: string | null
          related_meeting_ids: string[] | null
          related_official_ids: string[] | null
          source_url: string | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
          what_is_issue: string | null
          who_benefits: string | null
          who_harmed: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          financial_impact?: string | null
          id?: string
          legally_current?: string | null
          priority?: string | null
          related_meeting_ids?: string[] | null
          related_official_ids?: string[] | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          what_is_issue?: string | null
          who_benefits?: string | null
          who_harmed?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          financial_impact?: string | null
          id?: string
          legally_current?: string | null
          priority?: string | null
          related_meeting_ids?: string[] | null
          related_official_ids?: string[] | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          what_is_issue?: string | null
          who_benefits?: string | null
          who_harmed?: string | null
        }
        Relationships: []
      }
      legal_activity: {
        Row: {
          attorney: string
          created_at: string | null
          date_occurred: string | null
          description: string | null
          id: string
          matter_type: string | null
          priority: string | null
          source_url: string | null
        }
        Insert: {
          attorney: string
          created_at?: string | null
          date_occurred?: string | null
          description?: string | null
          id?: string
          matter_type?: string | null
          priority?: string | null
          source_url?: string | null
        }
        Update: {
          attorney?: string
          created_at?: string | null
          date_occurred?: string | null
          description?: string | null
          id?: string
          matter_type?: string | null
          priority?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      meeting_items: {
        Row: {
          created_at: string | null
          description: string | null
          financial_impact: string | null
          id: string
          item_title: string
          legally_current: string | null
          meeting_id: string | null
          priority: string | null
          sort_order: number | null
          what_is_issue: string | null
          who_benefits: string | null
          who_harmed: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          financial_impact?: string | null
          id?: string
          item_title: string
          legally_current?: string | null
          meeting_id?: string | null
          priority?: string | null
          sort_order?: number | null
          what_is_issue?: string | null
          who_benefits?: string | null
          who_harmed?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          financial_impact?: string | null
          id?: string
          item_title?: string
          legally_current?: string | null
          meeting_id?: string | null
          priority?: string | null
          sort_order?: number | null
          what_is_issue?: string | null
          who_benefits?: string | null
          who_harmed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "upcoming_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda_url: string | null
          body: string | null
          created_at: string | null
          executive_summary: string | null
          id: string
          location: string | null
          meeting_date: string | null
          meeting_type: string | null
          minutes_url: string | null
          packet_url: string | null
          status: string | null
          summary_generated_at: string | null
          title: string
          transcript_text: string | null
          transcript_url: string | null
          updated_at: string | null
          video_stream_url: string | null
          video_url: string | null
        }
        Insert: {
          agenda_url?: string | null
          body?: string | null
          created_at?: string | null
          executive_summary?: string | null
          id?: string
          location?: string | null
          meeting_date?: string | null
          meeting_type?: string | null
          minutes_url?: string | null
          packet_url?: string | null
          status?: string | null
          summary_generated_at?: string | null
          title: string
          transcript_text?: string | null
          transcript_url?: string | null
          updated_at?: string | null
          video_stream_url?: string | null
          video_url?: string | null
        }
        Update: {
          agenda_url?: string | null
          body?: string | null
          created_at?: string | null
          executive_summary?: string | null
          id?: string
          location?: string | null
          meeting_date?: string | null
          meeting_type?: string | null
          minutes_url?: string | null
          packet_url?: string | null
          status?: string | null
          summary_generated_at?: string | null
          title?: string
          transcript_text?: string | null
          transcript_url?: string | null
          updated_at?: string | null
          video_stream_url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      official_statements: {
        Row: {
          content: string
          created_at: string | null
          id: string
          official_id: string | null
          platform: string | null
          statement_date: string | null
          tags: string[] | null
          url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          official_id?: string | null
          platform?: string | null
          statement_date?: string | null
          tags?: string[] | null
          url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          official_id?: string | null
          platform?: string | null
          statement_date?: string | null
          tags?: string[] | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "official_statements_official_id_fkey"
            columns: ["official_id"]
            isOneToOne: false
            referencedRelation: "officials"
            referencedColumns: ["id"]
          },
        ]
      }
      officials: {
        Row: {
          bio: string | null
          contact_email: string | null
          created_at: string | null
          department: string | null
          first_observed: string | null
          id: string
          name: string
          photo_url: string | null
          role: string | null
          slug: string
          social_links: Json | null
          status: string | null
          title: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string | null
          department?: string | null
          first_observed?: string | null
          id?: string
          name: string
          photo_url?: string | null
          role?: string | null
          slug: string
          social_links?: Json | null
          status?: string | null
          title: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string | null
          department?: string | null
          first_observed?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          role?: string | null
          slug?: string
          social_links?: Json | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          confirm_token: string | null
          confirmed: boolean | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          phone: string | null
          subscribed_email: boolean | null
          subscribed_sms: boolean | null
          tier: string | null
        }
        Insert: {
          confirm_token?: string | null
          confirmed?: boolean | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          phone?: string | null
          subscribed_email?: boolean | null
          subscribed_sms?: boolean | null
          tier?: string | null
        }
        Update: {
          confirm_token?: string | null
          confirmed?: boolean | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          phone?: string | null
          subscribed_email?: boolean | null
          subscribed_sms?: boolean | null
          tier?: string | null
        }
        Relationships: []
      }
      system_log: {
        Row: {
          details: Json | null
          id: string
          message: string | null
          records_added: number | null
          run_at: string | null
          status: string
          task_name: string
        }
        Insert: {
          details?: Json | null
          id?: string
          message?: string | null
          records_added?: number | null
          run_at?: string | null
          status: string
          task_name: string
        }
        Update: {
          details?: Json | null
          id?: string
          message?: string | null
          records_added?: number | null
          run_at?: string | null
          status?: string
          task_name?: string
        }
        Relationships: []
      }
      utility_updates: {
        Row: {
          created_at: string | null
          financial_impact: string | null
          id: string
          priority: string | null
          source_url: string | null
          summary: string | null
          title: string
          utility: string
        }
        Insert: {
          created_at?: string | null
          financial_impact?: string | null
          id?: string
          priority?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          utility: string
        }
        Update: {
          created_at?: string | null
          financial_impact?: string | null
          id?: string
          priority?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          utility?: string
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          created_at: string | null
          full_content: string | null
          headline: string
          id: string
          published_at: string | null
          sections: Json | null
          updated_at: string | null
          week_ending: string
        }
        Insert: {
          created_at?: string | null
          full_content?: string | null
          headline: string
          id?: string
          published_at?: string | null
          sections?: Json | null
          updated_at?: string | null
          week_ending: string
        }
        Update: {
          created_at?: string | null
          full_content?: string | null
          headline?: string
          id?: string
          published_at?: string | null
          sections?: Json | null
          updated_at?: string | null
          week_ending?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_alert_count: {
        Row: {
          count: number | null
        }
        Relationships: []
      }
      upcoming_meetings: {
        Row: {
          agenda_url: string | null
          body: string | null
          created_at: string | null
          id: string | null
          location: string | null
          meeting_date: string | null
          meeting_type: string | null
          minutes_url: string | null
          packet_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          agenda_url?: string | null
          body?: string | null
          created_at?: string | null
          id?: string | null
          location?: string | null
          meeting_date?: string | null
          meeting_type?: string | null
          minutes_url?: string | null
          packet_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          agenda_url?: string | null
          body?: string | null
          created_at?: string | null
          id?: string | null
          location?: string | null
          meeting_date?: string | null
          meeting_type?: string | null
          minutes_url?: string | null
          packet_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
