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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointment_reminders: {
        Row: {
          appointment_id: string
          error_message: string | null
          id: string
          reminder_type: string
          sent_at: string
          status: string | null
        }
        Insert: {
          appointment_id: string
          error_message?: string | null
          id?: string
          reminder_type: string
          sent_at?: string
          status?: string | null
        }
        Update: {
          appointment_id?: string
          error_message?: string | null
          id?: string
          reminder_type?: string
          sent_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_services: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          service_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          service_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          booking_source: string | null
          confirmation_sent: boolean | null
          created_at: string
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          reminder_sent: boolean | null
          service: string | null
          status: string | null
          total_duration_minutes: number | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          booking_source?: string | null
          confirmation_sent?: boolean | null
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          service?: string | null
          status?: string | null
          total_duration_minutes?: number | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          booking_source?: string | null
          confirmation_sent?: boolean | null
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          service?: string | null
          status?: string | null
          total_duration_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      blocked_slots: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string
          end_time: string | null
          id: string
          is_recurring: boolean | null
          reason: string | null
          recurrence_pattern: string | null
          start_date: string
          start_time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date: string
          end_time?: string | null
          id?: string
          is_recurring?: boolean | null
          reason?: string | null
          recurrence_pattern?: string | null
          start_date: string
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string
          end_time?: string | null
          id?: string
          is_recurring?: boolean | null
          reason?: string | null
          recurrence_pattern?: string | null
          start_date?: string
          start_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          media_type: string
          media_url: string
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          media_type: string
          media_url: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          media_type?: string
          media_url?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          admin_email_notifications: boolean | null
          admin_sms_notifications: boolean | null
          email_enabled: boolean | null
          id: string
          reminder_hours_before: number | null
          sms_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          admin_email_notifications?: boolean | null
          admin_sms_notifications?: boolean | null
          email_enabled?: boolean | null
          id?: string
          reminder_hours_before?: number | null
          sms_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          admin_email_notifications?: boolean | null
          admin_sms_notifications?: boolean | null
          email_enabled?: boolean | null
          id?: string
          reminder_hours_before?: number | null
          sms_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          description: string
          discount_type: string | null
          discount_value: number | null
          free_service_name: string | null
          id: string
          is_active: boolean | null
          offer_type: string
          times_used: number | null
          title: string
          updated_at: string
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description: string
          discount_type?: string | null
          discount_value?: number | null
          free_service_name?: string | null
          id?: string
          is_active?: boolean | null
          offer_type: string
          times_used?: number | null
          title: string
          updated_at?: string
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          discount_type?: string | null
          discount_value?: number | null
          free_service_name?: string | null
          id?: string
          is_active?: boolean | null
          offer_type?: string
          times_used?: number | null
          title?: string
          updated_at?: string
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          appointment_id: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          points: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          points: number
          transaction_type: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          points?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email_marketing_consent: boolean | null
          full_name: string | null
          has_received_welcome_offer: boolean | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_marketing_consent?: boolean | null
          full_name?: string | null
          has_received_welcome_offer?: boolean | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_marketing_consent?: boolean | null
          full_name?: string | null
          has_received_welcome_offer?: boolean | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referred_email: string
          referred_points_awarded: boolean | null
          referred_user_id: string | null
          referrer_id: string
          referrer_points_awarded: boolean | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_email: string
          referred_points_awarded?: boolean | null
          referred_user_id?: string | null
          referrer_id: string
          referrer_points_awarded?: boolean | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_email?: string
          referred_points_awarded?: boolean | null
          referred_user_id?: string | null
          referrer_id?: string
          referrer_points_awarded?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          description: string
          discount_type: string
          discount_value: number | null
          free_service_name: string | null
          id: string
          is_active: boolean | null
          points_required: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          discount_type: string
          discount_value?: number | null
          free_service_name?: string | null
          id?: string
          is_active?: boolean | null
          points_required: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          discount_type?: string
          discount_value?: number | null
          free_service_name?: string | null
          id?: string
          is_active?: boolean | null
          points_required?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          lifetime_points: number
          points_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifetime_points?: number
          points_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_points?: number
          points_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          appointment_id: string | null
          id: string
          redeemed_at: string
          reward_id: string
          status: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          id?: string
          redeemed_at?: string
          reward_id: string
          status?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          id?: string
          redeemed_at?: string
          reward_id?: string
          status?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Enums: {
      app_role: "admin" | "user" | "owner" | "staff"
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
      app_role: ["admin", "user", "owner", "staff"],
    },
  },
} as const
