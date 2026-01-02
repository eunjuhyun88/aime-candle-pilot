import React, { useState, useRef, useEffect } from 'react';
import { InsightData } from '@/pages/Intel';
import { Send, Sparkles, Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import OnchainMetrics from './OnchainMetrics';
import AnalysisTypeSelector, { AnalysisType, analysisTypes } from './AnalysisTypeSelector';
import { useMarketData, formatPrice, formatLargeNumber, formatPercent } from '@/hooks/useMarketData';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface AimeSidebarProps {
  onUpdate: (data: InsightData) => void;
  onAnalysisResponse?: (response: string) => void;
  hideHeader?: boolean;
}

const quickQuestions = [
  { label: "🐋 고래", query: "현재 BTC, ETH 고래 지갑들의 움직임을 분석해줘." },
  { label: "📊 SOL", query: "솔라나 온체인 데이터 분석해줘." },
  { label: "💰 ETH", query: "이더리움 거래소 입출금 흐름 분석해줘." },
  { label: "🔥 DeFi", query: "주요 DeFi TVL 순위와 변동 분석해줘." },
  { label: "⛽ Gas", query: "가스비 트렌드와 최적 거래 시간대 추천해줘." },
  { label: "🎯 Hot", query: "온체인 데이터가 좋은 알트코인 추천해줘." },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/onchain-chat`;

const AimeSidebar = ({ onUpdate, onAnalysisResponse, hideHeader = false }: AimeSidebarProps) => {
  const { user } = useAuth();
  const { fetchMarketData, isLoading: isLoadingMarket } = useMarketData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 저는 Alpha Agent입니다. 🔍\n\n6가지 전문 분석을 제공합니다:\n• HTF→LTF 탑다운 분석\n• 코인 밸류에이션 (Mcap, FDV, TVL)\n• 온체인/파생상품 데이터\n• VPA 거래량 분석\n• ICT 유동성 분석\n• Wyckoff 사이클 분석\n\n분석 타입을 선택하고 코인 심볼을 입력해주세요!',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadingQuestion, setLoadingQuestion] = useState<string | null>(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType | null>(null);
  const [showAnalysisTypes, setShowAnalysisTypes] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const streamChat = async (userMessages: { role: string; content: string }[], analysisType?: AnalysisType) => {
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages,
        userId: user?.id,
        analysisType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        throw new Error("요청 한도 초과. 잠시 후 다시 시도해주세요.");
      }
      if (response.status === 402) {
        throw new Error("크레딧이 부족합니다.");
      }
      throw new Error(errorData.error || "AI 서비스 오류");
    }

    return response;
  };

  // Extract symbol from user message
  const extractSymbol = (text: string): string | null => {
    const upperText = text.toUpperCase();
    const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'DOGE', 'DOT', 'MATIC', 'LINK', 'ATOM', 'UNI', 'LTC', 'NEAR', 'APT', 'ARB', 'OP', 'SUI'];
    for (const sym of symbols) {
      if (upperText.includes(sym)) {
        return sym;
      }
    }
    // Try to match patterns like "BTCUSDT" or "$BTC"
    const match = upperText.match(/\$?([A-Z]{2,5})(?:USDT?)?/);
    return match ? match[1] : null;
  };

  const handleSendMessage = async (messageText: string, analysisTypeOverride?: AnalysisType) => {
    if (!messageText.trim() || isTyping) return;
    
    const activeAnalysisType = analysisTypeOverride || selectedAnalysisType;
    const symbol = extractSymbol(messageText);
    
    // Fetch market data if symbol is detected
    let marketDataContext = '';
    if (symbol && activeAnalysisType) {
      try {
        const marketData = await fetchMarketData(symbol);
        if (marketData?.data) {
          const { binance, coingecko, derivatives } = marketData.data;
          marketDataContext = `\n\n[실시간 시장 데이터 - ${symbol}]\n`;
          
          if (binance) {
            marketDataContext += `• 현재가: $${formatPrice(binance.price)} (${formatPercent(binance.priceChange24h)})\n`;
            marketDataContext += `• 24h 거래량: ${formatLargeNumber(binance.volume24h)}\n`;
            marketDataContext += `• 24h 고/저: $${formatPrice(binance.highPrice24h)} / $${formatPrice(binance.lowPrice24h)}\n`;
          }
          
          if (coingecko) {
            marketDataContext += `• 시가총액: ${formatLargeNumber(coingecko.marketCap)}\n`;
            marketDataContext += `• FDV: ${formatLargeNumber(coingecko.fdv)}\n`;
            marketDataContext += `• ATH: $${formatPrice(coingecko.ath)} (${formatPercent(coingecko.athChangePercentage)})\n`;
          }
          
          if (derivatives) {
            marketDataContext += `• OI: ${derivatives.openInterest.toLocaleString()} contracts\n`;
            marketDataContext += `• Funding Rate: ${derivatives.fundingRate.toFixed(4)}%\n`;
            marketDataContext += `• Long/Short Ratio: ${derivatives.longShortRatio.toFixed(2)}\n`;
          }
        }
      } catch (e) {
        console.log('Failed to fetch market data:', e);
      }
    }
    
    // Prepend analysis type context if selected
    let enrichedMessage = messageText;
    if (activeAnalysisType) {
      const analysisConfig = analysisTypes.find(t => t.id === activeAnalysisType);
      if (analysisConfig) {
        enrichedMessage = `[${analysisConfig.label} 분석 요청]\n${analysisConfig.prompt}\n\n사용자 질문: ${messageText}${marketDataContext}`;
      }
    } else if (marketDataContext) {
      enrichedMessage = messageText + marketDataContext;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText, // Display original message
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Prepare messages for API with enriched context
      const apiMessages = [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: enrichedMessage }];

      const response = await streamChat(apiMessages, activeAnalysisType);
      
      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      // Create assistant message placeholder
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch { /* ignore */ }
        }
      }

      // Send analysis response to chart overlay
      if (onAnalysisResponse && assistantContent) {
        onAnalysisResponse(assistantContent);
      }

      // Check for token analysis in response
      const lowerContent = assistantContent.toLowerCase();
      if (lowerContent.includes('sol') && (lowerContent.includes('분석') || lowerContent.includes('analysis'))) {
        onUpdate({
          type: 'token_analysis',
          token: 'Solana',
          symbol: 'SOL',
          price: 145.30,
          change: 5.2,
          trend: 'Bullish',
          description: assistantContent.substring(0, 200) + '...',
          stats: {
            tps: '2,845',
            active_wallets: '1.2M',
            tvl: '$1.8B',
          },
          chart_data: Array.from({ length: 14 }, (_, i) => ({
            date: `Day ${i + 1}`,
            price: 130 + Math.random() * 20 + (i * 1.5),
          })),
        });
      } else if (lowerContent.includes('eth') && (lowerContent.includes('분석') || lowerContent.includes('analysis'))) {
        onUpdate({
          type: 'token_analysis',
          token: 'Ethereum',
          symbol: 'ETH',
          price: 3200,
          change: 2.8,
          trend: 'Bullish',
          description: assistantContent.substring(0, 200) + '...',
          stats: {
            tps: '15',
            active_wallets: '850K',
            tvl: '$50B',
          },
          chart_data: Array.from({ length: 14 }, (_, i) => ({
            date: `Day ${i + 1}`,
            price: 3000 + Math.random() * 300 + (i * 15),
          })),
        });
      }

    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "채팅 오류가 발생했습니다.");
      
      // Remove the empty assistant message if error occurred
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant' && lastMsg.content === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = async (query: string, label: string) => {
    setLoadingQuestion(label);
    await handleSendMessage(query, undefined);
    setLoadingQuestion(null);
  };

  const handleAnalysisTypeClick = (type: AnalysisType) => {
    if (selectedAnalysisType === type) {
      setSelectedAnalysisType(null);
    } else {
      setSelectedAnalysisType(type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input, undefined);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header - hidden on mobile when used in bottom sheet */}
      {!hideHeader && (
        <div className="p-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Alpha Agent</h3>
                <p className="text-[10px] text-muted-foreground">On-chain AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500">Live</span>
            </div>
          </div>
        </div>
      )}

      {/* On-chain Metrics Dashboard */}
      {!hideHeader && <OnchainMetrics />}

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {message.role === 'assistant' ? (
                <div className="max-w-[90%] bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot size={10} className="text-primary" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
              ) : (
                <div className="max-w-[85%] bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <span className="text-[10px] opacity-70">{message.timestamp}</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <User size={10} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-border">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles size={10} className="text-primary animate-pulse" />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Analysis Type Selector */}
      <div className="px-3 py-2 border-t border-border shrink-0">
        <button
          onClick={() => setShowAnalysisTypes(!showAnalysisTypes)}
          className="flex items-center justify-between w-full text-xs text-muted-foreground mb-2"
        >
          <span className="font-medium">
            {selectedAnalysisType 
              ? `📊 ${analysisTypes.find(t => t.id === selectedAnalysisType)?.label}`
              : '분석 타입 선택'
            }
          </span>
          {showAnalysisTypes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        
        {showAnalysisTypes && (
          <AnalysisTypeSelector
            selectedType={selectedAnalysisType}
            onSelect={handleAnalysisTypeClick}
            disabled={isTyping}
            compact
          />
        )}
      </div>

      {/* Quick Questions - Grid layout */}
      <div className="px-3 py-2 border-t border-border shrink-0">
        <div className="grid grid-cols-3 gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q.label}
              onClick={() => handleQuickQuestion(q.query, q.label)}
              disabled={isTyping || loadingQuestion !== null}
              className={`px-2 py-1.5 text-[11px] bg-muted/50 hover:bg-muted rounded-lg transition-colors text-center ${
                loadingQuestion === q.label ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedAnalysisType 
              ? `${analysisTypes.find(t => t.id === selectedAnalysisType)?.shortLabel} 분석할 코인을 입력...`
              : "지갑 주소, 토큰, 온체인 데이터 질문..."
            }
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all pr-12"
            disabled={isTyping || isLoadingMarket}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || isLoadingMarket}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AimeSidebar;
