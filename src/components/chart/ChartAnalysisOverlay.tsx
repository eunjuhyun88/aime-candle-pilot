import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Shield, Flame, Activity } from 'lucide-react';

export interface PriceLevel {
  id: string;
  price: number;
  type: 'support' | 'resistance' | 'entry' | 'target' | 'stop' | 'liquidation' | 'whale';
  label: string;
  strength?: 'strong' | 'medium' | 'weak';
  y?: number; // Percentage from top
}

export interface AnalysisZone {
  id: string;
  fromPrice: number;
  toPrice: number;
  type: 'accumulation' | 'distribution' | 'demand' | 'supply' | 'whale' | 'liquidity';
  label: string;
  intensity: 'high' | 'medium' | 'low';
  topPercent?: number;
  heightPercent?: number;
}

export interface TrendBias {
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeframe: string;
}

export interface ChartAnalysisOverlayProps {
  priceLevels: PriceLevel[];
  zones: AnalysisZone[];
  trendBias?: TrendBias;
  currentPrice?: number;
  priceRange?: { high: number; low: number };
  showLevels: boolean;
  showZones: boolean;
}

const levelStyles = {
  support: { color: 'hsl(var(--signal-green))', bgColor: 'hsl(var(--signal-green) / 0.15)', icon: Shield },
  resistance: { color: 'hsl(var(--signal-red))', bgColor: 'hsl(var(--signal-red) / 0.15)', icon: AlertTriangle },
  entry: { color: 'hsl(var(--primary))', bgColor: 'hsl(var(--primary) / 0.2)', icon: Target },
  target: { color: 'hsl(var(--signal-green))', bgColor: 'hsl(var(--signal-green) / 0.2)', icon: TrendingUp },
  stop: { color: 'hsl(var(--signal-red))', bgColor: 'hsl(var(--signal-red) / 0.2)', icon: TrendingDown },
  liquidation: { color: 'hsl(38, 92%, 50%)', bgColor: 'hsl(38, 92%, 50% / 0.2)', icon: Flame },
  whale: { color: 'hsl(var(--primary))', bgColor: 'hsl(var(--primary) / 0.15)', icon: Activity },
};

const zoneStyles = {
  accumulation: { color: 'hsl(var(--signal-green))', label: 'ACC' },
  distribution: { color: 'hsl(var(--signal-red))', label: 'DIST' },
  demand: { color: 'hsl(160, 84%, 45%)', label: 'DMD' },
  supply: { color: 'hsl(0, 84%, 60%)', label: 'SPL' },
  whale: { color: 'hsl(var(--primary))', label: 'WHALE' },
  liquidity: { color: 'hsl(200, 98%, 55%)', label: 'LIQ' },
};

