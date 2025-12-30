import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AimeInsights from '@/components/intel/AimeInsights';
import AimeSidebar from '@/components/intel/AimeSidebar';

export interface InsightData {
  type: 'token_analysis' | 'general';
  token?: string;
  symbol?: string;
  price?: number;
  change?: number;
  trend?: 'Bullish' | 'Bearish' | 'Neutral';
  description?: string;
  stats?: {
    tps: string;
    active_wallets: string;
    tvl: string;
  };
  chart_data?: { date: string; price: number }[];
}

const Intel = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleInsightUpdate = (data: InsightData) => {
    setInsightData(data);
  };

  const AiPanel = (
    <AimeSidebar onUpdate={handleInsightUpdate} />
  );

  return (
    <AppLayout showAiPanel aiPanel={AiPanel}>
      <div className="h-full overflow-y-auto">
        <AimeInsights 
          searchQuery={searchQuery} 
          insightData={insightData}
          onClearInsight={() => setInsightData(null)}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
};

export default Intel;
