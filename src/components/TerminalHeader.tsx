import { TrendingUp, TrendingDown, Activity, Clock, Wifi } from 'lucide-react';

interface TerminalHeaderProps {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  showWhaleHeat: boolean;
  showSR: boolean;
  onToggleWhaleHeat: () => void;
  onToggleSR: () => void;
}

export const TerminalHeader = ({
  symbol,
  price,
  change,
  isPositive,
  showWhaleHeat,
  showSR,
  onToggleWhaleHeat,
  onToggleSR,
}: TerminalHeaderProps) => {
  return (
    <header className="h-14 border-b border-border flex items-center px-6 justify-between bg-card">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center text-[10px] font-bold text-warning-foreground">
            ₿
          </div>
          <div>
            <h1 className="font-bold text-foreground">{symbol}</h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Wifi size={8} className="text-signal-green" />
              <span>Live</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold font-mono ${isPositive ? 'text-signal-green' : 'text-signal-red'}`}>
            ${price}
          </span>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
            isPositive ? 'bg-signal-green/10 text-signal-green' : 'bg-signal-red/10 text-signal-red'
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity size={10} />
            <span>Vol: <span className="text-foreground font-medium">$2.4B</span></span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} />
            <span>24h High: <span className="text-signal-green font-medium">$65,420</span></span>
          </div>
          <div className="flex items-center gap-1">
            <span>24h Low: <span className="text-signal-red font-medium">$62,180</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleWhaleHeat}
          className={`text-[10px] px-3 py-1.5 rounded border transition-all font-medium ${
            showWhaleHeat
              ? 'bg-primary/10 border-primary/50 text-primary'
              : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          🐋 Whale Heat
        </button>
        <button
          onClick={onToggleSR}
          className={`text-[10px] px-3 py-1.5 rounded border transition-all font-medium ${
            showSR
              ? 'bg-primary/10 border-primary/50 text-primary'
              : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          📊 S/R Lines
        </button>
        <div className="h-6 w-px bg-border mx-1" />
        <select className="text-[10px] bg-muted border border-border rounded px-2 py-1.5 text-muted-foreground focus:outline-none focus:border-primary">
          <option>15m</option>
          <option>1H</option>
          <option>4H</option>
          <option>1D</option>
        </select>
      </div>
    </header>
  );
};