export const ChartAnalysisOverlay: React.FC<ChartAnalysisOverlayProps> = ({
  priceLevels,
  zones,
  trendBias,
  currentPrice,
  priceRange,
  showLevels,
  showZones,
}) => {
  // Calculate Y position for a price level
  const calculateY = (price: number): number => {
    if (!priceRange || priceRange.high === priceRange.low) return 50;
    const range = priceRange.high - priceRange.low;
    return ((priceRange.high - price) / range) * 100;
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      {/* Trend Bias Indicator */}
      {trendBias && (
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-auto animate-fade-in">
          <div 
            className={`px-3 py-1.5 rounded-lg backdrop-blur-sm border flex items-center gap-2 ${
              trendBias.direction === 'bullish' 
                ? 'bg-signal-green/20 border-signal-green/40 text-signal-green'
                : trendBias.direction === 'bearish'
                ? 'bg-signal-red/20 border-signal-red/40 text-signal-red'
                : 'bg-muted/50 border-border text-muted-foreground'
            }`}
          >
            {trendBias.direction === 'bullish' ? (
              <TrendingUp size={14} />
            ) : trendBias.direction === 'bearish' ? (
              <TrendingDown size={14} />
            ) : (
              <Activity size={14} />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {trendBias.direction} {trendBias.confidence}%
            </span>
            <span className="text-[10px] opacity-70">{trendBias.timeframe}</span>
          </div>
        </div>
      )}

      {/* Analysis Zones */}
      {showZones && zones.map((zone, index) => {
        const style = zoneStyles[zone.type];
        // Use explicit positioning if provided
        const topPercent = zone.topPercent ?? (priceRange ? calculateY(zone.toPrice) : (15 + index * 20));
        const heightPercent = zone.heightPercent ?? (priceRange 
          ? Math.abs(calculateY(zone.fromPrice) - calculateY(zone.toPrice)) 
          : 10);
        
        return (
          <div
            key={zone.id}
            className="absolute left-0 w-full animate-fade-in"
            style={{ 
              top: `${Math.max(0, Math.min(85, topPercent))}%`, 
              height: `${Math.max(5, heightPercent)}%`,
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div 
              className="h-full border-y transition-all duration-500"
              style={{ 
                backgroundColor: `${style.color.replace(')', ' / 0.08)')}`,
                borderColor: `${style.color.replace(')', ` / ${zone.intensity === 'high' ? '0.4' : zone.intensity === 'medium' ? '0.25' : '0.15'})`)}`,
                boxShadow: zone.intensity === 'high' 
                  ? `inset 0 0 30px ${style.color.replace(')', ' / 0.1)')}`
                  : 'none'
              }}
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {zone.intensity === 'high' && (
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: style.color }}
                  />
                )}
                <span 
                  className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ 
                    color: style.color,
                    backgroundColor: `${style.color.replace(')', ' / 0.15)')}`
                  }}
                >
                  {style.label}
                </span>
                <span className="text-[10px] font-mono opacity-60" style={{ color: style.color }}>
                  {zone.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Price Levels */}
      {showLevels && priceLevels.map((level, index) => {
        const style = levelStyles[level.type];
        const Icon = style.icon;
        // Use y if provided, otherwise calculate from priceRange
        const yPos = level.y ?? (priceRange ? calculateY(level.price) : (15 + index * 18));
        
        return (
          <div
            key={level.id}
            className="absolute left-0 w-full animate-fade-in"
            style={{ 
              top: `${Math.max(5, Math.min(90, yPos))}%`,
              animationDelay: `${index * 0.03}s`
            }}
          >
            <div className="relative">
              {/* Line */}
              <div 
                className="h-[1px] w-full"
                style={{ 
                  background: `linear-gradient(90deg, transparent 0%, ${style.color} 20%, ${style.color} 80%, transparent 100%)`,
                  boxShadow: `0 0 8px ${style.color.replace(')', ' / 0.3)')}`
                }}
              />
              
              {/* Label */}
              <div 
                className="absolute right-4 -top-3 px-2 py-0.5 rounded flex items-center gap-1.5 backdrop-blur-sm"
                style={{ 
                  backgroundColor: style.bgColor,
                  border: `1px solid ${style.color.replace(')', ' / 0.4)')}`
                }}
              >
                <Icon size={10} style={{ color: style.color }} />
                <span 
                  className="text-[9px] font-mono font-bold"
                  style={{ color: style.color }}
                >
                  ${level.price.toLocaleString()}
                </span>
                {level.label && (
                  <span 
                    className="text-[8px] opacity-70 uppercase"
                    style={{ color: style.color }}
                  >
                    {level.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Current Price Marker */}
      {currentPrice && priceRange && (
        <div
          className="absolute left-0 w-full animate-pulse"
          style={{ top: `${calculateY(currentPrice)}%` }}
        >
          <div className="relative">
            <div 
              className="h-[2px] w-full"
              style={{ 
                background: 'linear-gradient(90deg, transparent 0%, hsl(var(--foreground)) 50%, transparent 100%)',
              }}
            />
            <div className="absolute left-4 -top-3 px-2 py-0.5 rounded bg-foreground text-background text-[9px] font-mono font-bold">
              ${currentPrice.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default ChartAnalysisOverlay;
