import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';
import { Zap, MessageSquare, Activity, MousePointer2, ChevronLeft, ChevronRight, Maximize2, Minimize2, TrendingUp, Settings, Bell, Search, BarChart3, Wallet, Users } from 'lucide-react';

interface Signal {
  id: string;
  type: 'bullish' | 'bearish';
  title: string;
  confidence: number;
  entry: string;
  target: string;
  stop: string;
}

const StockHooTerminal = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  // Panel visibility states
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomPanelExpanded, setBottomPanelExpanded] = useState(false);
  
  // Chart states
  const [selectedPrice, setSelectedPrice] = useState(64250.50);
  const [aiAnalysis, setAiAnalysis] = useState("차트를 클릭하여 가격대를 선택하세요. AI가 해당 구간의 스마트머니 흐름을 분석합니다.");
  const [activeBottomTab, setActiveBottomTab] = useState<'activities' | 'vibes' | 'holders' | 'orders'>('activities');
  
  const [signals] = useState<Signal[]>([
    { id: '1', type: 'bullish', title: 'BTC Whale Absorption', confidence: 89, entry: '63,250', target: '65,800', stop: '62,100' },
    { id: '2', type: 'bearish', title: 'ETH Distribution Alert', confidence: 72, entry: '3,450', target: '3,180', stop: '3,520' },
  ]);

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8B949E',
      },
      grid: {
        vertLines: { color: 'rgba(48, 54, 61, 0.5)' },
        horzLines: { color: 'rgba(48, 54, 61, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: { 
        borderVisible: false, 
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      crosshair: {
        vertLine: {
          color: 'rgba(168, 85, 247, 0.4)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: 'rgba(168, 85, 247, 0.4)',
          width: 1,
          style: 2,
        },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Generate mock data
    const generateMockData = () => {
      const data = [];
      let basePrice = 60000;
      const now = new Date();
      
      for (let i = 60; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const volatility = Math.random() * 2000 - 1000;
        const open = basePrice + volatility;
        const close = open + (Math.random() * 1500 - 750);
        const high = Math.max(open, close) + Math.random() * 500;
        const low = Math.min(open, close) - Math.random() * 500;
        
        data.push({ time: dateStr, open, high, low, close });
        basePrice = close;
      }
      return data;
    };

    candlestickSeries.setData(generateMockData());

    // Whale Zone price lines
    candlestickSeries.createPriceLine({
      price: 63500,
      color: 'rgba(168, 85, 247, 0.6)',
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: '🐋 Whale Zone',
    });

    candlestickSeries.createPriceLine({
      price: 65800,
      color: 'rgba(34, 197, 94, 0.6)',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Target',
    });

    candlestickSeries.createPriceLine({
      price: 61200,
      color: 'rgba(239, 68, 68, 0.6)',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Support',
    });

    // Chart click event
    chart.subscribeClick((param) => {
      if (param.point) {
        const price = candlestickSeries.coordinateToPrice(param.point.y);
        if (price) {
          setSelectedPrice(Number(price.toFixed(2)));
          setAiAnalysis(`$${price.toFixed(2)} 구간 분석 완료:\n\n• 스마트머니 매집 강도: 높음\n• 고래 지갑 유입: +1,240 BTC\n• 돌파 시 숏 스퀴즈 확률: 72%\n\n이 레벨에서 롱 포지션 진입을 권장합니다.`);
        }
      }
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial resize after panel transitions
    const resizeTimer = setTimeout(handleResize, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      chart.remove();
    };
  }, [leftPanelOpen, rightPanelOpen]);

  const bottomTabs = [
    { id: 'activities' as const, label: 'Whale Activities', icon: Activity },
    { id: 'vibes' as const, label: 'Social Vibes', icon: MessageSquare },
    { id: 'holders' as const, label: 'Holders', icon: Users },
    { id: 'orders' as const, label: 'Order Flow', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-primary/30">
      
      {/* LEFT PANEL: Intel Feed */}
      <aside className={`${leftPanelOpen ? 'w-72' : 'w-0'} transition-all duration-300 ease-in-out border-r border-border bg-card flex flex-col overflow-hidden`}>
        <div className="min-w-72">
          {/* Header */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse-glow">
                <TrendingUp size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gradient tracking-tight">STOCKHOO</h1>
                <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Intelligence OS v3.0</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full bg-muted border border-border rounded-lg pl-8 pr-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Alpha Signals */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={12} className="text-signal-green" />
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alpha Signals</h3>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-3">
              {signals.map((signal) => (
                <div 
                  key={signal.id}
                  className="terminal-card p-4 rounded-xl border border-primary/20 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-bold ${signal.type === 'bullish' ? 'text-signal-green' : 'text-signal-red'}`}>
                      {signal.type === 'bullish' ? '▲ BULLISH' : '▼ BEARISH'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{signal.confidence}% CONF</span>
                  </div>
                  <h4 className="text-sm font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{signal.title}</h4>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground mb-1">ENTRY</p>
                      <p className="text-foreground font-mono font-bold">{signal.entry}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground mb-1">TARGET</p>
                      <p className="text-signal-green font-mono font-bold">{signal.target}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground mb-1">STOP</p>
                      <p className="text-signal-red font-mono font-bold">{signal.stop}</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold rounded-lg transition-all">
                    Apply Strategy
                  </button>
                </div>
              ))}
            </div>

            {/* Market Stats */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={12} className="text-primary" />
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Market Pulse</h3>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="terminal-card p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">Fear & Greed</span>
                  <span className="text-xs font-bold text-signal-green">72 (Greed)</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-signal-red via-warning to-signal-green rounded-full transition-all" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">T</span>
                </div>
                <div>
                  <p className="text-xs font-medium">Trader</p>
                  <p className="text-[9px] text-muted-foreground">Pro Plan</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                  <Bell size={14} className="text-muted-foreground" />
                </button>
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                  <Settings size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* LEFT TOGGLE */}
      <button 
        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-5 h-12 bg-card border border-border rounded-r-lg flex items-center justify-center hover:bg-muted transition-colors group"
        style={{ left: leftPanelOpen ? '18rem' : 0 }}
      >
        {leftPanelOpen ? <ChevronLeft size={14} className="text-muted-foreground group-hover:text-foreground" /> : <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground" />}
      </button>

      {/* CENTER: Chart Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">BTC/USDT</span>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-signal-green" />
                <span className="text-signal-green font-bold text-sm">${selectedPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex bg-muted rounded-lg p-1 gap-1">
              {['15m', '1H', '4H', '1D'].map((tf, i) => (
                <button 
                  key={tf} 
                  className={`px-3 py-1 text-[10px] font-medium rounded transition-colors ${i === 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1">
              🐋 Whale Heat
            </button>
            <button className="px-3 py-1.5 text-[10px] font-bold bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all">
              GEX Levels
            </button>
          </div>
        </header>

        {/* Chart */}
        <div ref={chartContainerRef} className="flex-1 bg-background" />

        {/* BOTTOM PANEL */}
        <div className={`${bottomPanelExpanded ? 'h-80' : 'h-48'} transition-all duration-300 border-t border-border bg-card shrink-0`}>
          {/* Bottom Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <div className="flex gap-1">
              {bottomTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBottomTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                      activeBottomTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setBottomPanelExpanded(!bottomPanelExpanded)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
            >
              {bottomPanelExpanded ? <Minimize2 size={14} className="text-muted-foreground" /> : <Maximize2 size={14} className="text-muted-foreground" />}
            </button>
          </div>

          {/* Bottom Content */}
          <div className="p-4 overflow-y-auto h-[calc(100%-40px)] scrollbar-thin">
            {activeBottomTab === 'activities' && (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-signal-green/20">
                  <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                  <span className="text-signal-green font-bold">ACCUMULATION</span>
                  <span className="text-muted-foreground">2,500 BTC</span>
                  <span className="text-muted-foreground ml-auto">Binance → Cold Wallet</span>
                  <span className="text-muted-foreground">3m ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-signal-red/20">
                  <div className="w-2 h-2 rounded-full bg-signal-red" />
                  <span className="text-signal-red font-bold">DISTRIBUTION</span>
                  <span className="text-muted-foreground">850 BTC</span>
                  <span className="text-muted-foreground ml-auto">Cold → Coinbase</span>
                  <span className="text-muted-foreground">12m ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-primary font-bold">TRANSFER</span>
                  <span className="text-muted-foreground">1,200 BTC</span>
                  <span className="text-muted-foreground ml-auto">Internal</span>
                  <span className="text-muted-foreground">18m ago</span>
                </div>
              </div>
            )}
            {activeBottomTab === 'vibes' && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { source: 'Twitter/X', sentiment: 'Bullish', score: 78, change: '+12%' },
                  { source: 'Reddit', sentiment: 'Neutral', score: 52, change: '-3%' },
                  { source: 'Telegram', sentiment: 'Bullish', score: 85, change: '+8%' },
                ].map((item, i) => (
                  <div key={i} className="terminal-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${item.sentiment === 'Bullish' ? 'bg-signal-green' : item.sentiment === 'Bearish' ? 'bg-signal-red' : 'bg-warning'}`} />
                      <span className="text-xs font-medium">{item.source}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className={`text-lg font-bold ${item.sentiment === 'Bullish' ? 'text-signal-green' : 'text-warning'}`}>{item.score}</span>
                      <span className={`text-[10px] ${item.change.startsWith('+') ? 'text-signal-green' : 'text-signal-red'}`}>{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeBottomTab === 'holders' && (
              <div className="text-center text-muted-foreground text-xs py-8">
                Holder distribution data loading...
              </div>
            )}
            {activeBottomTab === 'orders' && (
              <div className="text-center text-muted-foreground text-xs py-8">
                Order flow data syncing...
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT TOGGLE */}
      <button 
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-5 h-12 bg-card border border-border rounded-l-lg flex items-center justify-center hover:bg-muted transition-colors group"
        style={{ right: rightPanelOpen ? '20rem' : 0 }}
      >
        {rightPanelOpen ? <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground" /> : <ChevronLeft size={14} className="text-muted-foreground group-hover:text-foreground" />}
      </button>

      {/* RIGHT PANEL: AI Copilot */}
      <aside className={`${rightPanelOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out border-l border-border bg-card flex flex-col overflow-hidden`}>
        <div className="min-w-80">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageSquare size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-tight">Aime AI Copilot</h3>
                  <p className="text-[9px] text-muted-foreground">Real-time analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                <span className="text-[9px] text-muted-foreground">Active</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="space-y-4">
              {/* AI Message */}
              <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border border-border text-xs leading-relaxed whitespace-pre-line">
                {aiAnalysis}
              </div>

              {/* Strategy Card */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-signal-green" />
                  <span className="text-[10px] font-bold text-primary uppercase">Recommended Strategy</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                  <div>
                    <p className="text-muted-foreground">Position</p>
                    <p className="text-signal-green font-bold">LONG</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Leverage</p>
                    <p className="text-foreground font-bold">5x</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entry</p>
                    <p className="text-foreground font-mono">${selectedPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk/Reward</p>
                    <p className="text-signal-green font-bold">1:2.4</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                  <Wallet size={14} />
                  Apply to Terminal
                </button>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask about Smart Money..."
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
              />
              <button className="absolute right-3 top-2.5 p-1 text-muted-foreground group-hover:text-primary transition-colors">
                <MousePointer2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StockHooTerminal;
