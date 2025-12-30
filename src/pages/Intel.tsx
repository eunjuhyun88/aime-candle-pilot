import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TrendingUp, Star, BarChart3, Eye, Globe, MessageSquare } from 'lucide-react';
import AimeInsights from '@/components/intel/AimeInsights';
import AimeSidebar from '@/components/intel/AimeSidebar';
import Scanner from '@/components/intel/Scanner';
import Watchlist from '@/components/intel/Watchlist';
import Macro from '@/components/intel/Macro';

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

const tabs = [
  { id: 'intelligence', label: 'Intelligence', icon: Star },
  { id: 'scanner', label: 'Scanner', icon: BarChart3 },
  { id: 'watchlist', label: 'Watchlist', icon: Eye },
  { id: 'macro', label: 'Macro', icon: Globe },
];

const Intel = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('intelligence');
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleInsightUpdate = (data: InsightData) => {
    setInsightData(data);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'intelligence':
        return (
          <AimeInsights 
            searchQuery={searchQuery} 
            insightData={insightData}
            onClearInsight={() => setInsightData(null)}
            isLoading={isLoading}
          />
        );
      case 'scanner':
        return <Scanner />;
      case 'watchlist':
        return <Watchlist />;
      case 'macro':
        return <Macro />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <TrendingUp size={16} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight">STOCKHOO</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors">
              Trading
            </Link>
            <Link to="/intel" className="px-3 py-1.5 text-xs font-medium text-foreground bg-primary/10 rounded">
              Intel
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="h-12 border-b border-border bg-card/50 flex items-center px-4 gap-2 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {isMobile ? (
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
          
          {/* Mobile Chat Widget */}
          {!showMobileChat && (
            <button
              onClick={() => setShowMobileChat(true)}
              className="fixed bottom-4 right-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg z-50"
            >
              <MessageSquare size={18} />
              <span className="text-sm font-medium">Chat with AI</span>
            </button>
          )}
          
          {showMobileChat && (
            <div className="fixed bottom-0 left-0 right-0 h-[50vh] bg-card border-t border-border z-50 animate-slide-up flex flex-col">
              <div 
                className="h-10 border-b border-border flex items-center justify-between px-4 cursor-pointer"
                onClick={() => setShowMobileChat(false)}
              >
                <span className="text-sm font-medium">Aime Copilot</span>
                <span className="text-xs text-muted-foreground">Tap to close</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <AimeSidebar onUpdate={handleInsightUpdate} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={65} minSize={50} maxSize={80}>
            <div className="h-full overflow-y-auto">
              {renderTabContent()}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={35} minSize={25} maxSize={45}>
            <AimeSidebar onUpdate={handleInsightUpdate} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default Intel;
