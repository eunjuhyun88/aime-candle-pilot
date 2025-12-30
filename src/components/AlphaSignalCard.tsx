import { TrendingUp, ArrowUpRight, Shield, Clock } from 'lucide-react';

interface Signal {
  id: string;
  title: string;
  timestamp: string;
  reason: string;
  entry: string;
  target: string;
  stop: string;
  confidence: number;
  type: 'long' | 'short';
}

interface AlphaSignalCardProps {
  signal: Signal;
  onApply: (signal: Signal) => void;
}

export const AlphaSignalCard = ({ signal, onApply }: AlphaSignalCardProps) => {
  const isLong = signal.type === 'long';
  
  return (
    <div className="terminal-card border-l-4 border-l-primary p-4 rounded-r-lg animate-slide-in-right glow-border">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-sm uppercase tracking-wider">
            Alpha Signal
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-sm ${
            isLong ? 'bg-signal-green/10 text-signal-green' : 'bg-signal-red/10 text-signal-red'
          }`}>
            {isLong ? 'LONG' : 'SHORT'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock size={10} />
          <span className="text-[10px]">{signal.timestamp}</span>
        </div>
      </div>
      
      <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
        <TrendingUp size={14} className="text-primary" />
        {signal.title}
      </h4>
      
      <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
        {signal.reason}
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-background/50 p-2.5 rounded-md border border-border/50">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Entry</p>
          <p className="text-signal-green font-mono font-bold text-sm">${signal.entry}</p>
        </div>
        <div className="bg-background/50 p-2.5 rounded-md border border-border/50">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Target</p>
          <p className="text-signal-blue font-mono font-bold text-sm">${signal.target}</p>
        </div>
        <div className="bg-background/50 p-2.5 rounded-md border border-border/50">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Stop</p>
          <p className="text-signal-red font-mono font-bold text-sm">${signal.stop}</p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Shield size={10} /> AI Confidence
          </span>
          <span className="text-[10px] font-mono text-primary font-bold">{signal.confidence}%</span>
        </div>
        <div className="h-1.5 bg-background rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-500"
            style={{ width: `${signal.confidence}%` }}
          />
        </div>
      </div>
      
      <button 
        onClick={() => onApply(signal)}
        className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20"
      >
        <ArrowUpRight size={14} />
        APPLY STRATEGY
      </button>
    </div>
  );
};
