import React from 'react';
import { Eye, EyeOff, Target, Layers, Trash2, Flame } from 'lucide-react';
import { PriceLevel, AnalysisZone, TrendBias } from './ChartAnalysisOverlay';

interface AnalysisControlPanelProps {
  showLevels: boolean;
  showZones: boolean;
  onToggleLevels: () => void;
  onToggleZones: () => void;
  onClear: () => void;
  levelsCount: number;
  zonesCount: number;
  trendBias?: TrendBias;
}

export const AnalysisControlPanel: React.FC<AnalysisControlPanelProps> = ({
  showLevels,
  showZones,
  onToggleLevels,
  onToggleZones,
  onClear,
  levelsCount,
  zonesCount,
  trendBias,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Trend Badge */}
      {trendBias && (
        <div 
          className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${
            trendBias.direction === 'bullish' 
              ? 'bg-signal-green/20 text-signal-green'
              : trendBias.direction === 'bearish'
              ? 'bg-signal-red/20 text-signal-red'
              : 'bg-muted/50 text-muted-foreground'
          }`}
        >
          <Flame size={10} />
          {trendBias.direction.toUpperCase()} {trendBias.confidence}%
        </div>
      )}
      
      <div className="h-4 w-px bg-border" />
      
      {/* Levels Toggle */}
      <button
        onClick={onToggleLevels}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
          showLevels 
            ? 'bg-primary/20 text-primary' 
            : 'bg-muted/50 text-muted-foreground hover:text-foreground'
        }`}
      >
        {showLevels ? <Eye size={12} /> : <EyeOff size={12} />}
        <Target size={10} />
        <span>Levels</span>
        {levelsCount > 0 && (
          <span className="px-1 py-0.5 rounded bg-primary/30 text-[9px]">
            {levelsCount}
          </span>
        )}
      </button>
      
      {/* Zones Toggle */}
      <button
        onClick={onToggleZones}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
          showZones 
            ? 'bg-primary/20 text-primary' 
            : 'bg-muted/50 text-muted-foreground hover:text-foreground'
        }`}
      >
        {showZones ? <Eye size={12} /> : <EyeOff size={12} />}
        <Layers size={10} />
        <span>Zones</span>
        {zonesCount > 0 && (
          <span className="px-1 py-0.5 rounded bg-primary/30 text-[9px]">
            {zonesCount}
          </span>
        )}
      </button>
      
      {/* Clear Button */}
      {(levelsCount > 0 || zonesCount > 0) && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
        >
          <Trash2 size={10} />
          Clear
        </button>
      )}
    </div>
  );
};

export default AnalysisControlPanel;
