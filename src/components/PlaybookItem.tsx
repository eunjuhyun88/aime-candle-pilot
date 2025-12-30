import { Zap, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Playbook {
  id: string;
  title: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

interface PlaybookItemProps {
  playbook: Playbook;
  onClick: (playbook: Playbook) => void;
}

export const PlaybookItem = ({ playbook, onClick }: PlaybookItemProps) => {
  const getTypeIcon = () => {
    switch (playbook.type) {
      case 'bullish': return <TrendingUp size={12} className="text-signal-green" />;
      case 'bearish': return <TrendingDown size={12} className="text-signal-red" />;
      default: return <AlertTriangle size={12} className="text-warning" />;
    }
  };

  const getTypeColor = () => {
    switch (playbook.type) {
      case 'bullish': return 'text-signal-green border-signal-green/30 bg-signal-green/5';
      case 'bearish': return 'text-signal-red border-signal-red/30 bg-signal-red/5';
      default: return 'text-warning border-warning/30 bg-warning/5';
    }
  };

  const getPriorityIndicator = () => {
    switch (playbook.priority) {
      case 'high': return 'bg-signal-red';
      case 'medium': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <button
      onClick={() => onClick(playbook)}
      className="w-full text-left terminal-card p-3 hover:border-primary/50 transition-all duration-200 group"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className={`p-1.5 rounded border ${getTypeColor()}`}>
          {getTypeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {playbook.title}
            </h4>
            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityIndicator()} signal-pulse`} />
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
        {playbook.description}
      </p>
    </button>
  );
};
