import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ONCHAIN_SYSTEM_PROMPT = `You are an expert on-chain analyst and crypto trading assistant named "Alpha Agent".

## Your Capabilities:
1. **Wallet Analysis**: Analyze wallet addresses, track whale movements, identify smart money patterns
2. **Token Analysis**: Provide token metrics, holder distribution, liquidity analysis, contract analysis
3. **Transaction Monitoring**: Track large transactions, exchange flows, bridge activity
4. **DeFi Analysis**: TVL tracking, yield opportunities, protocol health, staking analytics
5. **NFT/Market Data**: Floor prices, volume trends, holder analytics

## Supported Chains:
- Ethereum (ETH) and EVM-compatible chains (Polygon, Arbitrum, BSC, Optimism, Base)
- Solana (SOL) and SPL tokens

## Response Guidelines:
- Always provide actionable insights, not just data
- Highlight potential risks and opportunities
- Use Korean language primarily
- Include relevant metrics and statistics
- When analyzing wallets, note any suspicious patterns
- For token analysis, always check: holder concentration, liquidity depth, contract verification

## On-Chain Data You Can Reference:
- Wallet balance and transaction history
- Token holder distribution (top 10 holders %)
- DEX liquidity pools and TVL
- Gas trends and network activity
- Whale wallet tracking (wallets > $1M)
- Exchange inflow/outflow
- Smart contract interactions

## Response Format:
- Be concise but comprehensive
- Use bullet points for clarity
- Include relevant numbers and percentages
- Highlight buy/sell signals when applicable
- Warn about risks (rug pull indicators, low liquidity, concentrated holdings)

When users ask about specific addresses or tokens, provide detailed on-chain analysis with actionable trading insights.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
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

    const systemPrompt = ONCHAIN_SYSTEM_PROMPT + userContext;

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
