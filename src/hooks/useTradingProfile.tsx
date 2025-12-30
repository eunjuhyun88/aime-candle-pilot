import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface TradingProfile {
  id?: string;
  user_id?: string;
  trader_nickname?: string;
  experience_level?: string;
  trader_type?: string;
  trading_style?: string;
  preferred_direction?: string;
  leverage_preference?: string;
  primary_assets?: string[];
  watchlist_assets?: string[];
  excluded_assets?: string[];
  timezone?: string;
  trading_hours_start?: string;
  trading_hours_end?: string;
  excluded_hours?: string;
  weekend_trading?: boolean;
  max_risk_per_trade?: number;
  daily_loss_limit?: number;
  max_positions?: number;
  min_risk_reward?: number;
  ideal_risk_reward?: number;
  absolute_min_rr?: number;
  stop_loss_type?: string;
  fixed_stop_percent?: number;
  rsi_take_profit_start?: number;
  rsi_force_exit?: number;
  rsi_no_entry_above?: number;
  rsi_oversold_interest?: number;
  ob_1touch_confidence?: string;
  ob_2touch_confidence?: string;
  ob_3touch_confidence?: string;
  main_analysis_timeframe?: string;
  entry_timeframe?: string;
  custom_rules?: string[];
  loss_experiences?: { date: string; asset: string; description: string; loss: string; lesson: string }[];
  success_experiences?: { date: string; asset: string; description: string; profit: string; strength: string }[];
  weaknesses?: { weakness: string; warning: string }[];
  onchain_importance?: string;
  futures_indicators_importance?: string;
  dominance_importance?: string;
  use_harmonics?: boolean;
  response_length?: string;
  use_emojis?: boolean;
  language?: string;
  warning_intensity?: string;
  alert_priorities?: string[];
  hard_rules?: string[];
  monthly_goal?: number;
  yearly_goal?: number;
  improvement_goals?: string[];
  onboarding_completed?: boolean;
}

export function useTradingProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TradingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('trading_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching trading profile:', error);
    } else if (data) {
      setProfile({
        ...data,
        primary_assets: (data.primary_assets as string[]) || [],
        watchlist_assets: (data.watchlist_assets as string[]) || [],
        excluded_assets: (data.excluded_assets as string[]) || [],
        custom_rules: (data.custom_rules as string[]) || [],
        loss_experiences: (data.loss_experiences as TradingProfile['loss_experiences']) || [],
        success_experiences: (data.success_experiences as TradingProfile['success_experiences']) || [],
        weaknesses: (data.weaknesses as TradingProfile['weaknesses']) || [],
        alert_priorities: (data.alert_priorities as string[]) || [],
        hard_rules: (data.hard_rules as string[]) || [],
        improvement_goals: (data.improvement_goals as string[]) || [],
      });
    }
    setLoading(false);
  };

  const saveProfile = async (profileData: Partial<TradingProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const dataToSave = {
      ...profileData,
      user_id: user.id,
      primary_assets: profileData.primary_assets as unknown as Json,
      watchlist_assets: profileData.watchlist_assets as unknown as Json,
      excluded_assets: profileData.excluded_assets as unknown as Json,
      custom_rules: profileData.custom_rules as unknown as Json,
      loss_experiences: profileData.loss_experiences as unknown as Json,
      success_experiences: profileData.success_experiences as unknown as Json,
      weaknesses: profileData.weaknesses as unknown as Json,
      alert_priorities: profileData.alert_priorities as unknown as Json,
      hard_rules: profileData.hard_rules as unknown as Json,
      improvement_goals: profileData.improvement_goals as unknown as Json,
    };

    const { data, error } = await supabase
      .from('trading_profiles')
      .upsert(dataToSave, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving trading profile:', error);
      return { error };
    }

    setProfile({
      ...data,
      primary_assets: (data.primary_assets as string[]) || [],
      watchlist_assets: (data.watchlist_assets as string[]) || [],
      excluded_assets: (data.excluded_assets as string[]) || [],
      custom_rules: (data.custom_rules as string[]) || [],
      loss_experiences: (data.loss_experiences as TradingProfile['loss_experiences']) || [],
      success_experiences: (data.success_experiences as TradingProfile['success_experiences']) || [],
      weaknesses: (data.weaknesses as TradingProfile['weaknesses']) || [],
      alert_priorities: (data.alert_priorities as string[]) || [],
      hard_rules: (data.hard_rules as string[]) || [],
      improvement_goals: (data.improvement_goals as string[]) || [],
    });
    return { error: null };
  };

  return {
    profile,
    loading,
    saveProfile,
    refetch: fetchProfile,
  };
}
