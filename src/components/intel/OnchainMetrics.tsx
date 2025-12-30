import React from 'react';
import { Wallet, TrendingUp, Activity, Zap, Flame, Target } from 'lucide-react';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color: string;
}

const MetricCard = ({ icon: Icon, label, value, change, isPositive, color }: MetricCardProps) => (
  <div className="p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all group">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
        <Icon size={14} className="text-foreground" />
      </div>
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-bold">{value}</span>
      {change && (
        <span className={`text-[10px] font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
      )}
    </div>
  </div>
);

const OnchainMetrics = () => {
  const metrics = [
    { icon: Wallet, label: '🐋 고래', value: '847', change: '12', isPositive: true, color: 'bg-blue-500/20' },
    { icon: TrendingUp, label: 'SOL TVL', value: '$1.8B', change: '5.2%', isPositive: true, color: 'bg-purple-500/20' },
    { icon: Activity, label: 'ETH Flow', value: '-$240M', change: '거래소→지갑', isPositive: true, color: 'bg-cyan-500/20' },
    { icon: Flame, label: 'DeFi TVL', value: '$52B', change: '2.1%', isPositive: true, color: 'bg-orange-500/20' },
    { icon: Zap, label: 'Gas', value: '28 Gwei', change: '12%', isPositive: false, color: 'bg-yellow-500/20' },
    { icon: Target, label: 'Hot Token', value: 'WIF', change: '+45%', isPositive: true, color: 'bg-green-500/20' },
  ];

  return (
    <div className="p-3 border-b border-border">
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default OnchainMetrics;
