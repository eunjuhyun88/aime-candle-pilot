import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';
import { Zap, MessageSquare, Activity, MousePointer2, TrendingUp, Settings, Bell, Search, BarChart3, Wallet, Users, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Section navigation
  const [activeSection, setActiveSection] = useState(1); // 0: left, 1: center, 2: right
  
  // Chart states
  const [selectedPrice, setSelectedPrice] = useState(64250.50);
  const [aiAnalysis, setAiAnalysis] = useState("차트를 클릭하여 가격대를 선택하세요. AI가 해당 구간의 스마트머니 흐름을 분석합니다.");
  const [activeBottomTab, setActiveBottomTab] = useState<'activities' | 'vibes' | 'holders' | 'orders'>('activities');
  
  const [signals] = useState<Signal[]>([
    { id: '1', type: 'bullish', title: 'BTC Whale Absorption', confidence: 89, entry: '63,250', target: '65,800', stop: '62,100' },
    { id: '2', type: 'bearish', title: 'ETH Distribution Alert', confidence: 72, entry: '3,450', target: '3,180', stop: '3,520' },
  ]);

  const sections = ['Intel', 'Chart', 'Copilot'];

  // Scroll to section
  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: 'smooth'
      });
      setActiveSection(index);
    }
  };

  // Handle scroll event to update active section
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const sectionWidth = scrollContainerRef.current.offsetWidth;
      const newSection = Math.round(scrollLeft / sectionWidth);
      if (newSection !== activeSection) {
        setActiveSection(newSection);
      }
    }
  };

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current || activeSection !== 1) return;

    // Delay chart creation to ensure container is visible
    const timer = setTimeout(() => {
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

      chart.subscribeClick((param) => {
        if (param.point) {
          const price = candlestickSeries.coordinateToPrice(param.point.y);
          if (price) {
            setSelectedPrice(Number(price.toFixed(2)));
            setAiAnalysis(`$${price.toFixed(2)} 구간 분석 완료:\n\n• 스마트머니 매집 강도: 높음\n• 고래 지갑 유입: +1,240 BTC\n• 돌파 시 숏 스퀴즈 확률: 72%`);
          }
        }
      });

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [activeSection]);

  const bottomTabs = [
    { id: 'activities' as const, label: 'Activities', icon: Activity },
    { id: 'vibes' as const, label: 'Vibes', icon: MessageSquare },
    { id: 'holders' as const, label: 'Holders', icon: Users },
    { id: 'orders' as const, label: 'Orders', icon: BarChart3 },
  ];

  return (
    <div className="h-screen bg-background text-foreground font-sans overflow-hidden flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <TrendingUp size={16} className="text-primary-foreground" />
          </div>
          <h1 className="text-sm font-black text-gradient tracking-tight">STOCKHOO</h1>
        </div>
        
        {/* Section Tabs */}
        <div className="flex bg-muted rounded-lg p-1">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(index)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeSection === index 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell size={16} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings size={16} className="text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Navigation Arrows */}
      <button 
        onClick={() => scrollToSection(Math.max(0, activeSection - 1))}
        className={`fixed left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-card/80 backdrop-blur border border-border rounded-full flex items-center justify-center hover:bg-primary/20 transition-all ${activeSection === 0 ? 'opacity-30 pointer-events-none' : ''}`}
      >
        <ChevronLeft size={20} className="text-foreground" />
      </button>
      <button 
        onClick={() => scrollToSection(Math.min(2, activeSection + 1))}
        className={`fixed right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-card/80 backdrop-blur border border-border rounded-full flex items-center justify-center hover:bg-primary/20 transition-all ${activeSection === 2 ? 'opacity-30 pointer-events-none' : ''}`}
      >
        <ChevronRight size={20} className="text-foreground" />
      </button>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* SECTION 1: Intel Panel */}
        <section className="w-full h-full flex-shrink-0 snap-center overflow-y-auto bg-card border-r border-border">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Alpha Signals */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-signal-green" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Alpha Signals</h3>
              </div>

              <div className="space-y-4">
                {signals.map((signal) => (
                  <div 
                    key={signal.id}
                    className="terminal-card p-4 rounded-xl border border-primary/20 hover:border-primary/50 transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-bold ${signal.type === 'bullish' ? 'text-signal-green' : 'text-signal-red'}`}>
                        {signal.type === 'bullish' ? '▲ BULLISH' : '▼ BEARISH'}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{signal.confidence}%</span>
                    </div>
                    <h4 className="text-base font-bold mb-4">{signal.title}</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="text-muted-foreground mb-1">Entry</p>
                        <p className="font-mono font-bold">{signal.entry}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="text-muted-foreground mb-1">Target</p>
                        <p className="text-signal-green font-mono font-bold">{signal.target}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="text-muted-foreground mb-1">Stop</p>
                        <p className="text-signal-red font-mono font-bold">{signal.stop}</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold rounded-lg transition-all">
                      Apply Strategy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Pulse */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-primary" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Market Pulse</h3>
              </div>
              <div className="terminal-card p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fear & Greed</span>
                  <span className="text-lg font-bold text-signal-green">72</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-signal-red via-warning to-signal-green rounded-full" style={{ width: '72%' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">BTC Dom</span>
                    <span className="font-medium">54.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">OI Change</span>
                    <span className="text-signal-green font-medium">+3.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Chart Panel */}
        <section className="w-full h-full flex-shrink-0 snap-center flex flex-col bg-background">
          {/* Chart Header */}
          <div className="h-14 border-b border-border bg-card flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold">BTC/USDT</span>
              <span className="text-signal-green font-bold">${selectedPrice.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              {['15m', '1H', '4H', '1D'].map((tf, i) => (
                <button 
                  key={tf} 
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${i === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div ref={chartContainerRef} className="flex-1 bg-background min-h-0" />

          {/* Bottom Panel */}
          <div className="h-48 border-t border-border bg-card shrink-0 flex flex-col">
            <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
              {bottomTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBottomTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                      activeBottomTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
              {activeBottomTab === 'activities' && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-signal-green" />
                    <span className="text-signal-green font-bold">ACCUMULATION</span>
                    <span className="text-muted-foreground">2,500 BTC</span>
                    <span className="text-muted-foreground ml-auto">3m ago</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-signal-red" />
                    <span className="text-signal-red font-bold">DISTRIBUTION</span>
                    <span className="text-muted-foreground">850 BTC</span>
                    <span className="text-muted-foreground ml-auto">12m ago</span>
                  </div>
                </div>
              )}
              {activeBottomTab === 'vibes' && (
                <div className="grid grid-cols-3 gap-2">
                  {[{ source: 'Twitter', score: 78 }, { source: 'Reddit', score: 52 }, { source: 'Telegram', score: 85 }].map((item) => (
                    <div key={item.source} className="terminal-card p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">{item.source}</p>
                      <p className="text-xl font-bold text-signal-green">{item.score}</p>
                    </div>
                  ))}
                </div>
              )}
              {(activeBottomTab === 'holders' || activeBottomTab === 'orders') && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Data loading...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: AI Copilot Panel */}
        <section className="w-full h-full flex-shrink-0 snap-center flex flex-col bg-card border-l border-border">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageSquare size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Aime AI Copilot</h3>
                  <p className="text-xs text-muted-foreground">Real-time analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* AI Message */}
            <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border border-border text-sm leading-relaxed whitespace-pre-line">
              {aiAnalysis}
            </div>

            {/* Strategy Card */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-signal-green" />
                <span className="text-xs font-bold text-primary uppercase">Recommended Strategy</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground text-xs">Position</p>
                  <p className="text-signal-green font-bold">LONG</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Leverage</p>
                  <p className="font-bold">5x</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Entry</p>
                  <p className="font-mono">${selectedPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Risk/Reward</p>
                  <p className="text-signal-green font-bold">1:2.4</p>
                </div>
              </div>
              <button className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                <Wallet size={16} />
                Apply to Terminal
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about Smart Money..."
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors">
                <MousePointer2 size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section Indicators */}
      <div className="h-8 border-t border-border bg-card flex items-center justify-center gap-2 shrink-0">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSection === index ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StockHooTerminal;
