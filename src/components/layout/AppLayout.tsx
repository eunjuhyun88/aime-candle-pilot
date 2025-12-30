import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Newspaper, 
  Eye, 
  Globe, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const mainNav: NavItem[] = [
  { id: 'trading', label: 'Trading', icon: TrendingUp, path: '/' },
  { id: 'intel', label: 'Intelligence', icon: Newspaper, path: '/intel' },
  { id: 'scanner', label: 'Scanner', icon: BarChart3, path: '/scanner' },
  { id: 'watchlist', label: 'Watchlist', icon: Eye, path: '/watchlist' },
  { id: 'macro', label: 'Macro', icon: Globe, path: '/macro' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  showAiPanel?: boolean;
  aiPanel?: React.ReactNode;
}

const AppLayout = ({ children, showAiPanel = false, aiPanel }: AppLayoutProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileAi, setShowMobileAi] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen bg-background text-foreground font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "h-full bg-card border-r border-border flex flex-col transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-52"
        )}
      >
        {/* Logo */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-black tracking-tight whitespace-nowrap">STOCKHOO</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          <TooltipProvider delayDuration={0}>
            {mainNav.map((item) => {
              const isActive = location.pathname === item.path;
              const navLink = (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                    collapsed ? "justify-center" : "",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      {navLink}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                      <span className="font-medium">{item.label}</span>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navLink;
            })}
          </TooltipProvider>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 border-b border-border bg-card/50 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">BTC/USDT</span>
            <span className="text-green-500 font-bold text-sm">$64,250.50</span>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">+2.4%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live</span>
            </div>
            {showAiPanel && isMobile && (
              <button
                onClick={() => setShowMobileAi(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium"
              >
                <Sparkles size={12} />
                AI
              </button>
            )}
          </div>
        </header>

        {/* Content + AI Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* AI Panel (Desktop) */}
          {showAiPanel && !isMobile && aiPanel && (
            <aside className="w-80 border-l border-border bg-card shrink-0 flex flex-col overflow-hidden">
              {aiPanel}
            </aside>
          )}
        </div>
      </div>

      {/* Mobile AI Panel */}
      {showAiPanel && isMobile && showMobileAi && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileAi(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 h-[70vh] bg-card border-t border-border rounded-t-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-10 border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-sm font-medium">Aime Copilot</span>
              </div>
              <button 
                onClick={() => setShowMobileAi(false)}
                className="text-xs text-muted-foreground"
              >
                Close
              </button>
            </div>
            <div className="h-[calc(70vh-40px)] overflow-hidden">
              {aiPanel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
