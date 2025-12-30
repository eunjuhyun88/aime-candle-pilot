-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nickname TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trading profiles table for personalization
CREATE TABLE public.trading_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Basic Profile (Part 1)
  trader_nickname TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', '1-2years', '3-5years', '5years+')),
  trader_type TEXT CHECK (trader_type IN ('fulltime', 'parttime', 'hobby')),
  
  -- Trading Style
  trading_style TEXT CHECK (trading_style IN ('scalping', 'daytrading', 'swing', 'position', 'longterm')),
  preferred_direction TEXT CHECK (preferred_direction IN ('long', 'short', 'both')),
  leverage_preference TEXT CHECK (leverage_preference IN ('none', 'low', 'medium', 'high')),
  
  -- Trading Assets (stored as JSON arrays)
  primary_assets JSONB DEFAULT '[]'::jsonb,
  watchlist_assets JSONB DEFAULT '[]'::jsonb,
  excluded_assets JSONB DEFAULT '[]'::jsonb,
  
  -- Activity Time
  timezone TEXT DEFAULT 'Asia/Seoul',
  trading_hours_start TEXT,
  trading_hours_end TEXT,
  excluded_hours TEXT,
  weekend_trading BOOLEAN DEFAULT false,
  
  -- Risk Management (Part 2)
  max_risk_per_trade NUMERIC(5,2) DEFAULT 2.0,
  daily_loss_limit NUMERIC(5,2) DEFAULT 5.0,
  max_positions INTEGER DEFAULT 3,
  
  -- Risk Reward
  min_risk_reward NUMERIC(4,2) DEFAULT 2.0,
  ideal_risk_reward NUMERIC(4,2) DEFAULT 3.0,
  absolute_min_rr NUMERIC(4,2) DEFAULT 1.5,
  
  -- Stop Loss
  stop_loss_type TEXT CHECK (stop_loss_type IN ('fixed_percent', 'technical', 'hybrid')),
  fixed_stop_percent NUMERIC(5,2),
  
  -- RSI Settings (Part 3)
  rsi_take_profit_start INTEGER DEFAULT 90,
  rsi_force_exit INTEGER DEFAULT 95,
  rsi_no_entry_above INTEGER DEFAULT 90,
  rsi_oversold_interest INTEGER DEFAULT 30,
  
  -- OB/Level Settings
  ob_1touch_confidence TEXT DEFAULT 'high',
  ob_2touch_confidence TEXT DEFAULT 'medium',
  ob_3touch_confidence TEXT DEFAULT 'low',
  main_analysis_timeframe TEXT DEFAULT '4H',
  entry_timeframe TEXT DEFAULT '15m',
  
  -- Custom Rules
  custom_rules JSONB DEFAULT '[]'::jsonb,
  
  -- Past Experiences (Part 4)
  loss_experiences JSONB DEFAULT '[]'::jsonb,
  success_experiences JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  
  -- Preferences (Part 5)
  onchain_importance TEXT DEFAULT 'reference',
  futures_indicators_importance TEXT DEFAULT 'reference',
  dominance_importance TEXT DEFAULT 'reference',
  use_harmonics BOOLEAN DEFAULT false,
  
  -- AI Response Style
  response_length TEXT DEFAULT 'medium',
  use_emojis BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'korean',
  warning_intensity TEXT DEFAULT 'normal',
  
  -- Alert Priorities
  alert_priorities JSONB DEFAULT '["rsi_overheat", "stoploss_approach", "pattern_invalidation"]'::jsonb,
  
  -- Hard Rules (Part 6)
  hard_rules JSONB DEFAULT '[]'::jsonb,
  
  -- Goals (Part 7)
  monthly_goal NUMERIC(5,2),
  yearly_goal NUMERIC(6,2),
  improvement_goals JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.trading_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trading profile" ON public.trading_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own trading profile" ON public.trading_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading profile" ON public.trading_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trading profile" ON public.trading_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_trading_profiles_updated_at
  BEFORE UPDATE ON public.trading_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();