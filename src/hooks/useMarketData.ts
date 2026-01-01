import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BinanceData {
  price: number;
  volume24h: number;
  priceChange24h: number;
  highPrice24h: number;
  lowPrice24h: number;
}

interface CoingeckoData {
  marketCap: number;
  fdv: number;
  totalVolume: number;
  circulatingSupply: number;
  maxSupply: number | null;
  ath: number;
  athChangePercentage: number;
}

interface DerivativesData {
  openInterest: number;
  fundingRate: number;
  longShortRatio: number;
  liquidations24h: {
    long: number;
    short: number;
  };
}

export interface MarketData {
  symbol: string;
  timestamp: string;
  data: {
    binance?: BinanceData;
    coingecko?: CoingeckoData;
    derivatives?: DerivativesData;
  };
}

interface UseMarketDataReturn {
  fetchMarketData: (symbol: string, dataTypes?: string[]) => Promise<MarketData | null>;
  isLoading: boolean;
  error: string | null;
}

export function useMarketData(): UseMarketDataReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async (
    symbol: string,
    dataTypes?: string[]
  ): Promise<MarketData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('market-data', {
        body: { symbol, dataTypes },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      return data as MarketData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(errorMessage);
      console.error('Market data fetch error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchMarketData,
    isLoading,
    error,
  };
}

// Format helpers for display
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toFixed(4);
  } else {
    return price.toFixed(6);
  }
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
