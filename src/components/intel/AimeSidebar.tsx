import React, { useState, useRef, useEffect } from 'react';
import { InsightData } from '@/pages/Intel';
import { Send, Sparkles, Bot, User, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface AimeSidebarProps {
  onUpdate: (data: InsightData) => void;
}

const quickQuestions = [
  "Undervalued L2 tokens?",
  "Solana whale accumulation?",
  "BTC next resistance?",
  "Top trending narratives?",
  "ETH breakout likelihood?",
  "Best DeFi plays?",
];

const AimeSidebar = ({ onUpdate }: AimeSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 시장에 대해 무엇이든 물어보세요. 토큰 분석, 트렌드 예측, 투자 전략 등을 도와드릴 수 있습니다.',
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

  const generateResponse = (query: string): { content: string; insightData?: InsightData } => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('sol') || lowerQuery.includes('솔라나')) {
      return {
        content: 'Solana(SOL)을 분석하고 있습니다...\n\n현재 SOL은 강한 상승 모멘텀을 보이고 있으며, 생태계 성장에 의해 추진되고 있습니다.',
        insightData: {
          type: 'token_analysis',
          token: 'Solana',
          symbol: 'SOL',
          price: 145.30,
          change: 5.2,
          trend: 'Bullish',
          description: 'SOL is experiencing strong bullish momentum driven by ecosystem growth. Recent developments in DePIN and gaming sectors are attracting significant developer activity.',
          stats: {
            tps: '2,845',
            active_wallets: '1.2M',
            tvl: '$1.8B',
          },
          chart_data: Array.from({ length: 14 }, (_, i) => ({
            date: `Day ${i + 1}`,
            price: 130 + Math.random() * 20 + (i * 1.5),
          })),
        },
      };
    }
    
    if (lowerQuery.includes('eth') || lowerQuery.includes('이더리움')) {
      return {
        content: '이더리움(ETH)을 분석하고 있습니다...\n\n현재 ETH는 안정적인 축적 단계에 있으며, Dencun 업그레이드가 임박해 있습니다.',
        insightData: {
          type: 'token_analysis',
          token: 'Ethereum',
          symbol: 'ETH',
          price: 3200,
          change: 2.8,
          trend: 'Bullish',
          description: 'ETH is showing strong momentum with the upcoming Dencun upgrade. Layer 2 activity is increasing, and staking yields remain attractive.',
          stats: {
            tps: '15',
            active_wallets: '850K',
            tvl: '$50B',
          },
          chart_data: Array.from({ length: 14 }, (_, i) => ({
            date: `Day ${i + 1}`,
            price: 3000 + Math.random() * 300 + (i * 15),
          })),
        },
      };
    }
    
    if (lowerQuery.includes('btc') || lowerQuery.includes('비트코인') || lowerQuery.includes('resistance')) {
      return {
        content: 'BTC의 다음 주요 저항선은 $68,500입니다.\n\n현재 가격 구간에서 스마트머니 축적이 관찰되고 있으며, $64,200 피벗 레벨을 돌파하면 상승 가속화가 예상됩니다.',
      };
    }
    
    if (lowerQuery.includes('whale') || lowerQuery.includes('고래')) {
      return {
        content: '현재 고래 활동 분석 결과:\n\n• BTC: 대형 지갑 축적 진행 중 (+2,400 BTC 24h)\n• ETH: 거래소 잔액 감소 (축적 신호)\n• SOL: 중립적 흐름\n\n스마트머니는 현재 조정 구간에서 매수 포지션을 구축하고 있습니다.',
      };
    }
    
    if (lowerQuery.includes('narrative') || lowerQuery.includes('trend')) {
      return {
        content: '현재 주목해야 할 주요 내러티브:\n\n1. 🤖 AI + Crypto (TAO, RNDR, FET)\n2. 🏛️ RWA 토큰화 (ONDO, MAPLE)\n3. 🌐 DePIN (HNT, MOBILE)\n4. 🎮 GameFi 재부상 (IMX, BEAM)\n\nAI 섹터가 가장 강한 모멘텀을 보이고 있습니다.',
      };
    }
    
    if (lowerQuery.includes('defi')) {
      return {
        content: '현재 추천 DeFi 플레이:\n\n1. AAVE - 대출 프로토콜 리더, TVL 상승 중\n2. GMX - 퍼페추얼 DEX, 수수료 수익 안정적\n3. PENDLE - 수익률 토큰화, 혁신적 모델\n\n리스크 관리를 위해 포트폴리오 분산을 권장합니다.',
      };
    }
    
    if (lowerQuery.includes('l2') || lowerQuery.includes('undervalued')) {
      return {
        content: '저평가된 L2 토큰 분석:\n\n1. MANTA - 프라이버시 L2, TVL 빠르게 성장\n2. BLAST - 네이티브 수익률 제공\n3. SCROLL - zkEVM 기술 선도\n\n이들 프로젝트는 기술력 대비 시가총액이 낮아 성장 잠재력이 있습니다.',
      };
    }
    
    return {
      content: '현재 시장 상황을 분석한 결과, BTC는 $63,500 지지선 위에서 강세를 유지하고 있습니다. 스마트머니 유입이 지속되고 있어 상승 가능성이 높습니다.\n\n더 구체적인 분석이 필요하시면 특정 토큰이나 주제에 대해 질문해 주세요!',
    };
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const response = generateResponse(messageText);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
    
    if (response.insightData) {
      onUpdate(response.insightData);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setLoadingQuestion(question);
    await handleSendMessage(question);
    setLoadingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Alpha Agent</h3>
              <p className="text-[10px] text-muted-foreground">AI Research Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
      </div>

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
          
          {isTyping && (
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

      {/* Quick Questions */}
      <div className="px-4 py-2 border-t border-border shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => handleQuickQuestion(question)}
              disabled={loadingQuestion !== null}
              className={`shrink-0 px-3 py-1.5 text-xs bg-muted/50 hover:bg-muted rounded-full transition-colors ${
                loadingQuestion === question ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              {question}
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
            placeholder="Ask about tokens, trends, strategies..."
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all pr-12"
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
