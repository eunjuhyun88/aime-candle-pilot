import { useState, useCallback } from 'react';
import { PriceLevel, AnalysisZone, TrendBias } from '@/components/chart/ChartAnalysisOverlay';

export interface ChartAnalysisData {
  priceLevels: PriceLevel[];
  zones: AnalysisZone[];
  trendBias?: TrendBias;
  priceRange?: { high: number; low: number };
}

// Parse AI response to extract price levels and zones
export const parseAnalysisResponse = (
  response: string,
  currentPrice?: number
): ChartAnalysisData => {
  const priceLevels: PriceLevel[] = [];
  const zones: AnalysisZone[] = [];
  let trendBias: TrendBias | undefined;

  // Extract trend bias
  const bullishMatch = response.match(/(?:bullish|강세|상승)\s*[:\-]?\s*(\d{1,3})%?/i);
  const bearishMatch = response.match(/(?:bearish|약세|하락)\s*[:\-]?\s*(\d{1,3})%?/i);
  
  if (bullishMatch) {
    trendBias = {
      direction: 'bullish',
      confidence: parseInt(bullishMatch[1]) || 70,
      timeframe: '4H'
    };
  } else if (bearishMatch) {
    trendBias = {
      direction: 'bearish',
      confidence: parseInt(bearishMatch[1]) || 70,
      timeframe: '4H'
    };
  }

  // Extract price levels using various patterns
  const pricePatterns = [
    // Support patterns
    { regex: /(?:지지|support|서포트)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'support' as const },
    { regex: /(?:S1|S2|S3)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'support' as const },
    // Resistance patterns  
    { regex: /(?:저항|resistance|레지스턴스)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'resistance' as const },
    { regex: /(?:R1|R2|R3)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'resistance' as const },
    // Entry patterns
    { regex: /(?:진입|entry|엔트리)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'entry' as const },
    // Target patterns
    { regex: /(?:목표|target|타겟|TP)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'target' as const },
    // Stop loss patterns
    { regex: /(?:손절|stop|스탑|SL)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'stop' as const },
    // Liquidation patterns
    { regex: /(?:청산|liquidation|liq)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'liquidation' as const },
    // Whale zone patterns
    { regex: /(?:고래|whale)\s*[:\-]?\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'whale' as const },
  ];

  let levelId = 0;
  pricePatterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(response)) !== null) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price > 0) {
        // Avoid duplicates
        if (!priceLevels.some(l => Math.abs(l.price - price) < price * 0.001)) {
          priceLevels.push({
            id: `level-${levelId++}`,
            price,
            type,
            label: type.toUpperCase(),
            strength: 'medium',
          });
        }
      }
    }
  });

  // Extract zone patterns
  const zonePatterns = [
    { regex: /(?:매집|accumulation|acc)\s*(?:구간|zone)?[:\-]?\s*\$?([\d,]+(?:\.\d+)?)\s*[-~]\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'accumulation' as const },
    { regex: /(?:분배|distribution|dist)\s*(?:구간|zone)?[:\-]?\s*\$?([\d,]+(?:\.\d+)?)\s*[-~]\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'distribution' as const },
    { regex: /(?:수요|demand|dmz)\s*(?:구간|zone)?[:\-]?\s*\$?([\d,]+(?:\.\d+)?)\s*[-~]\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'demand' as const },
    { regex: /(?:공급|supply|spz)\s*(?:구간|zone)?[:\-]?\s*\$?([\d,]+(?:\.\d+)?)\s*[-~]\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'supply' as const },
    { regex: /(?:유동성|liquidity|liq)\s*(?:구간|zone)?[:\-]?\s*\$?([\d,]+(?:\.\d+)?)\s*[-~]\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'liquidity' as const },
    { regex: /(?:고래|whale)\s*(?:구간|zone)?[:\-]?\s*\$?([\d,]+(?:\.\d+)?)\s*[-~]\s*\$?([\d,]+(?:\.\d+)?)/gi, type: 'whale' as const },
  ];

  let zoneId = 0;
  zonePatterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(response)) !== null) {
      const fromPrice = parseFloat(match[1].replace(/,/g, ''));
      const toPrice = parseFloat(match[2].replace(/,/g, ''));
      if (!isNaN(fromPrice) && !isNaN(toPrice)) {
        zones.push({
          id: `zone-${zoneId++}`,
          fromPrice: Math.min(fromPrice, toPrice),
          toPrice: Math.max(fromPrice, toPrice),
          type,
          label: `$${Math.min(fromPrice, toPrice).toLocaleString()} - $${Math.max(fromPrice, toPrice).toLocaleString()}`,
          intensity: 'medium',
        });
      }
    }
  });

  // Calculate price range from extracted data
  let priceRange: { high: number; low: number } | undefined;
  const allPrices = [
    ...priceLevels.map(l => l.price),
    ...zones.flatMap(z => [z.fromPrice, z.toPrice]),
  ];
  
  if (allPrices.length > 0) {
    const buffer = 0.05; // 5% buffer
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    priceRange = {
      low: minPrice * (1 - buffer),
      high: maxPrice * (1 + buffer),
    };
  }

  return { priceLevels, zones, trendBias, priceRange };
};

export const useChartAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<ChartAnalysisData>({
    priceLevels: [],
    zones: [],
  });
  const [showLevels, setShowLevels] = useState(true);
  const [showZones, setShowZones] = useState(true);

  const updateFromAIResponse = useCallback((response: string, currentPrice?: number) => {
    const parsed = parseAnalysisResponse(response, currentPrice);
    
    // Only update if we found meaningful data
    if (parsed.priceLevels.length > 0 || parsed.zones.length > 0 || parsed.trendBias) {
      setAnalysisData(prev => ({
        priceLevels: [...prev.priceLevels, ...parsed.priceLevels].slice(-10), // Keep last 10
        zones: [...prev.zones, ...parsed.zones].slice(-5), // Keep last 5
        trendBias: parsed.trendBias || prev.trendBias,
        priceRange: parsed.priceRange || prev.priceRange,
      }));
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisData({
      priceLevels: [],
      zones: [],
    });
  }, []);

  const addPriceLevel = useCallback((level: Omit<PriceLevel, 'id'>) => {
    setAnalysisData(prev => ({
      ...prev,
      priceLevels: [...prev.priceLevels, { ...level, id: `manual-${Date.now()}` }],
    }));
  }, []);

  const addZone = useCallback((zone: Omit<AnalysisZone, 'id'>) => {
    setAnalysisData(prev => ({
      ...prev,
      zones: [...prev.zones, { ...zone, id: `manual-${Date.now()}` }],
    }));
  }, []);

  return {
    analysisData,
    showLevels,
    showZones,
    setShowLevels,
    setShowZones,
    updateFromAIResponse,
    clearAnalysis,
    addPriceLevel,
    addZone,
  };
};

export default useChartAnalysis;
