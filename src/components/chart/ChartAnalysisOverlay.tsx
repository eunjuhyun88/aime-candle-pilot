import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Shield, Flame, Activity } from 'lucide-react';

export interface PriceLevel {
  id: string;
  price: number;
  type: 'support' | 'resistance' | 'entry' | 'target' | 'stop' | 'liquidation' | 'whale';
  label: string;
  strength?: 'strong' | 'medium' | 'weak';
  y?: number;
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
  support: { color: 'hsl(142, 71%, 45%)', label: 'S', icon: Shield },
  resistance: { color: 'hsl(0, 84%, 60%)', label: 'R', icon: AlertTriangle },
  entry: { color: 'hsl(199, 89%, 48%)', label: 'E', icon: Target },
  target: { color: 'hsl(142, 71%, 45%)', label: 'TP', icon: TrendingUp },
  stop: { color: 'hsl(0, 84%, 60%)', label: 'SL', icon: TrendingDown },
  liquidation: { color: 'hsl(38, 92%, 50%)', label: 'LIQ', icon: Flame },
  whale: { color: 'hsl(262, 83%, 58%)', label: 'W', icon: Activity },
};

const zoneStyles = {
  accumulation: { color: 'hsl(142, 71%, 45%)', label: 'ACC' },
  distribution: { color: 'hsl(0, 84%, 60%)', label: 'DIST' },
  demand: { color: 'hsl(160, 84%, 40%)', label: 'DMD' },
  supply: { color: 'hsl(0, 70%, 55%)', label: 'SPL' },
  whale: { color: 'hsl(262, 83%, 58%)', label: 'WHALE' },
  liquidity: { color: 'hsl(199, 89%, 48%)', label: 'LIQ' },
};

export const ChartAnalysisOverlay: React.FC<ChartAnalysisOverlayProps> = ({
  priceLevels,
  zones,
  trendBias,
  showLevels,
  showZones,
}) => {
  // Only render on right side - no chart price-based positioning
  const sortedLevels = [...priceLevels].sort((a, b) => b.price - a.price);
  const sortedZones = [...zones].sort((a, b) => b.toPrice - a.toPrice);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      {/* Trend Bias Indicator - Top Left */}
      {trendBias && (
        <div className="absolute top-3 left-3 pointer-events-auto z-10">
          <div 
            className={`px-3 py-1.5 rounded-lg backdrop-blur-md border flex items-center gap-2 shadow-lg ${
              trendBias.direction === 'bullish' 
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : trendBias.direction === 'bearish'
                ? 'bg-red-500/20 border-red-500/50 text-red-400'
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
              {trendBias.direction === 'bullish' ? '상승' : trendBias.direction === 'bearish' ? '하락' : '중립'} {trendBias.confidence}%
            </span>
            <span className="text-[10px] opacity-70">{trendBias.timeframe}</span>
          </div>
        </div>
      )}

      {/* Right Side Panel - Price Levels */}
      {showLevels && sortedLevels.length > 0 && (
        <div className="absolute right-3 top-14 flex flex-col gap-1.5 z-10">
          {sortedLevels.slice(0, 6).map((level) => {
            const style = levelStyles[level.type];
            const Icon = style.icon;
            
            return (
              <div
                key={level.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg backdrop-blur-md border shadow-sm pointer-events-auto transition-all hover:scale-105"
                style={{ 
                  backgroundColor: `${style.color}20`,
                  borderColor: `${style.color}50`,
                }}
              >
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${style.color}30` }}
                >
                  <Icon size={11} style={{ color: style.color }} />
                </div>
                <div className="flex flex-col">
                  <span 
                    className="text-[10px] font-bold font-mono"
                    style={{ color: style.color }}
                  >
                    ${level.price.toLocaleString()}
                  </span>
                  <span className="text-[8px] text-muted-foreground uppercase">
                    {level.label || style.label}
                  </span>
                </div>
                {level.strength && (
                  <div className="flex gap-0.5 ml-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-2 rounded-sm"
                        style={{ 
                          backgroundColor: i <= (level.strength === 'strong' ? 3 : level.strength === 'medium' ? 2 : 1) 
                            ? style.color 
                            : `${style.color}30` 
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Zone Legend */}
      {showZones && sortedZones.length > 0 && (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
          {sortedZones.map((zone) => {
            const style = zoneStyles[zone.type];
            
            return (
              <div
                key={zone.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md backdrop-blur-md border pointer-events-auto transition-all hover:scale-105"
                style={{ 
                  backgroundColor: `${style.color}15`,
                  borderColor: `${style.color}40`,
                }}
              >
                {zone.intensity === 'high' && (
                  <div 
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: style.color }}
                  />
                )}
                <span 
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: style.color }}
                >
                  {style.label}
                </span>
                <span 
                  className="text-[8px] font-mono opacity-70"
                  style={{ color: style.color }}
                >
                  ${zone.fromPrice.toLocaleString()}-${zone.toPrice.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle scan line animation */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 3px)',
          animation: 'scanline 8s linear infinite',
        }}
      />
      
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default ChartAnalysisOverlay;
