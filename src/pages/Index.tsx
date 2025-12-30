import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Zap, MessageSquare, Activity, TrendingUp, Send, Newspaper } from 'lucide-react';

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

const StockHooTerminal = () => {
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

    // 기존 위젯 제거
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

  return (
    <div className="h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      {/* Header with Navigation */}
      <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <TrendingUp size={16} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight">STOCKHOO</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <nav className="flex items-center gap-1">
            <span className="px-3 py-1.5 text-xs font-medium text-foreground bg-primary/10 rounded">
              Trading
            </span>
            <Link 
              to="/intel" 
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors flex items-center gap-1.5"
            >
              <Newspaper size={12} />
              Intel
            </Link>
          </nav>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-bold">BTC/USDT</span>
            <span className="text-green-500 font-bold">$64,250.50</span>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">+2.4%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </header>

      {/* Resizable 3-Panel Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* LEFT: Intelligence Feed */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-signal-green" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Alpha Signals</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Signal Cards */}
              {[
                { type: 'bullish', title: 'Whale Accumulation', conf: 89, entry: '63,250', target: '65,800' },
                { type: 'bullish', title: 'GEX Flip Positive', conf: 76, entry: '63,500', target: '66,000' },
              ].map((signal, i) => (
                <div 
                  key={i}
                  className="terminal-card p-3 rounded-lg border border-primary/20 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => syncAllPanels(parseFloat(signal.entry.replace(',', '')), 'now')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-signal-green">▲ BULLISH</span>
                    <span className="text-[10px] text-muted-foreground">{signal.conf}%</span>
                  </div>
                  <h4 className="text-sm font-bold mb-2">{signal.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-muted/30 rounded p-1.5 text-center">
                      <p className="text-muted-foreground">Entry</p>
                      <p className="font-mono font-bold">{signal.entry}</p>
                    </div>
                    <div className="bg-signal-green/10 rounded p-1.5 text-center">
                      <p className="text-signal-green">Target</p>
                      <p className="font-mono font-bold text-signal-green">{signal.target}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Context Sync Indicator */}
              {activeContext && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                  <p className="text-[10px] text-primary font-bold mb-1">SYNCED CONTEXT</p>
                  <p className="text-xs font-mono">${activeContext.price.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{activeContext.whaleFlow}</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* CENTER: Chart */}
        <ResizablePanel defaultSize={55} minSize={40}>
          <ResizablePanelGroup direction="vertical">
            {/* Chart Area */}
            <ResizablePanel defaultSize={70} minSize={50}>
              <div className="h-full bg-[#0B0E11] relative flex flex-col">
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
                
                {/* TradingView Widget Container */}
                <div 
                  id="tradingview_chart" 
                  ref={chartContainerRef} 
                  className="flex-1 w-full"
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Bottom: Context Dashboard */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={45}>
              <div className="h-full bg-card border-t border-border flex flex-col">
                <div className="flex items-center gap-4 px-4 py-2 border-b border-border">
                  {['Activities', 'Vibes', 'News'].map((tab, i) => (
                    <button
                      key={tab}
                      className={`text-xs font-medium transition-colors ${
                        i === 0 ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  {activeContext && (
                    <span className="ml-auto text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Synced: ${activeContext.price.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
                  {activeContext ? (
                    <>
                      <div className="flex items-center gap-2 text-signal-green">
                        <Activity size={12} />
                        <span>[WHALE] {activeContext.whaleFlow} @ ${activeContext.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <Zap size={12} />
                        <span>[SENTIMENT] {activeContext.sentiment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare size={12} />
                        <span>[NEWS] {activeContext.news}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">
                      차트에서 캔들을 선택하면 해당 시점의 온체인/소셜/뉴스 데이터가 표시됩니다.
                    </p>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT: AI Copilot */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="h-full bg-card border-l border-border flex flex-col">
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
                <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI Response */}
              <div className="bg-muted/30 p-4 rounded-2xl rounded-tl-none border border-border text-sm leading-relaxed whitespace-pre-line">
                {aiMessage}
              </div>

              {/* Strategy Card when context is active */}
              {activeContext && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-signal-green" />
                    <span className="text-xs font-bold text-primary uppercase">AI 추천 전략</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div className="bg-muted/30 rounded-lg p-2">
                      <p className="text-muted-foreground text-[10px]">Entry</p>
                      <p className="font-mono font-bold">${activeContext.price.toLocaleString()}</p>
                    </div>
                    <div className="bg-signal-green/10 rounded-lg p-2">
                      <p className="text-signal-green text-[10px]">Target</p>
                      <p className="font-mono font-bold text-signal-green">$65,800</p>
                    </div>
                    <div className="bg-signal-red/10 rounded-lg p-2">
                      <p className="text-signal-red text-[10px]">Stop</p>
                      <p className="font-mono font-bold text-signal-red">$62,000</p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-lg transition-all">
                    전략 적용하기
                  </button>
                </div>
              )}
            </div>

            {/* Chat Input */}
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StockHooTerminal;
