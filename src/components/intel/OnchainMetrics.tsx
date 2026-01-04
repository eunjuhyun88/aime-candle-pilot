import React, { useEffect, useState, useCallback } from 'react';
import { Wallet, TrendingUp, Activity, Zap, Flame, Target, RefreshCw } from 'lucide-react';
import { useMarketData, formatLargeNumber, formatPercent } from '@/hooks/useMarketData';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color: string;
  isLoading?: boolean;
}

const MetricCard = ({ icon: Icon, label, value, change, isPositive, color, isLoading }: MetricCardProps) => (
  <div className={`px-1.5 py-1 rounded-md bg-muted/20 border border-border/50 ${isLoading ? 'animate-pulse' : ''}`}>
    <div className="flex items-center gap-1 mb-0.5">
      <div className={`w-4 h-4 rounded ${color} flex items-center justify-center`}>
        <Icon size={8} className="text-foreground" />
      </div>
      <span className="text-[8px] text-muted-foreground font-medium truncate">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className={`text-[10px] font-bold ${isLoading ? 'text-muted-foreground' : ''}`}>
        {isLoading ? '...' : value}
      </span>
      {change && !isLoading && (
        <span className={`text-[8px] font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
      )}
    </div>
  </div>
);

interface OnchainMetricsProps {
  symbol?: string;
}

const OnchainMetrics: React.FC<OnchainMetricsProps> = ({ symbol = 'BTC' }) => {
  const { fetchMarketData, isLoading } = useMarketData();
  const [metrics, setMetrics] = useState({
    price: 0,
    priceChange: 0,
    volume: 0,
    marketCap: 0,
    openInterest: 0,
    fundingRate: 0,
    longShortRatio: 1,
  });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    const data = await fetchMarketData(symbol);
    if (data?.data) {
      setMetrics({
        price: data.data.binance?.price || 0,
        priceChange: data.data.binance?.priceChange24h || 0,
        volume: data.data.binance?.volume24h || 0,
        marketCap: data.data.coingecko?.marketCap || 0,
        openInterest: data.data.derivatives?.openInterest || 0,
        fundingRate: data.data.derivatives?.fundingRate || 0,
        longShortRatio: data.data.derivatives?.longShortRatio || 1,
      });
      setLastUpdate(new Date());
    }
  }, [fetchMarketData, symbol]);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const displayMetrics = [
    { 
      icon: TrendingUp, 
      label: `${symbol} 가격`, 
      value: metrics.price > 0 ? `$${metrics.price.toLocaleString()}` : '-',
      change: metrics.priceChange !== 0 ? formatPercent(metrics.priceChange) : undefined,
      isPositive: metrics.priceChange >= 0, 
      color: 'bg-blue-500/20' 
    },
    { 
      icon: Activity, 
      label: '24H 거래량', 
      value: metrics.volume > 0 ? formatLargeNumber(metrics.volume) : '-',
      color: 'bg-cyan-500/20' 
    },
    { 
      icon: Wallet, 
      label: '시가총액', 
      value: metrics.marketCap > 0 ? formatLargeNumber(metrics.marketCap) : '-',
      color: 'bg-purple-500/20' 
    },
    { 
      icon: Flame, 
      label: '미결제약정', 
      value: metrics.openInterest > 0 ? `${(metrics.openInterest / 1000).toFixed(1)}K` : '-',
      color: 'bg-orange-500/20' 
    },
    { 
      icon: Zap, 
      label: '펀딩비', 
      value: metrics.fundingRate !== 0 ? `${metrics.fundingRate.toFixed(4)}%` : '-',
      change: metrics.fundingRate > 0 ? '롱 우세' : metrics.fundingRate < 0 ? '숏 우세' : undefined,
      isPositive: metrics.fundingRate < 0,
      color: 'bg-yellow-500/20' 
    },
    { 
      icon: Target, 
      label: '롱/숏 비율', 
      value: metrics.longShortRatio !== 1 ? metrics.longShortRatio.toFixed(2) : '-',
      change: metrics.longShortRatio > 1 ? '롱↑' : metrics.longShortRatio < 1 ? '숏↑' : undefined,
      isPositive: metrics.longShortRatio > 1,
      color: 'bg-green-500/20' 
    },
  ];

  return (
    <div className="px-2 py-1.5 border-b border-border">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-muted-foreground font-medium">실시간 데이터</span>
        <button 
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-0.5 text-[8px] text-muted-foreground hover:text-foreground"
        >
          <RefreshCw size={8} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {displayMetrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} isLoading={isLoading && metrics.price === 0} />
        ))}
      </div>
    </div>
  );
};

export default OnchainMetrics;