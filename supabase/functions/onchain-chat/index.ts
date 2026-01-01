import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANALYSIS_TYPE_PROMPTS: Record<string, string> = {
  'htf-ltf': `## HTF → LTF 탑다운 분석 전문가
Weekly → Daily → 4H → 1H 순으로 다중 시간프레임 분석을 제공합니다.
- 각 시간프레임의 추세 방향 (상승/하락/횡보)
- 주요 구조적 레벨 (Higher High/Lower Low)
- 시간프레임 간 컨플루언스
- 현재 진입 적합성 판단`,

  'valuation': `## 코인 밸류에이션 분석 전문가
Market Cap, FDV, TVL 기반 가치 평가를 제공합니다.
- Market Cap 대비 FDV 비율 분석
- TVL/Market Cap 비율 (DeFi 토큰)
- 토큰 언락 스케줄 및 영향
- 경쟁 프로젝트 대비 상대 밸류에이션
- 고평가/저평가 판단`,

  'onchain': `## 온체인/파생상품 데이터 분석 전문가
실시간 파생상품 및 온체인 데이터를 분석합니다.
- CVD (Cumulative Volume Delta) 추세
- OI (Open Interest) 변화와 가격 상관관계
- Funding Rate 분석 및 시사점
- Long/Short Ratio 분석
- 청산 데이터 및 청산 구간 예측
- 거래소 입출금 흐름`,

  'vpa': `## VPA (Volume Price Analysis) 전문가
거래량과 가격의 관계를 분석합니다.
- 거래량 스파이크 구간 분석
- 매집/분산 구간 식별
- Effort vs Result 분석
- Smart Money 활동 징후
- 거래량 이상 징후 (Anomaly)`,

  'ict': `## ICT (Inner Circle Trader) 분석 전문가
유동성 기반 Price Action을 분석합니다.
- Liquidity Pool (유동성 풀) 위치
- FVG (Fair Value Gap) 식별
- Order Block 구간
- BOS (Break of Structure) / CHoCH (Change of Character)
- Premium/Discount Zone
- 예상 스마트머니 타겟`,

  'wyckoff': `## Wyckoff 방법론 전문가
매집/분산 사이클을 분석합니다.
- 현재 페이즈 판단 (Accumulation/Distribution/Markup/Markdown)
- 주요 이벤트 식별 (PS, SC, AR, ST, Spring, UTAD, etc.)
- Composite Operator 활동 추정
- 다음 예상 움직임
- 진입/청산 시점 제안`,
};

const ONCHAIN_SYSTEM_PROMPT = `You are "Alpha Agent", an expert crypto trading analyst with access to real-time market data.

## Core Analysis Framework
You provide 6 specialized analysis types:
1. **HTF→LTF 탑다운**: Multi-timeframe structure analysis
2. **Valuation**: Mcap, FDV, TVL-based valuation
3. **On-chain/Derivatives**: CVD, OI, Funding, Liquidations
4. **VPA**: Volume-Price relationship analysis
5. **ICT**: Liquidity zones and Price Action
6. **Wyckoff**: Accumulation/Distribution cycles

## Real-Time Data Sources
- **Binance**: Price, Volume, 24h changes
- **CoinGecko**: Mcap, FDV, ATH, Supply
- **Binance Futures**: OI, Funding Rate, Long/Short Ratio

## Response Guidelines
- Use the provided real-time data to give accurate analysis
- Provide actionable trading insights with specific levels
- Include risk warnings where appropriate
- Use Korean language primarily
- Format with bullet points and clear structure
- Mention specific price levels, percentages, and ratios
- Give clear buy/sell/hold recommendations when appropriate

## Output Structure
1. 📊 현재 시장 상황 요약
2. 🔍 요청된 분석 유형에 따른 상세 분석
3. 🎯 주요 레벨 및 관심 구간
4. ⚠️ 리스크 요인
5. 💡 액션 플랜 제안`;

const getSystemPrompt = (analysisType?: string): string => {
  let prompt = ONCHAIN_SYSTEM_PROMPT;
  
  if (analysisType && ANALYSIS_TYPE_PROMPTS[analysisType]) {
    prompt += `\n\n## Current Analysis Mode\n${ANALYSIS_TYPE_PROMPTS[analysisType]}`;
  }
  
  return prompt;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, analysisType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Optionally fetch user's trading profile for personalization
    let userContext = "";
    if (userId) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: profile } = await supabase
          .from("trading_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        
        if (profile) {
          userContext = `
## User Trading Profile:
- Experience: ${profile.experience_level || 'N/A'}
- Style: ${profile.trading_style || 'N/A'}
- Primary Assets: ${JSON.stringify(profile.primary_assets) || '[]'}
- Risk per Trade: ${profile.max_risk_per_trade}%
- On-chain Importance: ${profile.onchain_importance}
- Language: ${profile.language || 'korean'}
${profile.use_emojis ? '- Use emojis in responses' : '- Minimize emojis'}
- Response Length: ${profile.response_length || 'medium'}
`;
        }
      } catch (e) {
        console.log("Could not fetch user profile, using defaults");
      }
    }

    const systemPrompt = getSystemPrompt(analysisType) + userContext;


    console.log("Calling Lovable AI Gateway with streaming...");
    
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청 한도 초과. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "크레딧이 부족합니다. 워크스페이스에 크레딧을 추가해주세요." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI 서비스 오류가 발생했습니다." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("onchain-chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
