import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
}

const mockTokens: TokenData[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64250, change24h: 2.4, volume: '$28.5B', marketCap: '$1.26T' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3205, change24h: 1.8, volume: '$15.2B', marketCap: '$385B' },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 145.30, change24h: 5.2, volume: '$3.8B', marketCap: '$63B' },
  { id: '4', symbol: 'AVAX', name: 'Avalanche', price: 38.50, change24h: -2.1, volume: '$890M', marketCap: '$14.2B' },
  { id: '5', symbol: 'LINK', name: 'Chainlink', price: 18.25, change24h: 4.5, volume: '$650M', marketCap: '$10.7B' },
  { id: '6', symbol: 'DOGE', name: 'Dogecoin', price: 0.165, change24h: -1.2, volume: '$1.2B', marketCap: '$23.5B' },
  { id: '7', symbol: 'DOT', name: 'Polkadot', price: 7.85, change24h: 0.8, volume: '$320M', marketCap: '$10.1B' },
  { id: '8', symbol: 'MATIC', name: 'Polygon', price: 0.92, change24h: 3.2, volume: '$480M', marketCap: '$8.5B' },
  { id: '9', symbol: 'UNI', name: 'Uniswap', price: 12.30, change24h: -0.5, volume: '$210M', marketCap: '$7.4B' },
  { id: '10', symbol: 'ATOM', name: 'Cosmos', price: 9.45, change24h: 1.1, volume: '$280M', marketCap: '$3.6B' },
];

type SortField = 'symbol' | 'price' | 'change24h' | 'volume' | 'marketCap';
type SortOrder = 'asc' | 'desc';

const Scanner = () => {
  const [priceFilter, setPriceFilter] = useState('all');
  const [volumeFilter, setVolumeFilter] = useState('all');
  const [capFilter, setCapFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredTokens = mockTokens
    .filter((token) => {
      if (priceFilter === 'gainers' && token.change24h < 0) return false;
      if (priceFilter === 'losers' && token.change24h >= 0) return false;
      if (priceFilter === '5plus' && Math.abs(token.change24h) < 5) return false;
      if (priceFilter === '10plus' && Math.abs(token.change24h) < 10) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal: number | string = a[sortField];
      let bVal: number | string = b[sortField];
      
      if (typeof aVal === 'string') aVal = parseFloat(aVal.replace(/[$BTM,]/g, '')) || 0;
      if (typeof bVal === 'string') bVal = parseFloat(bVal.replace(/[$BTM,]/g, '')) || 0;
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Market Scanner</h1>
        <p className="text-sm text-muted-foreground">Real-time token screening with advanced filters</p>
      </div>

      {/* Filters */}
      <div className="terminal-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Price Change</label>
            <select 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All</option>
              <option value="gainers">Top Gainers</option>
              <option value="losers">Top Losers</option>
              <option value="5plus">5%+</option>
              <option value="10plus">10%+</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Volume</label>
            <select 
              value={volumeFilter}
              onChange={(e) => setVolumeFilter(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All</option>
              <option value="high">High Volume</option>
              <option value="spike">Volume Spike</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2">Market Cap</label>
            <select 
              value={capFilter}
              onChange={(e) => setCapFilter(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All</option>
              <option value="large">Large Cap (&gt;$10B)</option>
              <option value="mid">Mid Cap ($1B-$10B)</option>
              <option value="small">Small Cap (&lt;$1B)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th 
                  className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center gap-1">
                    Symbol
                    <ArrowUpDown size={12} className="text-muted-foreground" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Price
                    <ArrowUpDown size={12} className="text-muted-foreground" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('change24h')}
                >
                  <div className="flex items-center justify-end gap-1">
                    24h %
                    <ArrowUpDown size={12} className="text-muted-foreground" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium">Volume</th>
                <th 
                  className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Market Cap
                    <ArrowUpDown size={12} className="text-muted-foreground" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token) => (
                <tr 
                  key={token.id}
                  className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    ${token.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`flex items-center justify-end gap-1 ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {token.volume}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {token.marketCap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
