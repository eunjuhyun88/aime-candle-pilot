import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TradingProfile {
  trader_nickname?: string;
  experience_level?: string;
  trader_type?: string;
  trading_style?: string;
  preferred_direction?: string;
  leverage_preference?: string;
  primary_assets?: string[];
  watchlist_assets?: string[];
  excluded_assets?: string[];
  max_risk_per_trade?: number;
  daily_loss_limit?: number;
  max_positions?: number;
  min_risk_reward?: number;
  stop_loss_type?: string;
  fixed_stop_percent?: number;
  rsi_take_profit_start?: number;
  rsi_force_exit?: number;
  rsi_no_entry_above?: number;
  rsi_oversold_interest?: number;
  main_analysis_timeframe?: string;
  entry_timeframe?: string;
  custom_rules?: string[];
  weaknesses?: { weakness: string; warning: string }[];
  hard_rules?: string[];
  response_length?: string;
  use_emojis?: boolean;
  language?: string;
  warning_intensity?: string;
}

function buildSystemPrompt(profile: TradingProfile | null): string {
  const basePrompt = `당신은 "Aime"라는 이름의 전문 트레이딩 AI 코파일럿입니다. 
차트 분석, 매매 전략, 리스크 관리에 대한 조언을 제공합니다.

핵심 원칙:
- 캔들 중심성(Candle-Centricity): 모든 분석은 가격 행동에서 시작합니다
- 멀티모달 통합: 온체인, 센티먼트, 뉴스를 종합합니다
- 리스크 우선: 수익보다 자본 보존을 우선합니다`;

  if (!profile) {
    return basePrompt + `\n\n사용자가 아직 개인화 설정을 완료하지 않았습니다. 일반적인 조언을 제공하되, 개인화 설정을 권장하세요.`;
  }

  let personalizedPrompt = basePrompt;

  // Add trader context
  if (profile.trader_nickname) {
    personalizedPrompt += `\n\n이 트레이더의 닉네임: ${profile.trader_nickname}`;
  }

  if (profile.experience_level) {
    const expMap: Record<string, string> = {
      'beginner': '초보 (1년 미만)',
      '1-2years': '1-2년 경력',
      '3-5years': '3-5년 경력',
      '5years+': '5년 이상 베테랑'
    };
    personalizedPrompt += `\n경력: ${expMap[profile.experience_level] || profile.experience_level}`;
  }

  if (profile.trading_style) {
    const styleMap: Record<string, string> = {
      'scalping': '스캘핑 (수분~수시간)',
      'daytrading': '데이트레이딩 (당일 청산)',
      'swing': '스윙 (수일~수주)',
      'position': '포지션 (수주~수개월)',
      'longterm': '장기 홀딩'
    };
    personalizedPrompt += `\n매매 스타일: ${styleMap[profile.trading_style] || profile.trading_style}`;
  }

  if (profile.preferred_direction) {
    const dirMap: Record<string, string> = {
      'long': '롱 위주',
      'short': '숏 위주',
      'both': '양방향'
    };
    personalizedPrompt += `\n선호 방향: ${dirMap[profile.preferred_direction] || profile.preferred_direction}`;
  }

  // Risk management rules
  personalizedPrompt += `\n\n=== 리스크 관리 규칙 ===`;
  if (profile.max_risk_per_trade) {
    personalizedPrompt += `\n- 1회 매매 최대 리스크: ${profile.max_risk_per_trade}%`;
  }
  if (profile.daily_loss_limit) {
    personalizedPrompt += `\n- 일일 최대 손실: ${profile.daily_loss_limit}% (도달 시 당일 매매 중단 권고)`;
  }
  if (profile.max_positions) {
    personalizedPrompt += `\n- 최대 동시 포지션: ${profile.max_positions}개`;
  }
  if (profile.min_risk_reward) {
    personalizedPrompt += `\n- 최소 손익비: ${profile.min_risk_reward}:1 이상만 진입`;
  }
  if (profile.stop_loss_type) {
    personalizedPrompt += `\n- 손절 방식: ${profile.stop_loss_type}`;
    if (profile.fixed_stop_percent) {
      personalizedPrompt += ` (${profile.fixed_stop_percent}%)`;
    }
  }

  // RSI rules
  personalizedPrompt += `\n\n=== RSI 규칙 ===`;
  if (profile.rsi_take_profit_start) {
    personalizedPrompt += `\n- RSI ${profile.rsi_take_profit_start} 이상: 익절 시작 권고`;
  }
  if (profile.rsi_force_exit) {
    personalizedPrompt += `\n- RSI ${profile.rsi_force_exit} 이상: 무조건 익절 권고`;
  }
  if (profile.rsi_no_entry_above) {
    personalizedPrompt += `\n- RSI ${profile.rsi_no_entry_above} 이상: 진입 금지`;
  }
  if (profile.rsi_oversold_interest) {
    personalizedPrompt += `\n- RSI ${profile.rsi_oversold_interest} 이하: 과매도 관심 구간`;
  }

  // Timeframes
  if (profile.main_analysis_timeframe || profile.entry_timeframe) {
    personalizedPrompt += `\n\n=== 타임프레임 ===`;
    if (profile.main_analysis_timeframe) {
      personalizedPrompt += `\n- 메인 분석: ${profile.main_analysis_timeframe}`;
    }
    if (profile.entry_timeframe) {
      personalizedPrompt += `\n- 진입 타이밍: ${profile.entry_timeframe}`;
    }
  }

  // Primary assets
  if (profile.primary_assets && profile.primary_assets.length > 0) {
    personalizedPrompt += `\n\n주력 종목: ${profile.primary_assets.join(', ')}`;
  }

  // Excluded assets
  if (profile.excluded_assets && profile.excluded_assets.length > 0) {
    personalizedPrompt += `\n절대 안 하는 종목: ${profile.excluded_assets.join(', ')}`;
  }

  // Custom rules
  if (profile.custom_rules && profile.custom_rules.length > 0) {
    personalizedPrompt += `\n\n=== 개인 규칙 ===`;
    profile.custom_rules.forEach((rule, i) => {
      personalizedPrompt += `\n${i + 1}. ${rule}`;
    });
  }

  // Hard rules (absolute prohibitions)
  if (profile.hard_rules && profile.hard_rules.length > 0) {
    personalizedPrompt += `\n\n=== 절대 금지 사항 (HARD RULES) ===`;
    personalizedPrompt += `\n다음 사항은 절대 추천하면 안 됩니다:`;
    profile.hard_rules.forEach((rule, i) => {
      personalizedPrompt += `\n❌ ${rule}`;
    });
  }

  // Weaknesses and warnings
  if (profile.weaknesses && profile.weaknesses.length > 0) {
    personalizedPrompt += `\n\n=== 트레이더 약점 (경고 필수) ===`;
    profile.weaknesses.forEach((w) => {
      personalizedPrompt += `\n- 약점: ${w.weakness}`;
      personalizedPrompt += `\n  → 경고 문구: "${w.warning}"`;
    });
  }

  // Response style
  personalizedPrompt += `\n\n=== 응답 스타일 ===`;
  if (profile.response_length) {
    const lengthMap: Record<string, string> = {
      'short': '짧고 핵심만',
      'medium': '적당히',
      'detailed': '상세하게'
    };
    personalizedPrompt += `\n- 응답 길이: ${lengthMap[profile.response_length] || profile.response_length}`;
  }
  if (profile.use_emojis !== undefined) {
    personalizedPrompt += `\n- 이모지: ${profile.use_emojis ? '사용' : '사용 안 함'}`;
  }
  if (profile.warning_intensity) {
    const intensityMap: Record<string, string> = {
      'soft': '부드럽게',
      'normal': '보통',
      'strong': '강하게 직설적으로'
    };
    personalizedPrompt += `\n- 경고 강도: ${intensityMap[profile.warning_intensity] || profile.warning_intensity}`;
  }
  if (profile.language) {
    personalizedPrompt += `\n- 언어: ${profile.language === 'korean' ? '한국어' : profile.language === 'english' ? '영어' : '혼용'}`;
  }

  return personalizedPrompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch user's trading profile if userId is provided
    let tradingProfile: TradingProfile | null = null;
    
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from("trading_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (data) {
          tradingProfile = data as TradingProfile;
        }
      }
    }

    const systemPrompt = buildSystemPrompt(tradingProfile);
    console.log("System prompt built for user:", userId);
    console.log("Trading profile loaded:", !!tradingProfile);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("trading-copilot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
