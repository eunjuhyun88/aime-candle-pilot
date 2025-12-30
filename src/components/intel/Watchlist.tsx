import React, { useState } from 'react';
import { Star, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  chartData: { value: number }[];
}

const mockWatchlist: WatchlistItem[] = [
  { 
    id: '1', 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    price: 64250, 
    change24h: 2.4,
    chartData: Array.from({ length: 7 }, () => ({ value: 62000 + Math.random() * 4000 }))
  },
  { 
    id: '2', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    price: 3205, 
    change24h: 1.8,
    chartData: Array.from({ length: 7 }, () => ({ value: 3000 + Math.random() * 400 }))
  },
  { 
    id: '3', 
    symbol: 'SOL', 
    name: 'Solana', 
    price: 145.30, 
    change24h: 5.2,
    chartData: Array.from({ length: 7 }, () => ({ value: 130 + Math.random() * 30 }))
  },
];

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(mockWatchlist);

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  if (watchlist.length === 0) {
    return (
      <div className="p-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Watchlist</h1>
          <p className="text-sm text-muted-foreground">Track your favorite tokens</p>
        </div>

        <div className="terminal-card p-12 text-center mt-6">
          <Star size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Add tokens from Scanner or Trading page
          </p>
          <Link
            to="/intel"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add Token
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Watchlist</h1>
          <p className="text-sm text-muted-foreground">{watchlist.length} tokens tracked</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
          <Plus size={16} />
          Add Token
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item) => (
          <Link
            key={item.id}
            to="/"
            className="terminal-card p-4 hover:border-primary/30 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold">
                  {item.symbol.charAt(0)}
                </div>
                <div>
                  <p className="font-bold group-hover:text-primary transition-colors">{item.symbol}</p>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWatchlist(item.id);
                }}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </button>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-bold">${item.price.toLocaleString()}</p>
                <span className={`flex items-center gap-1 text-sm ${
                  item.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                </span>
              </div>
              
              <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.chartData}>
                    <defs>
                      <linearGradient id={`gradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.change24h >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={item.change24h >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={item.change24h >= 0 ? '#22c55e' : '#ef4444'} 
                      fill={`url(#gradient-${item.id})`}
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
