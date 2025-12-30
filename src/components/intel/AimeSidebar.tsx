import React, { useState, useRef, useEffect } from 'react';
import { InsightData } from '@/pages/Intel';
import { Send, Sparkles, Bot, User, Wallet, Coins, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface AimeSidebarProps {
  onUpdate: (data: InsightData) => void;
  hideHeader?: boolean;
}

const quickQuestions = [
  { label: "🐋 고래 지갑 추적", query: "현재 BTC, ETH 고래 지갑들의 움직임을 분석해줘. 최근 24시간 큰 거래 내역과 스마트머니 동향 알려줘." },
  { label: "📊 SOL 온체인", query: "솔라나 온체인 데이터 분석해줘. 활성 지갑 수, TPS, TVL 변화, 주요 DEX 거래량 추이를 알려줘." },
  { label: "💰 ETH 흐름", query: "이더리움 거래소 입출금 흐름 분석해줘. 스마트머니가 축적하는지 청산하는지 판단해줘." },
  { label: "🔥 DeFi TVL", query: "현재 주요 DeFi 프로토콜들의 TVL 순위와 변동을 분석하고, 자금 흐름에서 트렌드를 찾아줘." },
  { label: "⛽ Gas 트렌드", query: "이더리움과 L2들의 가스비 트렌드 분석하고, 네트워크 혼잡도 기준으로 최적 거래 시간대 추천해줘." },
  { label: "🎯 토큰 분석", query: "요즘 뜨는 알트코인 중 온체인 데이터가 좋은 종목 3개 추천하고, 홀더 분포와 거래량 분석해줘." },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/onchain-chat`;

const AimeSidebar = ({ onUpdate, hideHeader = false }: AimeSidebarProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 저는 온체인 분석 전문 AI입니다. 🔍\n\n다음과 같은 것들을 도와드릴 수 있어요:\n• 지갑 주소 분석 및 고래 추적\n• 토큰 홀더 분포 및 유동성 분석\n• 거래소 입출금 흐름\n• DeFi TVL 및 수익률 분석\n\n질문해주세요!',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadingQuestion, setLoadingQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const streamChat = async (userMessages: { role: string; content: string }[]) => {
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages,
        userId: user?.id 
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

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Prepare messages for API (exclude timestamps and ids)
      const apiMessages = [...messages, userMessage]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await streamChat(apiMessages);
      
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
    await handleSendMessage(query);
    setLoadingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header - hidden on mobile when used in bottom sheet */}
      {!hideHeader && (
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Alpha Agent</h3>
                <p className="text-[10px] text-muted-foreground">On-chain Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500">Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
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

      {/* Quick Questions - On-chain focused */}
      <div className="px-4 py-2 border-t border-border shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickQuestions.map((q) => (
            <button
              key={q.label}
              onClick={() => handleQuickQuestion(q.query, q.label)}
              disabled={isTyping || loadingQuestion !== null}
              className={`shrink-0 px-3 py-1.5 text-xs bg-muted/50 hover:bg-muted rounded-full transition-colors ${
                loadingQuestion === q.label ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="지갑 주소, 토큰, 온체인 데이터 질문..."
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all pr-12"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
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
