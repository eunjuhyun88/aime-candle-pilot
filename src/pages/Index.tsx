import { useState } from 'react';
import { Zap, MessageSquare, TrendingUp, Activity, Settings, Bell, Search, Target, ShieldCheck, MousePointer2 } from 'lucide-react';
import { AlphaSignalCard } from '@/components/AlphaSignalCard';
import { PlaybookItem } from '@/components/PlaybookItem';
import { ChartOverlay } from '@/components/ChartOverlay';
import { CopilotChat } from '@/components/CopilotChat';
import { ZoneAnalysisTabs } from '@/components/ZoneAnalysisTabs';
import { TerminalHeader } from '@/components/TerminalHeader';

// Mock Data
const mockPlaybooks = [
  {
    id: '1',
    title: 'BTC Squeeze Alert',
    description: 'Volatility at historical low. Whale accumulation detected in $63k zone. Expecting breakout within 48h.',
    type: 'bullish' as const,
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'ETH/BTC Rotation',
    description: 'Smart money shifting from ETH to BTC. On-chain metrics confirm institutional rebalancing.',
    type: 'neutral' as const,
    priority: 'medium' as const,
  },
  {
    id: '3',
    title: 'Funding Rate Divergence',
    description: 'Perpetual funding rates turning negative while spot accumulation continues. Classic bear trap setup.',
    type: 'bullish' as const,
    priority: 'medium' as const,
  },
];

const mockSignals = [
  {
    id: '1',
    title: 'Whale Backed Long',
    timestamp: '2 min ago',
    reason: 'Smart money absorption at 0.5 Fibonacci level. Social sentiment turning bullish. GEX flipping positive.',
    entry: '63,500',
    target: '65,800',
    stop: '62,750',
    confidence: 87,
    type: 'long' as const,
  },
];

const mockMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: '안녕하세요! 차트에서 $63.5k 구간에 지지선을 그리셨네요. 고래들의 매수벽과 일치하는 강력한 구간입니다. GEX 데이터 분석 결과, 이 레벨에서 84%의 돌파 확률을 계산했습니다.',
    timestamp: '12:34',
  },
  {
    id: '2',
    role: 'user' as const,
    content: '이 구간에서 롱 포지션 진입하면 어떨까?',
    timestamp: '12:35',
  },
  {
    id: '3',
    role: 'assistant' as const,
    content: '좋은 판단입니다! 현재 온체인 지표와 시장 구조를 분석한 Alpha Signal을 생성했습니다. 아래 카드에서 진입점, 목표가, 손절가를 확인하세요.',
    timestamp: '12:35',
  },
];

const mockPositions = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    type: 'long' as const,
    entryPrice: '63,250',
    currentPrice: '64,250',
    pnl: '$1,250.00',
    pnlPercent: '+12.4%',
    confidence: 85,
    size: '0.5 BTC',
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    type: 'short' as const,
    entryPrice: '3,450',
    currentPrice: '3,380',
    pnl: '$280.00',
    pnlPercent: '+4.2%',
    confidence: 72,
    size: '2.0 ETH',
  },
];

const mockWhaleZones = [
  { id: '1', top: 35, height: 12, label: 'Whale Accumulation Zone', intensity: 'high' as const },
  { id: '2', top: 70, height: 8, label: 'Support Cluster', intensity: 'medium' as const },
];

const mockSRLines = [
  { id: '1', y: 25, price: '65,800', type: 'resistance' as const },
  { id: '2', y: 45, price: '63,500', type: 'support' as const },
  { id: '3', y: 75, price: '61,200', type: 'support' as const },
];

