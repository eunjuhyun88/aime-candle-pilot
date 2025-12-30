import { useState } from 'react';

interface WhaleZone {
  id: string;
  top: number;
  height: number;
  label: string;
  intensity: 'high' | 'medium' | 'low';
}

interface SupportResistance {
  id: string;
  y: number;
  price: string;
  type: 'support' | 'resistance';
}

interface ChartOverlayProps {
  whaleZones: WhaleZone[];
  srLines: SupportResistance[];
  showWhaleHeat: boolean;
  showSR: boolean;
}

export const ChartOverlay = ({ whaleZones, srLines, showWhaleHeat, showSR }: ChartOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Whale Heat Zones */}
      {showWhaleHeat && whaleZones.map((zone, index) => (
        <div
          key={zone.id}
          className="absolute left-0 w-full whale-zone-glow animate-fade-in"
          style={{ 
            top: `${zone.top}%`, 
            height: `${zone.height}%`,
            animationDelay: `${index * 0.1}s`
          }}
        >
          <div 
            className={`h-full border-y transition-all duration-500 ${
              zone.intensity === 'high' 
                ? 'bg-primary/15 border-primary/40' 
                : zone.intensity === 'medium'
                ? 'bg-primary/10 border-primary/25'
                : 'bg-primary/5 border-primary/15'
            }`}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full signal-pulse ${
                zone.intensity === 'high' ? 'bg-primary' : 'bg-primary/50'
              }`} />
              <span className="text-[10px] font-mono text-primary/60 uppercase tracking-wider">
                {zone.label}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Support/Resistance Lines */}
      {showSR && srLines.map((line, index) => (
        <div
          key={line.id}
          className="absolute left-0 w-full animate-fade-in"
          style={{ 
            top: `${line.y}%`,
            animationDelay: `${index * 0.05}s`
          }}
        >
          <div className="relative">
            <div 
              className={`h-[1px] w-full ${
                line.type === 'resistance' 
                  ? 'bg-gradient-to-r from-signal-red/60 via-signal-red to-signal-red/60' 
                  : 'bg-gradient-to-r from-signal-green/60 via-signal-green to-signal-green/60'
              }`}
              style={{ 
                boxShadow: line.type === 'resistance' 
                  ? '0 0 10px hsl(var(--signal-red) / 0.3)' 
                  : '0 0 10px hsl(var(--signal-green) / 0.3)'
              }}
            />
            <div 
              className={`absolute right-4 -top-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                line.type === 'resistance'
                  ? 'bg-signal-red/20 text-signal-red border border-signal-red/30'
                  : 'bg-signal-green/20 text-signal-green border border-signal-green/30'
              }`}
            >
              {line.type === 'resistance' ? 'R' : 'S'} ${line.price}
            </div>
          </div>
        </div>
      ))}

      {/* AI Prediction Path */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--signal-green))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--signal-green))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--signal-green))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path 
          d="M 60% 55% Q 70% 48%, 80% 50% T 95% 40%" 
          stroke="url(#pathGradient)" 
          strokeWidth="2" 
          strokeDasharray="8 4" 
          fill="none"
          className="animate-pulse"
        />
        <circle cx="95%" cy="40%" r="4" fill="hsl(var(--signal-green))" className="animate-pulse" />
      </svg>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};
