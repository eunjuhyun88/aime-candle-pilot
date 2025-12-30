import React, { useState, useEffect, cloneElement, isValidElement, useRef, useCallback } from 'react';
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
  X,
  GripHorizontal,
  GripVertical
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

const MIN_PANEL_HEIGHT = 150;
const MAX_PANEL_HEIGHT_RATIO = 0.85;
const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 600;
const DEFAULT_PANEL_WIDTH = 340;

const AppLayout = ({ children, showAiPanel = false, aiPanel }: AppLayoutProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileAi, setShowMobileAi] = useState(false);
  const [panelHeight, setPanelHeight] = useState(window.innerHeight * 0.5);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  
  // Mobile vertical drag refs
  const isDraggingY = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);
  
  // Desktop horizontal drag refs
  const isDraggingX = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

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

  // Mobile vertical drag handlers
  const handleDragStartY = useCallback((clientY: number) => {
    isDraggingY.current = true;
    startY.current = clientY;
    startHeight.current = panelHeight;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
  }, [panelHeight]);

  const handleDragMoveY = useCallback((clientY: number) => {
    if (!isDraggingY.current) return;
    const delta = startY.current - clientY;
    const newHeight = Math.min(
      Math.max(startHeight.current + delta, MIN_PANEL_HEIGHT),
      window.innerHeight * MAX_PANEL_HEIGHT_RATIO
    );
    setPanelHeight(newHeight);
  }, []);

  const handleDragEndY = useCallback(() => {
    isDraggingY.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  // Desktop horizontal drag handlers
  const handleDragStartX = useCallback((clientX: number) => {
    isDraggingX.current = true;
    startX.current = clientX;
    startWidth.current = panelWidth;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  }, [panelWidth]);

  const handleDragMoveX = useCallback((clientX: number) => {
    if (!isDraggingX.current) return;
    const delta = startX.current - clientX;
    const newWidth = Math.min(
      Math.max(startWidth.current + delta, MIN_PANEL_WIDTH),
      MAX_PANEL_WIDTH
    );
    setPanelWidth(newWidth);
  }, []);

  const handleDragEndX = useCallback(() => {
    isDraggingX.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      handleDragMoveY(e.clientY);
      handleDragMoveX(e.clientX);
    };
    const onMouseUp = () => {
      handleDragEndY();
      handleDragEndX();
    };
    const onTouchMove = (e: TouchEvent) => {
      handleDragMoveY(e.touches[0].clientY);
      handleDragMoveX(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      handleDragEndY();
      handleDragEndX();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleDragMoveY, handleDragEndY, handleDragMoveX, handleDragEndX]);

  return (
    <div className="h-screen bg-background text-foreground font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "h-full bg-card border-r border-border flex flex-col transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-52"
        )}
      >
        {/* Logo + Collapse Toggle */}
        <div className="h-14 border-b border-border flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
              <TrendingUp size={16} className="text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-black tracking-tight whitespace-nowrap">STOCKHOO</span>
            )}
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                <span className="font-medium">{collapsed ? 'Expand' : 'Collapse'}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
                onClick={() => {
                  setShowMobileAi(true);
                  setPanelHeight(window.innerHeight * 0.5);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium"
              >
                <Sparkles size={12} />
                AI
              </button>
            )}
          </div>
        </header>

        {/* Content + AI Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            showAiPanel && isMobile && showMobileAi ? `pb-[${panelHeight}px]` : ""
          )}
          style={showAiPanel && isMobile && showMobileAi ? { paddingBottom: panelHeight } : undefined}
          >
            {children}
          </main>

          {/* AI Panel (Desktop) - Resizable */}
          {showAiPanel && !isMobile && aiPanel && (
            <>
              {/* Drag Handle */}
              <div
                className="w-1 hover:w-1.5 bg-border hover:bg-primary/50 cursor-ew-resize transition-all shrink-0 group flex items-center justify-center"
                onMouseDown={(e) => handleDragStartX(e.clientX)}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={10} className="text-primary" />
                </div>
              </div>
              <aside 
                className="border-l border-border bg-card shrink-0 flex flex-col overflow-hidden"
                style={{ width: panelWidth }}
              >
                {aiPanel}
              </aside>
            </>
          )}
        </div>
      </div>

      {/* Mobile AI Panel - Resizable Bottom Sheet */}
      {showAiPanel && isMobile && showMobileAi && (
        <div 
          className="fixed left-0 right-0 bottom-0 bg-card border-t border-border z-50 flex flex-col"
          style={{ height: panelHeight }}
        >
          {/* Drag Handle */}
          <div 
            className="h-6 border-b border-border flex items-center justify-center cursor-ns-resize touch-none select-none shrink-0 hover:bg-muted/30 transition-colors"
            onMouseDown={(e) => handleDragStartY(e.clientY)}
            onTouchStart={(e) => handleDragStartY(e.touches[0].clientY)}
          >
            <GripHorizontal size={14} className="text-muted-foreground" />
          </div>
          
          {/* Header */}
          <div className="h-10 border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm font-medium">Alpha Agent</span>
            </div>
            <button 
              onClick={() => setShowMobileAi(false)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {isValidElement(aiPanel) 
              ? cloneElement(aiPanel as React.ReactElement<{ hideHeader?: boolean }>, { hideHeader: true })
              : aiPanel
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
