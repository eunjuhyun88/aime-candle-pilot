import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';
import { 
  Zap, MessageSquare, Activity, MousePointer2, TrendingUp, Settings, Bell, Search, 
  BarChart3, Wallet, Users, ChevronDown, Flame, MessageCircle, Newspaper, Info,
  LineChart, Target, Layers, Play, Sliders
} from 'lucide-react';

const StockHooTerminal = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  const [activeNav, setActiveNav] = useState('TRADE');
  const [activeBottomTab, setActiveBottomTab] = useState('positions');
  const [activeRightTab, setActiveRightTab] = useState('LIVE PILOT');
  const [selectedPrice] = useState(87502.85);

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8B949E',
      },
      grid: {
        vertLines: { color: 'rgba(48, 54, 61, 0.3)' },
        horzLines: { color: 'rgba(48, 54, 61, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      rightPriceScale: { borderVisible: false },
      crosshair: {
        vertLine: { color: 'rgba(34, 197, 94, 0.4)', width: 1, style: 2 },
        horzLine: { color: 'rgba(34, 197, 94, 0.4)', width: 1, style: 2 },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const generateMockData = () => {
      const data = [];
      let basePrice = 85000;
      const now = new Date();
      for (let i = 100; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(date.getHours() - i);
        const dateStr = Math.floor(date.getTime() / 1000);
        const volatility = Math.random() * 800 - 400;
        const open = basePrice + volatility;
        const close = open + (Math.random() * 600 - 300);
        const high = Math.max(open, close) + Math.random() * 200;
        const low = Math.min(open, close) - Math.random() * 200;
        data.push({ time: dateStr, open, high, low, close });
        basePrice = close;
      }
      return data;
    };

    candlestickSeries.setData(generateMockData());
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
  }, []);

  const navItems = ['DASHBOARD', 'TRADE', 'INTEL', 'HOLDINGS', 'SOCIAL', 'PAPER'];
  const timeframes = ['1s', '1m', '5m', '15m', '1H', '4H', '1D', '1W'];
  const indicators = ['MA', 'EMA', 'BB', 'RSI', 'MACD', 'STOCH', 'VOL'];
  const bottomTabs = [
    { id: 'positions', label: 'Positions', icon: Wallet },
    { id: 'vibes', label: 'Vibes', icon: Zap },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'holders', label: 'Holders', icon: Users },
    { id: 'tokeninfo', label: 'Token Info', icon: Info },
  ];

  const assetTickers = [
    { symbol: 'HOT', status: 'hot', price: '$94,000 - $96,000', count: 11, color: 'text-signal-red' },
    { symbol: 'BTC', status: 'WARM', price: '$100,000 - $102,000', count: 6, color: 'text-warning' },
    { symbol: 'BTC', status: 'ACTIVE', price: '$95,550 - $99,450', count: 3, color: 'text-signal-green' },
    { symbol: 'SOL', status: 'COOL', price: '$123.28 - $123.34', count: null, color: 'text-signal-blue' },
  ];

  return (
    <div className="h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      {/* TOP NAVIGATION */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-signal-green to-signal-green/60 flex items-center justify-center">
              <TrendingUp size={16} className="text-background" />
            </div>
            <span className="text-lg font-black tracking-tight">STOCKHOO</span>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeNav === item
                    ? 'bg-signal-green text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pair or contract"
              className="w-64 bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-signal-green/50"
            />
          </div>
          <button className="p-2 hover:bg-muted rounded-lg"><Bell size={18} className="text-muted-foreground" /></button>
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-signal-green" />
            <span className="text-sm font-mono">0xab0d...5542</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Chart Tools Sidebar */}
        <aside className="w-10 border-r border-border bg-card flex flex-col items-center py-2 gap-1 shrink-0">
          {[LineChart, Target, Layers, TrendingUp, BarChart3, Settings].map((Icon, i) => (
            <button key={i} className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Icon size={16} />
            </button>
          ))}
        </aside>

        {/* CENTER: Main Chart Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Price Header */}
          <div className="h-12 border-b border-border bg-card/50 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-warning flex items-center justify-center text-xs font-bold text-background">₿</div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">BTC</span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Bitcoin</span>
              </div>
              <span className="text-xl font-bold text-signal-green">${selectedPrice.toLocaleString()}</span>
              <div className="flex items-center gap-1 bg-signal-green/10 text-signal-green px-2 py-1 rounded text-xs font-medium">
                <TrendingUp size={12} />
                Bullish 68%
              </div>
              <span className="text-xs text-muted-foreground">RR 1.7:1</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-signal-green rounded-full" style={{ width: '62%' }} />
              </div>
              <span className="text-xs text-muted-foreground">62%</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 bg-signal-green text-background text-sm font-bold rounded-lg hover:bg-signal-green/90">Buy</button>
              <button className="px-4 py-1.5 bg-signal-red text-background text-sm font-bold rounded-lg hover:bg-signal-red/90">Sell</button>
            </div>
          </div>

          {/* Chart Toolbar */}
          <div className="h-10 border-b border-border bg-card/30 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
              {/* Timeframes */}
              <div className="flex items-center bg-muted/30 rounded p-0.5">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      tf === '1H' ? 'bg-signal-green text-background' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-border" />
              {/* Indicators */}
              <div className="flex items-center gap-1">
                {indicators.map((ind) => (
                  <button
                    key={ind}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      ['EMA', 'BB', 'VOL'].includes(ind) 
                        ? 'bg-signal-blue/20 text-signal-blue' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded">
                <Layers size={12} /> Price Levels
              </button>
              <button className="px-2 py-1 bg-signal-green/10 text-signal-green rounded flex items-center gap-1">
                <Target size={12} /> Markers
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div ref={chartContainerRef} className="flex-1 bg-background min-h-0" />

          {/* Asset Ticker Bar */}
          <div className="h-8 border-t border-border bg-card/50 flex items-center px-4 gap-6 shrink-0 overflow-x-auto">
            {assetTickers.map((ticker, i) => (
              <div key={i} className="flex items-center gap-2 text-xs whitespace-nowrap">
                <Flame size={12} className={ticker.color} />
                <span className="font-bold">{ticker.symbol}</span>
                <span className={`${ticker.color} font-medium`}>{ticker.status}</span>
                <span className="text-muted-foreground">{ticker.price}</span>
                {ticker.count && <span className="text-muted-foreground">○ {ticker.count}</span>}
              </div>
            ))}
          </div>

          {/* Bottom Panel */}
          <div className="h-48 border-t border-border bg-card flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto">
              {bottomTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBottomTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                      activeBottomTab === tab.id
                        ? 'bg-signal-green/10 text-signal-green'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 flex min-h-0">
              {/* Active Zones */}
              <div className="w-48 border-r border-border p-3 shrink-0">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Active Zones</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-signal-red">▼ SUP</span>
                    <span className="text-warning">❄ WARM</span>
                  </div>
                  <div className="font-mono text-sm">$94,000 - $96,000</div>
                  <div className="text-muted-foreground">○ 11</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-signal-green">▲ RES</span>
                    <span className="text-warning">❄ WARM</span>
                  </div>
                </div>
              </div>

              {/* Comments Area */}
              <div className="flex-1 p-3 flex flex-col">
                <div className="flex-1 overflow-y-auto text-sm text-muted-foreground">
                  {/* Comment content placeholder */}
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Share your thoughts on BTC..."
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-signal-green/50 pr-10"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-signal-green hover:bg-signal-green/10 rounded">
                    <MousePointer2 size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Posting as 0xab0d...5542</p>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: AI Copilot Sidebar */}
        <aside className="w-80 border-l border-border bg-card flex flex-col shrink-0">
          {/* Right Nav */}
          <div className="h-10 border-b border-border flex items-center justify-center gap-4 shrink-0">
            {['Chat', 'Backtest', 'Bots', 'Feed', 'Alerts'].map((tab) => (
              <button
                key={tab}
                className={`text-xs font-medium transition-colors ${
                  tab === 'Chat' ? 'text-signal-green' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'Chat' && <MessageSquare size={12} className="inline mr-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* DEFI PILOT Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Zap size={16} className="text-signal-green" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">DEFI PILOT</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">V2</span>
                    <span className="text-[10px] bg-signal-green/20 text-signal-green px-1.5 py-0.5 rounded">80 Indicators</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-green" />
                    80+ Technical Indicators
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-muted rounded"><Settings size={14} className="text-muted-foreground" /></button>
              </div>
            </div>
          </div>

          {/* Pilot Tabs */}
          <div className="flex border-b border-border shrink-0">
            {['LIVE PILOT', 'SCENARIOS', 'OPTIMIZE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  activeRightTab === tab
                    ? 'bg-signal-green/10 text-signal-green border-b-2 border-signal-green'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Trading Target Badge */}
            <div className="flex justify-end">
              <span className="bg-signal-green text-background text-xs font-bold px-3 py-1 rounded-full">
                Trading targets
              </span>
            </div>

            {/* Signal Card */}
            <div className="border border-border rounded-xl p-4 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-signal-green" />
                <span className="text-xs font-bold text-muted-foreground">DEFI PILOT</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <button className="px-4 py-2 bg-signal-green text-background font-bold rounded-lg text-lg">
                  BUY
                </button>
                <div className="text-sm">
                  <span className="text-muted-foreground">75% confidence</span>
                  <span className="text-signal-green font-bold ml-2">R:R 1:2.5</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground mb-1">ENTRY</p>
                  <p className="font-mono font-bold text-sm">$87,502.85</p>
                </div>
                <div className="bg-signal-red/10 rounded-lg p-3">
                  <p className="text-[10px] text-signal-red mb-1">STOP LOSS</p>
                  <p className="font-mono font-bold text-sm text-signal-red">$87,002.85</p>
                </div>
                <div className="bg-signal-green/10 rounded-lg p-3">
                  <p className="text-[10px] text-signal-green mb-1">TAKE PROFIT</p>
                  <p className="font-mono font-bold text-sm text-signal-green">$88,002.85</p>
                  <p className="font-mono text-xs text-signal-green">$88,502.85</p>
                </div>
              </div>
            </div>

            {/* Second Signal */}
            <div className="flex justify-end">
              <button className="border border-signal-green text-signal-green text-xs font-bold px-3 py-1.5 rounded-lg">
                Trading targets
              </button>
            </div>

            {/* Another Signal Card */}
            <div className="border border-border rounded-xl p-4 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-signal-green" />
                <span className="text-xs font-bold text-muted-foreground">DEFI PILOT</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <button className="px-4 py-2 bg-signal-green text-background font-bold rounded-lg">BUY</button>
                <span className="text-sm text-muted-foreground">75% confidence</span>
                <span className="text-signal-green font-bold text-sm">R:R 1:2.5</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2"><p className="text-muted-foreground">ENTRY</p></div>
                <div className="p-2"><p className="text-signal-red">STOP LOSS</p></div>
                <div className="p-2"><p className="text-signal-green">TAKE PROFIT</p></div>
              </div>
              <div className="flex gap-2 mt-3">
                {['Trend', 'Levels', 'Target', 'Full'].map((btn, i) => (
                  <button 
                    key={btn}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                      i === 0 ? 'bg-signal-blue text-background' :
                      i === 1 ? 'bg-signal-red text-background' :
                      i === 2 ? 'bg-signal-green text-background' :
                      'bg-warning text-background'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask for analysis..."
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-signal-green/50 pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-signal-green">
                <MousePointer2 size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StockHooTerminal;
