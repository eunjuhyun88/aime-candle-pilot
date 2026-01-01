import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  binance?: {
    price: number;
    volume24h: number;
    priceChange24h: number;
    highPrice24h: number;
    lowPrice24h: number;
  };
  coingecko?: {
    marketCap: number;
    fdv: number;
    totalVolume: number;
    circulatingSupply: number;
    maxSupply: number | null;
    ath: number;
    athChangePercentage: number;
  };
  derivatives?: {
    openInterest: number;
    fundingRate: number;
    longShortRatio: number;
    liquidations24h: {
      long: number;
      short: number;
    };
  };
}

// Fetch Binance ticker data
async function fetchBinanceData(symbol: string): Promise<MarketData['binance'] | null> {
  try {
    const binanceSymbol = symbol.toUpperCase() + 'USDT';
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`);
    
    if (!response.ok) {
      console.log(`Binance API error for ${symbol}:`, response.status);
      return null;
    }
    
    const data = await response.json();
    return {
      price: parseFloat(data.lastPrice),
      volume24h: parseFloat(data.quoteVolume),
      priceChange24h: parseFloat(data.priceChangePercent),
      highPrice24h: parseFloat(data.highPrice),
      lowPrice24h: parseFloat(data.lowPrice),
    };
  } catch (error) {
    console.error("Binance fetch error:", error);
    return null;
  }
}

// Fetch CoinGecko data
async function fetchCoingeckoData(coinId: string): Promise<MarketData['coingecko'] | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      console.log(`CoinGecko API error for ${coinId}:`, response.status);
      return null;
    }
    
    const data = await response.json();
    const marketData = data.market_data;
    
    return {
      marketCap: marketData.market_cap?.usd || 0,
      fdv: marketData.fully_diluted_valuation?.usd || 0,
      totalVolume: marketData.total_volume?.usd || 0,
      circulatingSupply: marketData.circulating_supply || 0,
      maxSupply: marketData.max_supply,
      ath: marketData.ath?.usd || 0,
      athChangePercentage: marketData.ath_change_percentage?.usd || 0,
    };
  } catch (error) {
    console.error("CoinGecko fetch error:", error);
    return null;
  }
}

// Fetch derivatives data (mock for now - real API would need Coinglass/Coinalyze API key)
async function fetchDerivativesData(symbol: string): Promise<MarketData['derivatives'] | null> {
  try {
    // Using Binance Futures API for basic OI and funding rate
    const binanceSymbol = symbol.toUpperCase() + 'USDT';
    
    const [oiResponse, fundingResponse] = await Promise.all([
      fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${binanceSymbol}`),
      fetch(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${binanceSymbol}&limit=1`)
    ]);
    
    let openInterest = 0;
    let fundingRate = 0;
    
    if (oiResponse.ok) {
      const oiData = await oiResponse.json();
      openInterest = parseFloat(oiData.openInterest);
    }
    
    if (fundingResponse.ok) {
      const fundingData = await fundingResponse.json();
      if (fundingData.length > 0) {
        fundingRate = parseFloat(fundingData[0].fundingRate) * 100;
      }
    }

    // Long/Short ratio from Binance
    const lsResponse = await fetch(
      `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${binanceSymbol}&period=1h&limit=1`
    );
    
    let longShortRatio = 1;
    if (lsResponse.ok) {
      const lsData = await lsResponse.json();
      if (lsData.length > 0) {
        longShortRatio = parseFloat(lsData[0].longShortRatio);
      }
    }
    
    return {
      openInterest,
      fundingRate,
      longShortRatio,
      liquidations24h: {
        long: 0, // Would need Coinglass API for real data
        short: 0,
      },
    };
  } catch (error) {
    console.error("Derivatives fetch error:", error);
    return null;
  }
}

// Symbol to CoinGecko ID mapping
const symbolToCoingeckoId: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'sol': 'solana',
  'bnb': 'binancecoin',
  'xrp': 'ripple',
  'ada': 'cardano',
  'avax': 'avalanche-2',
  'doge': 'dogecoin',
  'dot': 'polkadot',
  'matic': 'matic-network',
  'link': 'chainlink',
  'atom': 'cosmos',
  'uni': 'uniswap',
  'ltc': 'litecoin',
  'near': 'near',
  'apt': 'aptos',
  'arb': 'arbitrum',
  'op': 'optimism',
  'sui': 'sui',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, dataTypes } = await req.json();
    
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedSymbol = symbol.toLowerCase().replace('usdt', '').replace('usd', '');
    const coingeckoId = symbolToCoingeckoId[normalizedSymbol] || normalizedSymbol;
    
    console.log(`Fetching market data for ${normalizedSymbol}...`);

    const result: MarketData = {};
    const types = dataTypes || ['binance', 'coingecko', 'derivatives'];

    // Fetch data in parallel
    const fetchPromises: Promise<void>[] = [];
    
    if (types.includes('binance')) {
      fetchPromises.push(
        fetchBinanceData(normalizedSymbol).then(data => {
          if (data) result.binance = data;
        })
      );
    }
    
    if (types.includes('coingecko')) {
      fetchPromises.push(
        fetchCoingeckoData(coingeckoId).then(data => {
          if (data) result.coingecko = data;
        })
      );
    }
    
    if (types.includes('derivatives')) {
      fetchPromises.push(
        fetchDerivativesData(normalizedSymbol).then(data => {
          if (data) result.derivatives = data;
        })
      );
    }

    await Promise.all(fetchPromises);

    console.log(`Market data fetched for ${normalizedSymbol}:`, JSON.stringify(result));

    return new Response(JSON.stringify({ 
      symbol: normalizedSymbol.toUpperCase(),
      timestamp: new Date().toISOString(),
      data: result 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("market-data error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
