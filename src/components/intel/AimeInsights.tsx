import React from 'react';
import { InsightData } from '@/pages/Intel';
import { Sparkles, TrendingUp, TrendingDown, ArrowLeft, ExternalLink, Twitter, MessageCircle, Search, Target, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  image: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
}

interface Prediction {
  id: string;
  symbol: string;
  type: string;
  bias: 'long' | 'short';
  confidence: number;
  entry: string;
  target: string;
  stop: string;
  rationale: string;
}

const mockNews: NewsItem[] = [
  { id: '1', title: 'Bitcoin ETF approval expected within days as SEC review nears completion', source: 'Bloomberg', time: '2h ago', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400', sentiment: 'bullish', sentimentScore: 85 },
  { id: '2', title: 'Ethereum developers announce major upgrade timeline for Q2 2024', source: 'CoinDesk', time: '3h ago', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400', sentiment: 'bullish', sentimentScore: 72 },
  { id: '3', title: 'Solana network outage raises concerns among institutional investors', source: 'Reuters', time: '4h ago', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400', sentiment: 'bearish', sentimentScore: 35 },
  { id: '4', title: 'Central banks explore CBDC integration with existing crypto rails', source: 'FT', time: '5h ago', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400', sentiment: 'neutral', sentimentScore: 50 },
];

const mockPredictions: Prediction[] = [
  { id: '1', symbol: 'BTC', type: 'Breakout', bias: 'long', confidence: 78, entry: '$63,250', target: '$67,200', stop: '$62,800', rationale: 'AI model detected strong signal from multiple timeframe confirmation' },
  { id: '2', symbol: 'ETH', type: 'Accumulation', bias: 'long', confidence: 82, entry: '$3,180', target: '$3,550', stop: '$3,050', rationale: 'On-chain whale accumulation detected with reduced exchange balance' },
  { id: '3', symbol: 'SOL', type: 'Reversal', bias: 'short', confidence: 65, entry: '$145.50', target: '$128.00', stop: '$152.00', rationale: 'Bearish divergence on RSI with decreasing network activity' },
];

const socialPlatforms = [
  { name: 'Twitter/X', icon: '🐦', score: 78, volume: 'High', trend: 'Bullish momentum' },
  { name: 'Reddit', icon: '🤖', score: 55, volume: 'Medium', trend: 'Mixed signals' },
  { name: 'Telegram', icon: '💬', score: 62, volume: 'High', trend: 'Optimistic' },
];

const priceData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  price: 62000 + Math.random() * 4000 + (i * 50),
}));

interface AimeInsightsProps {
  searchQuery: string;
  insightData: InsightData | null;
  onClearInsight: () => void;
  isLoading: boolean;
}

const AimeInsights = ({ searchQuery, insightData, onClearInsight, isLoading }: AimeInsightsProps) => {
  const filteredNews = searchQuery 
    ? mockNews.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockNews;

  const filteredPredictions = searchQuery
    ? mockPredictions.filter(p => p.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockPredictions;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-muted/50 rounded w-1/3" />
        <div className="h-4 bg-muted/30 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted/30 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Token Analysis Mode
  if (insightData?.type === 'token_analysis') {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <button 
          onClick={onClearInsight}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to News
        </button>

        <div className="terminal-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold">
                {insightData.symbol?.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{insightData.token}</h1>
                <p className="text-muted-foreground">{insightData.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${insightData.price?.toLocaleString()}</p>
              <p className={`text-sm font-medium ${(insightData.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {(insightData.change || 0) >= 0 ? '+' : ''}{insightData.change}%
              </p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-muted/30 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-bold">AI Analysis</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                insightData.trend === 'Bullish' ? 'bg-green-500/20 text-green-500' :
                insightData.trend === 'Bearish' ? 'bg-red-500/20 text-red-500' :
                'bg-yellow-500/20 text-yellow-500'
              }`}>
                {insightData.trend}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {insightData.description}
            </p>
          </div>

          {/* Stats Grid */}
          {insightData.stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/20 p-4 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">TPS</p>
                <p className="text-xl font-bold">{insightData.stats.tps}</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">Active Wallets</p>
                <p className="text-xl font-bold">{insightData.stats.active_wallets}</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">TVL</p>
                <p className="text-xl font-bold">{insightData.stats.tvl}</p>
              </div>
            </div>
          )}

          {/* Price Chart */}
          {insightData.chart_data && (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insightData.chart_data}>
                  <defs>
                    <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#tokenGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {searchQuery ? `Search Results: "${searchQuery}"` : 'Research Intelligence'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {searchQuery 
            ? `${filteredNews.length} news articles • ${filteredPredictions.length} trading setups found`
            : 'Daily briefings, on-chain analysis, and trading setups.'
          }
        </p>
      </div>

      {/* AI Curated News */}
      <section className="terminal-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">{searchQuery ? 'Relevant News' : 'AI Curated News & Sentiment'}</h2>
          <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Sparkles size={10} />
            AI Analysis Active
          </span>
        </div>

        {filteredNews.length === 0 ? (
          <div className="py-12 text-center">
            <Search size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">No news found matching your search.</p>
            <button 
              onClick={() => window.history.pushState({}, '', '/intel')}
              className="text-sm text-primary hover:underline"
            >
              Clear search and show all news
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((news) => (
              <article 
                key={news.id}
                className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {/* Sentiment Badge */}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full ${
                    news.sentiment === 'bullish' ? 'bg-green-500/90 text-white' :
                    news.sentiment === 'bearish' ? 'bg-red-500/90 text-white' :
                    'bg-yellow-500/90 text-black'
                  }`}>
                    {news.sentiment === 'bullish' ? '▲' : news.sentiment === 'bearish' ? '▼' : '●'} {news.sentimentScore}%
                  </span>

                  {/* Source & Time */}
                  <div className="absolute bottom-2 left-2 text-[10px] text-white/80">
                    {news.source} • {news.time}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  
                  {/* Sentiment Bars */}
                  <div className="flex gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= Math.ceil(news.sentimentScore / 20) 
                            ? news.sentiment === 'bullish' ? 'bg-green-500' :
                              news.sentiment === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
                            : 'bg-muted/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Social Media Sentiment */}
      <section className="terminal-card p-4">
        <h2 className="text-sm font-bold mb-4">Social Media Sentiment Pulse</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialPlatforms.map((platform) => (
            <div 
              key={platform.name}
              className="bg-muted/20 p-4 rounded-xl hover:bg-muted/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{platform.icon}</span>
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
              <p className="text-3xl font-bold mb-2">{platform.score}<span className="text-lg text-muted-foreground">/100</span></p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    platform.score >= 60 ? 'bg-green-500' :
                    platform.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${platform.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded ${
                  platform.volume === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-muted text-muted-foreground'
                }`}>
                  {platform.volume}
                </span>
                <span className={platform.score >= 60 ? 'text-green-500' : 'text-muted-foreground'}>
                  {platform.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Trend Analysis */}
      <section className="terminal-card p-4">
        <h2 className="text-sm font-bold mb-4">Market Trend Analysis</h2>
        
        <div className="bg-muted/20 p-4 rounded-xl mb-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bitcoin (BTC) is showing signs of spot-driven accumulation with reduced exchange balances. 
            On-chain metrics suggest consolidation phase before next major move.
          </p>
        </div>

        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke="hsl(var(--success))" fill="url(#priceGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-red-500/10 p-3 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp size={12} className="text-red-500" />
              <span className="text-xs text-muted-foreground">Resistance</span>
            </div>
            <p className="font-bold text-red-500">$68,500</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target size={12} className="text-primary" />
              <span className="text-xs text-muted-foreground">Pivot</span>
            </div>
            <p className="font-bold text-primary">$64,200</p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield size={12} className="text-green-500" />
              <span className="text-xs text-muted-foreground">Support</span>
            </div>
            <p className="font-bold text-green-500">$62,000</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-muted/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">📅</span>
              <span className="text-xs text-muted-foreground">March 13</span>
            </div>
            <p className="text-sm font-medium">ETH Dencun Upgrade</p>
          </div>
          <div className="flex-1 bg-muted/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">📅</span>
              <span className="text-xs text-muted-foreground">March 16</span>
            </div>
            <p className="text-sm font-medium">ARB Unlock</p>
          </div>
        </div>
      </section>

      {/* Trading Playbook */}
      <section className="terminal-card p-4">
        <h2 className="text-sm font-bold mb-4">{searchQuery ? 'Relevant Setups' : 'Active Setups (1-2 Weeks)'}</h2>
        
        {filteredPredictions.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl mb-3 block">📊</span>
            <p className="text-muted-foreground mb-2">No trading setups found matching your search.</p>
            <button className="text-sm text-primary hover:underline">
              View all setups
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Scenario</th>
                  <th className="pb-3 font-medium">Trigger</th>
                  <th className="pb-3 font-medium">Bias</th>
                  <th className="pb-3 font-medium">Targets/Stops</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.map((pred) => (
                  <tr key={pred.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{pred.symbol}</span>
                        <span className="text-xs text-muted-foreground">{pred.type}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Conf: {pred.confidence}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        pred.bias === 'long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {pred.bias.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="text-xs space-y-0.5">
                        <p><span className="text-green-500">T:</span> {pred.target}</p>
                        <p><span className="text-red-500">S:</span> {pred.stop}</p>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <p className="text-xs text-muted-foreground line-clamp-2">{pred.rationale}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AimeInsights;