export default function StockHooTerminal() {
  const [showWhaleHeat, setShowWhaleHeat] = useState(true);
  const [showSR, setShowSR] = useState(true);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedCandle, setSelectedCandle] = useState<{ time: string } | null>(null);
  const [aiMessage, setAiMessage] = useState("차트의 특정 구간을 클릭하거나 드로잉하여 분석을 시작하세요.");

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages([...messages, newMessage]);
  };

  const handleApplySignal = (signal: any) => {
    console.log('Applying signal:', signal);
  };

  const handleChartClick = () => {
    const candleData = { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) };
    setSelectedCandle(candleData);
    setAiMessage(`${candleData.time} 구간의 스마트머니 흐름을 분석 중입니다...`);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-mono selection:bg-primary/30">
      {/* LEFT: Intel Panel */}
      <aside className="w-72 border-r border-border bg-card flex flex-col transition-all duration-300">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse-glow">
              <TrendingUp size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gradient tracking-tight">STOCKHOO</h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Intelligence OS</p>
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

        {/* Active Playbook */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={12} className="text-primary" />
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Active Playbook
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          
          <div className="space-y-3">
            {mockPlaybooks.map((playbook) => (
              <PlaybookItem
                key={playbook.id}
                playbook={playbook}
                onClick={(p) => console.log('Selected:', p)}
              />
            ))}
          </div>

          {/* Market Pulse */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={12} className="text-signal-green" />
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Market Pulse
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="terminal-card p-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">Fear & Greed</span>
                <span className="text-xs font-bold text-signal-green">72 (Greed)</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-signal-red via-warning to-signal-green rounded-full" style={{ width: '72%' }} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BTC Dom</span>
                  <span className="text-foreground font-medium">54.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OI Change</span>
                  <span className="text-signal-green font-medium">+3.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">T</span>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Trader</p>
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
      </aside>

      {/* CENTER: Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <TerminalHeader
          symbol="BTC/USDT"
          price="64,250.50"
          change="+2.45%"
          isPositive={true}
          showWhaleHeat={showWhaleHeat}
          showSR={showSR}
          onToggleWhaleHeat={() => setShowWhaleHeat(!showWhaleHeat)}
          onToggleSR={() => setShowSR(!showSR)}
        />

        {/* Chart Area */}
        <div 
          className="flex-1 relative bg-background overflow-hidden cursor-crosshair group"
          onClick={handleChartClick}
        >
          <ChartOverlay
            whaleZones={mockWhaleZones}
            srLines={mockSRLines}
            showWhaleHeat={showWhaleHeat}
            showSR={showSR}
          />
          
          {/* Selected Zone Indicator */}
          {selectedCandle && (
            <div className="absolute top-[30%] left-[40%] border-2 border-signal-green/50 bg-signal-green/5 p-4 rounded-lg animate-pulse-glow z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-signal-green" />
                <span className="text-[10px] font-bold text-signal-green">ZONE SELECTED: $63.2K - $63.8K</span>
              </div>
            </div>
          )}
          
          {/* Chart Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                <TrendingUp size={28} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">TradingView Chart</p>
              <p className="text-muted-foreground/50 text-[10px]">Click anywhere to simulate zone selection</p>
            </div>
          </div>

          {/* Candle Candlestick Mock */}
          <div className="absolute bottom-20 left-0 right-0 h-40 flex items-end justify-center gap-1 px-20 opacity-20 pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => {
              const height = Math.random() * 80 + 20;
              const isGreen = Math.random() > 0.4;
              return (
                <div
                  key={i}
                  className={`w-2 rounded-sm ${isGreen ? 'bg-signal-green' : 'bg-signal-red'}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Zone Analysis */}
        <div className="h-64 border-t border-border bg-card">
          <ZoneAnalysisTabs positions={mockPositions} selectedCandle={selectedCandle} />
        </div>
      </main>

      {/* RIGHT: AI Copilot */}
      <aside className="w-80 border-l border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <MessageSquare size={14} className="text-primary" />
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

        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 mb-4">
            {/* Context Message */}
            <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border border-border text-xs leading-relaxed">
              {aiMessage}
            </div>
            
            {/* Analysis Result when candle selected */}
            {selectedCandle && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-xl text-[11px]">
                  <p className="text-primary font-bold mb-1">💡 분석 완료</p>
                  <p className="text-muted-foreground leading-snug">현재 지지선에서 스마트머니 매집이 확인됩니다. 돌파 시 숏 스퀴즈 발생 확률 74%입니다.</p>
                </div>
                <button className="w-full py-3 bg-foreground text-background text-xs font-black rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                  <Target size={14} /> 전략 실행 (One-Click)
                </button>
              </div>
            )}
            
            <CopilotChat
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
          
          {/* Alpha Signal Card */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={10} className="text-primary" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Latest Signal</span>
            </div>
            {mockSignals.map((signal) => (
              <AlphaSignalCard
                key={signal.id}
                signal={signal}
                onApply={handleApplySignal}
              />
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="차트 패턴이나 고래 활동 질문..."
              className="w-full bg-background/40 border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
            />
            <button className="absolute right-3 top-2.5 p-1 text-primary group-hover:scale-110 transition-all">
              <MousePointer2 size={16} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
