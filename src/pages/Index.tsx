import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageSquare, Activity, TrendingUp, Send, Zap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface ContextData {
  price: number;
  time: string;
  whaleFlow: string;
  sentiment: string;
  news: string;
}

const TradingTerminal = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  
  // Candle-Centric Context State
  const [activeContext, setActiveContext] = useState<ContextData | null>(null);
  const [aiMessage, setAiMessage] = useState("차트에서 궁금한 캔들을 클릭하거나 드로잉을 하면, 해당 시점의 스마트머니 흐름을 즉시 분석해 드립니다.");
  const [inputValue, setInputValue] = useState("");

  // Candle-Snap Intelligence: 클릭 시 전체 패널 동기화
  const syncAllPanels = useCallback((price: number, time: string) => {
    const contextData: ContextData = {
      price,
      time,
      whaleFlow: `+${(Math.random() * 2000 + 500).toFixed(0)} BTC 유입`,
      sentiment: Math.random() > 0.5 ? 'Bullish 72%' : 'Neutral 54%',
      news: '"BTC 기관 매수세 유입" - Bloomberg',
    };
    
    setActiveContext(contextData);
    setAiMessage(`$${price.toLocaleString()} 구간 분석 완료:\n\n• 고래 지갑 동향: ${contextData.whaleFlow}\n• 소셜 센티먼트: ${contextData.sentiment}\n• 관련 뉴스: ${contextData.news}\n\n이 레벨은 스마트머니의 방어 구간입니다. 롱 포지션 진입 시 손익비 1:2.4로 유리합니다.`);
  }, []);

  // TradingView Widget 로드
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: container.id,
          autosize: true,
          symbol: selectedSymbol,
          interval: '60',
          timezone: 'Asia/Seoul',
          theme: 'dark',
          style: '1',
          locale: 'ko',
          toolbar_bg: '#161B22',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          withdateranges: true,
          details: true,
          hotlist: true,
          calendar: true,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies', 'Volume@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          backgroundColor: '#0B0E11',
          gridColor: '#161B22',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedSymbol]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setAiMessage(`질문: "${inputValue}"\n\n현재 시장 상황을 분석한 결과, BTC는 $63,500 지지선 위에서 강세를 유지하고 있습니다. 스마트머니 유입이 지속되고 있어 상승 가능성이 높습니다.`);
    setInputValue("");
  };

  const AiPanel = (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <MessageSquare size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Aime Copilot</h3>
              <p className="text-[10px] text-muted-foreground">Context-Aware AI</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-muted/30 p-4 rounded-2xl rounded-tl-none border border-border text-sm leading-relaxed whitespace-pre-line">
          {aiMessage}
        </div>

        {activeContext && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs font-bold text-primary uppercase">AI 추천 전략</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div className="bg-muted/30 rounded-lg p-2">
                <p className="text-muted-foreground text-[10px]">Entry</p>
                <p className="font-mono font-bold">${activeContext.price.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-2">
                <p className="text-green-500 text-[10px]">Target</p>
                <p className="font-mono font-bold text-green-500">$65,800</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-2">
                <p className="text-red-500 text-[10px]">Stop</p>
                <p className="font-mono font-bold text-red-500">$62,000</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-lg transition-all">
              전략 적용하기
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="차트에 대해 질문하세요..."
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all pr-12"
          />
          <button 
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout showAiPanel aiPanel={AiPanel}>
      <div className="h-full flex flex-col">
        {/* Chart Toolbar */}
        <div className="h-10 border-b border-border bg-card/50 flex items-center px-3 gap-2 shrink-0">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-muted/50 border border-border text-xs font-bold rounded px-2 py-1 outline-none focus:border-primary"
          >
            <option value="BINANCE:BTCUSDT">BTC/USDT</option>
            <option value="BINANCE:ETHUSDT">ETH/USDT</option>
            <option value="BINANCE:SOLUSDT">SOL/USDT</option>
            <option value="NASDAQ:AAPL">AAPL</option>
            <option value="NASDAQ:TSLA">TSLA</option>
          </select>
          <div className="h-4 w-px bg-border" />
          <div className="flex gap-1">
            {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
              <button
                key={tf}
                className="px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button 
              onClick={() => syncAllPanels(64250, new Date().toLocaleTimeString())}
              className="px-3 py-1 text-[10px] font-bold bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors"
            >
              🐋 Whale Heat
            </button>
          </div>
        </div>
        
        {/* Chart - Takes all remaining space */}
        <div 
          id="tradingview_chart" 
          ref={chartContainerRef} 
          className="flex-1 min-h-0 w-full bg-[#0B0E11]"
        />

        {/* Bottom Context Bar - Compact */}
        {activeContext && (
          <div className="h-10 border-t border-border bg-card/50 flex items-center px-4 gap-6 text-xs shrink-0">
            <div className="flex items-center gap-2 text-green-500">
              <Activity size={12} />
              <span className="font-mono">{activeContext.whaleFlow}</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Zap size={12} />
              <span>{activeContext.sentiment}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare size={12} />
              <span className="truncate max-w-xs">{activeContext.news}</span>
            </div>
            <span className="ml-auto text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
              Synced: ${activeContext.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TradingTerminal;
