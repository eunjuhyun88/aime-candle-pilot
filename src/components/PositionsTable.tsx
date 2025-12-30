import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: string;
  currentPrice: string;
  pnl: string;
  pnlPercent: string;
  confidence: number;
  size: string;
}

interface PositionsTableProps {
  positions: Position[];
}

export const PositionsTable = ({ positions }: PositionsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-muted-foreground uppercase tracking-wider">
            <th className="pb-3 font-medium">Symbol</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium">Size</th>
            <th className="pb-3 font-medium">Entry</th>
            <th className="pb-3 font-medium">Current</th>
            <th className="pb-3 font-medium">PnL</th>
            <th className="pb-3 font-medium">AI Confidence</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {positions.map((position) => {
            const isProfit = !position.pnl.startsWith('-');
            const isLong = position.type === 'long';
            
            return (
              <tr 
                key={position.id} 
                className="border-t border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-4">
                  <span className="font-bold text-foreground">{position.symbol}</span>
                </td>
                <td className="py-4">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                    isLong 
                      ? 'bg-signal-green/10 text-signal-green' 
                      : 'bg-signal-red/10 text-signal-red'
                  }`}>
                    {isLong ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {position.type.toUpperCase()}
                  </div>
                </td>
                <td className="py-4 font-mono text-muted-foreground">{position.size}</td>
                <td className="py-4 font-mono text-muted-foreground">${position.entryPrice}</td>
                <td className="py-4 font-mono text-foreground">${position.currentPrice}</td>
                <td className="py-4">
                  <div className={`font-mono font-bold ${isProfit ? 'text-signal-green' : 'text-signal-red'}`}>
                    {isProfit ? '+' : ''}{position.pnl}
                    <span className="text-[10px] ml-1 opacity-70">({position.pnlPercent})</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                        style={{ width: `${position.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{position.confidence}%</span>
                  </div>
                </td>
                <td className="py-4">
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <MoreHorizontal size={14} className="text-muted-foreground" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
