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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nickname: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          nickname?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nickname?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trading_profiles: {
        Row: {
          absolute_min_rr: number | null
          alert_priorities: Json | null
          created_at: string | null
          custom_rules: Json | null
          daily_loss_limit: number | null
          dominance_importance: string | null
          entry_timeframe: string | null
          excluded_assets: Json | null
          excluded_hours: string | null
          experience_level: string | null
          fixed_stop_percent: number | null
          futures_indicators_importance: string | null
          hard_rules: Json | null
          id: string
          ideal_risk_reward: number | null
          improvement_goals: Json | null
          language: string | null
          leverage_preference: string | null
          loss_experiences: Json | null
          main_analysis_timeframe: string | null
          max_positions: number | null
          max_risk_per_trade: number | null
          min_risk_reward: number | null
          monthly_goal: number | null
          ob_1touch_confidence: string | null
          ob_2touch_confidence: string | null
          ob_3touch_confidence: string | null
          onboarding_completed: boolean | null
          onchain_importance: string | null
          preferred_direction: string | null
          primary_assets: Json | null
          response_length: string | null
          rsi_force_exit: number | null
          rsi_no_entry_above: number | null
          rsi_oversold_interest: number | null
          rsi_take_profit_start: number | null
          stop_loss_type: string | null
          success_experiences: Json | null
          timezone: string | null
          trader_nickname: string | null
          trader_type: string | null
          trading_hours_end: string | null
          trading_hours_start: string | null
          trading_style: string | null
          updated_at: string | null
          use_emojis: boolean | null
          use_harmonics: boolean | null
          user_id: string
          warning_intensity: string | null
          watchlist_assets: Json | null
          weaknesses: Json | null
          weekend_trading: boolean | null
          yearly_goal: number | null
        }
        Insert: {
          absolute_min_rr?: number | null
          alert_priorities?: Json | null
          created_at?: string | null
          custom_rules?: Json | null
          daily_loss_limit?: number | null
          dominance_importance?: string | null
          entry_timeframe?: string | null
          excluded_assets?: Json | null
          excluded_hours?: string | null
          experience_level?: string | null
          fixed_stop_percent?: number | null
          futures_indicators_importance?: string | null
          hard_rules?: Json | null
          id?: string
          ideal_risk_reward?: number | null
          improvement_goals?: Json | null
          language?: string | null
          leverage_preference?: string | null
          loss_experiences?: Json | null
          main_analysis_timeframe?: string | null
          max_positions?: number | null
          max_risk_per_trade?: number | null
          min_risk_reward?: number | null
          monthly_goal?: number | null
          ob_1touch_confidence?: string | null
          ob_2touch_confidence?: string | null
          ob_3touch_confidence?: string | null
          onboarding_completed?: boolean | null
          onchain_importance?: string | null
          preferred_direction?: string | null
          primary_assets?: Json | null
          response_length?: string | null
          rsi_force_exit?: number | null
          rsi_no_entry_above?: number | null
          rsi_oversold_interest?: number | null
          rsi_take_profit_start?: number | null
          stop_loss_type?: string | null
          success_experiences?: Json | null
          timezone?: string | null
          trader_nickname?: string | null
          trader_type?: string | null
          trading_hours_end?: string | null
          trading_hours_start?: string | null
          trading_style?: string | null
          updated_at?: string | null
          use_emojis?: boolean | null
          use_harmonics?: boolean | null
          user_id: string
          warning_intensity?: string | null
          watchlist_assets?: Json | null
          weaknesses?: Json | null
          weekend_trading?: boolean | null
          yearly_goal?: number | null
        }
        Update: {
          absolute_min_rr?: number | null
          alert_priorities?: Json | null
          created_at?: string | null
          custom_rules?: Json | null
          daily_loss_limit?: number | null
          dominance_importance?: string | null
          entry_timeframe?: string | null
          excluded_assets?: Json | null
          excluded_hours?: string | null
          experience_level?: string | null
          fixed_stop_percent?: number | null
          futures_indicators_importance?: string | null
          hard_rules?: Json | null
          id?: string
          ideal_risk_reward?: number | null
          improvement_goals?: Json | null
          language?: string | null
          leverage_preference?: string | null
          loss_experiences?: Json | null
          main_analysis_timeframe?: string | null
          max_positions?: number | null
          max_risk_per_trade?: number | null
          min_risk_reward?: number | null
          monthly_goal?: number | null
          ob_1touch_confidence?: string | null
          ob_2touch_confidence?: string | null
          ob_3touch_confidence?: string | null
          onboarding_completed?: boolean | null
          onchain_importance?: string | null
          preferred_direction?: string | null
          primary_assets?: Json | null
          response_length?: string | null
          rsi_force_exit?: number | null
          rsi_no_entry_above?: number | null
          rsi_oversold_interest?: number | null
          rsi_take_profit_start?: number | null
          stop_loss_type?: string | null
          success_experiences?: Json | null
          timezone?: string | null
          trader_nickname?: string | null
          trader_type?: string | null
          trading_hours_end?: string | null
          trading_hours_start?: string | null
          trading_style?: string | null
          updated_at?: string | null
          use_emojis?: boolean | null
          use_harmonics?: boolean | null
          user_id?: string
          warning_intensity?: string | null
          watchlist_assets?: Json | null
          weaknesses?: Json | null
          weekend_trading?: boolean | null
          yearly_goal?: number | null
        }
        Relationships: []
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
