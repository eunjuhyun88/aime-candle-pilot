import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Activity, TrendingUp, Zap, MessageSquare } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import AimeSidebar from '@/components/intel/AimeSidebar';
import { InsightData } from '@/pages/Intel';
import ChartAnalysisOverlay from '@/components/chart/ChartAnalysisOverlay';
import AnalysisControlPanel from '@/components/chart/AnalysisControlPanel';
import useChartAnalysis, { ChartAnalysisData } from '@/hooks/useChartAnalysis';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface ContextData {
  price: number;
  time: string;
  whaleFlow: string;
  sentiment: string;
  news: string;
}

const TradingTerminal = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  
  // Candle-Centric Context State
  const [activeContext, setActiveContext] = useState<ContextData | null>(null);
  
  // Chart Analysis Overlay
  const {
    analysisData,
    showLevels,
    showZones,
    setShowLevels,
    setShowZones,
    updateFromAIResponse,
    clearAnalysis,
  } = useChartAnalysis();

  // Get current price from symbol (mock for now)
  const getCurrentPrice = useCallback(() => {
    const prices: Record<string, number> = {
      'BINANCE:BTCUSDT': 64250,
      'BINANCE:ETHUSDT': 3200,
      'BINANCE:SOLUSDT': 145,
    };
    return prices[selectedSymbol] || 64250;
  }, [selectedSymbol]);

  // Candle-Snap Intelligence: 클릭 시 전체 패널 동기화
  const syncAllPanels = useCallback((price: number, time: string) => {
    const contextData: ContextData = {
      price,
      time,
      whaleFlow: `+${(Math.random() * 2000 + 500).toFixed(0)} BTC 유입`,
      sentiment: Math.random() > 0.5 ? 'Bullish 72%' : 'Neutral 54%',
      news: '"BTC 기관 매수세 유입" - Bloomberg',
    };
    
    setActiveContext(contextData);
  }, []);

  const handleInsightUpdate = (data: InsightData) => {
    setInsightData(data);
  };
  
  // Handle AI analysis response for chart overlay
  const handleAnalysisUpdate = useCallback((response: string) => {
    updateFromAIResponse(response, getCurrentPrice());
  }, [updateFromAIResponse, getCurrentPrice]);

  // TradingView Widget 로드
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: container.id,
          autosize: true,
          symbol: selectedSymbol,
          interval: '60',
          timezone: 'Asia/Seoul',
          theme: 'dark',
          style: '1',
          locale: 'ko',
          toolbar_bg: '#161B22',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          withdateranges: true,
          details: true,
          hotlist: true,
          calendar: true,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies', 'Volume@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          backgroundColor: '#0B0E11',
          gridColor: '#161B22',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedSymbol]);

  const AiPanel = (
    <AimeSidebar 
      onUpdate={handleInsightUpdate} 
      onAnalysisResponse={handleAnalysisUpdate}
    />
  );

  return (
    <AppLayout showAiPanel aiPanel={AiPanel}>
      <div className="h-full flex flex-col">
        {/* Chart Toolbar */}
        <div className="h-10 border-b border-border bg-card/50 flex items-center px-3 gap-2 shrink-0">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-muted/50 border border-border text-xs font-bold rounded px-2 py-1 outline-none focus:border-primary"
          >
            <option value="BINANCE:BTCUSDT">BTC/USDT</option>
            <option value="BINANCE:ETHUSDT">ETH/USDT</option>
            <option value="BINANCE:SOLUSDT">SOL/USDT</option>
            <option value="NASDAQ:AAPL">AAPL</option>
            <option value="NASDAQ:TSLA">TSLA</option>
          </select>
          <div className="h-4 w-px bg-border" />
          <div className="flex gap-1">
            {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
              <button
                key={tf}
                className="px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AnalysisControlPanel
              showLevels={showLevels}
              showZones={showZones}
              onToggleLevels={() => setShowLevels(!showLevels)}
              onToggleZones={() => setShowZones(!showZones)}
              onClear={clearAnalysis}
              levelsCount={analysisData.priceLevels.length}
              zonesCount={analysisData.zones.length}
              trendBias={analysisData.trendBias}
            />
            <div className="h-4 w-px bg-border" />
            <button 
              onClick={() => syncAllPanels(getCurrentPrice(), new Date().toLocaleTimeString())}
              className="px-3 py-1 text-[10px] font-bold bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors"
            >
              🐋 Whale Heat
            </button>
          </div>
        </div>
        
        {/* Chart - Takes all remaining space */}
        <div className="relative flex-1 min-h-0 w-full">
          <div 
            id="tradingview_chart" 
            ref={chartContainerRef} 
            className="absolute inset-0 bg-[#0B0E11]"
          />
          
          {/* Chart Analysis Overlay */}
          <ChartAnalysisOverlay
            priceLevels={analysisData.priceLevels}
            zones={analysisData.zones}
            trendBias={analysisData.trendBias}
            currentPrice={getCurrentPrice()}
            priceRange={analysisData.priceRange}
            showLevels={showLevels}
            showZones={showZones}
          />
        </div>

        {/* Bottom Context Bar - Compact */}
        {activeContext && (
          <div className="h-10 border-t border-border bg-card/50 flex items-center px-4 gap-6 text-xs shrink-0">
            <div className="flex items-center gap-2 text-green-500">
              <Activity size={12} />
              <span className="font-mono">{activeContext.whaleFlow}</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Zap size={12} />
              <span>{activeContext.sentiment}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare size={12} />
              <span className="truncate max-w-xs">{activeContext.news}</span>
            </div>
            <span className="ml-auto text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
              Synced: ${activeContext.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TradingTerminal;
