import React from 'react';
import { Globe, Calendar, TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dxyData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  value: 103 + Math.sin(i * 0.3) * 2 + Math.random() * 0.5,
}));

const fedFundsData = [
  { month: 'Jan', rate: 5.50 },
  { month: 'Feb', rate: 5.50 },
  { month: 'Mar', rate: 5.50 },
  { month: 'Apr', rate: 5.25 },
  { month: 'May', rate: 5.25 },
  { month: 'Jun', rate: 5.00 },
];

const economicEvents = [
  { date: 'Mar 13', event: 'ETH Dencun Upgrade', impact: 'high', type: 'crypto' },
  { date: 'Mar 16', event: 'ARB Token Unlock', impact: 'medium', type: 'crypto' },
  { date: 'Mar 20', event: 'FOMC Meeting', impact: 'high', type: 'macro' },
  { date: 'Mar 22', event: 'Bitcoin Halving (~)', impact: 'high', type: 'crypto' },
  { date: 'Mar 28', event: 'PCE Inflation Data', impact: 'medium', type: 'macro' },
];

const marketIndicators = [
  { name: 'Fear & Greed Index', value: 72, status: 'Greed', color: 'text-green-500' },
  { name: 'BTC Dominance', value: 52.3, status: 'Rising', color: 'text-green-500' },
  { name: 'Altcoin Season Index', value: 35, status: 'Bitcoin Season', color: 'text-orange-500' },
  { name: 'Stablecoin Inflow', value: '+$2.1B', status: '7D', color: 'text-green-500' },
];

const Macro = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Macro Dashboard</h1>
        <p className="text-sm text-muted-foreground">Global economic indicators & crypto events</p>
      </div>

      {/* Market Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketIndicators.map((indicator) => (
          <div key={indicator.name} className="terminal-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{indicator.name}</p>
            <p className="text-2xl font-bold">{indicator.value}</p>
            <p className={`text-xs ${indicator.color}`}>{indicator.status}</p>
          </div>
        ))}
      </div>

      {/* DXY Chart */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-primary" />
            <h2 className="text-sm font-bold">US Dollar Index (DXY)</h2>
          </div>
          <span className="text-xs text-muted-foreground">30D</span>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dxyData}>
              <defs>
                <linearGradient id="dxyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [value.toFixed(2), 'DXY']}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#dxyGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-primary font-medium">AI Analysis:</span> DXY showing weakness as markets price in rate cuts. 
            Historically, a weakening dollar is bullish for crypto assets. Watch the 102.5 support level.
          </p>
        </div>
      </div>

      {/* Fed Funds Rate */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            <h2 className="text-sm font-bold">Fed Funds Rate Expectations</h2>
          </div>
          <span className="text-xs text-muted-foreground">2024</span>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fedFundsData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis hide domain={[4.5, 6]} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value: number) => [`${value}%`, 'Rate']}
              />
              <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Economic Calendar */}
      <div className="terminal-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-primary" />
          <h2 className="text-sm font-bold">Upcoming Events</h2>
        </div>
        
        <div className="space-y-3">
          {economicEvents.map((event, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[60px]">
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{event.event}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    event.type === 'crypto' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {event.type === 'crypto' ? 'Crypto' : 'Macro'}
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                event.impact === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {event.impact === 'high' ? '🔴 High' : '🟡 Medium'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Liquidity */}
      <div className="terminal-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-green-500" />
          <h2 className="text-sm font-bold">Global Liquidity Outlook</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-500">Bullish Factors</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Fed signaling rate cuts in H2 2024</li>
              <li>• China stimulus measures ongoing</li>
              <li>• Bitcoin halving supply shock</li>
              <li>• Spot ETF inflows continuing</li>
            </ul>
          </div>
          
          <div className="p-4 bg-red-500/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-500">Risk Factors</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Persistent core inflation above target</li>
              <li>• Geopolitical tensions escalation</li>
              <li>• Regulatory uncertainty</li>
              <li>• Overleveraged positions in derivatives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Macro;
