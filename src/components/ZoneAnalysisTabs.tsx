import { useState } from 'react';
import { Wallet, MessageCircle, Activity, BarChart3 } from 'lucide-react';
import { PositionsTable } from './PositionsTable';

type TabType = 'positions' | 'vibes' | 'whales' | 'orders';

interface ZoneAnalysisTabsProps {
  positions: any[];
}

export const ZoneAnalysisTabs = ({ positions }: ZoneAnalysisTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('positions');

  const tabs = [
    { id: 'positions' as TabType, label: 'Positions', icon: Wallet },
    { id: 'vibes' as TabType, label: 'Vibes (Sentiment)', icon: MessageCircle },
    { id: 'whales' as TabType, label: 'Whale Activities', icon: Activity },
    { id: 'orders' as TabType, label: 'Order Flow', icon: BarChart3 },
  ];

  const vibesData = [
    { id: '1', source: 'Twitter', sentiment: 'Bullish', score: 78, change: '+12%', timestamp: '2m ago' },
    { id: '2', source: 'Reddit', sentiment: 'Neutral', score: 52, change: '-3%', timestamp: '5m ago' },
    { id: '3', source: 'Telegram', sentiment: 'Bullish', score: 85, change: '+8%', timestamp: '8m ago' },
  ];

  const whaleData = [
    { id: '1', type: 'Accumulation', amount: '2,500 BTC', wallet: '0x1a2b...3c4d', exchange: 'Binance → Cold', timestamp: '3m ago' },
    { id: '2', type: 'Distribution', amount: '850 BTC', wallet: '0x5e6f...7g8h', exchange: 'Cold → Coinbase', timestamp: '12m ago' },
    { id: '3', type: 'Transfer', amount: '1,200 BTC', wallet: '0x9i0j...1k2l', exchange: 'Internal', timestamp: '18m ago' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-3 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'positions' && (
          <PositionsTable positions={positions} />
        )}

        {activeTab === 'vibes' && (
          <div className="space-y-3">
            {vibesData.map((item) => (
              <div key={item.id} className="terminal-card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.sentiment === 'Bullish' ? 'bg-signal-green' : 
                    item.sentiment === 'Bearish' ? 'bg-signal-red' : 'bg-warning'
                  }`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.source}</p>
                    <p className="text-[10px] text-muted-foreground">{item.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${
                    item.sentiment === 'Bullish' ? 'text-signal-green' : 
                    item.sentiment === 'Bearish' ? 'text-signal-red' : 'text-warning'
                  }`}>
                    {item.sentiment}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Score: {item.score} <span className={item.change.startsWith('+') ? 'text-signal-green' : 'text-signal-red'}>{item.change}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'whales' && (
          <div className="space-y-3">
            {whaleData.map((item) => (
              <div key={item.id} className="terminal-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.type === 'Accumulation' ? 'bg-signal-green/10 text-signal-green' :
                    item.type === 'Distribution' ? 'bg-signal-red/10 text-signal-red' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold font-mono text-foreground">{item.amount}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{item.wallet}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.exchange}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            <p>Order flow data syncing...</p>
          </div>
        )}
      </div>
    </div>
  );
};
