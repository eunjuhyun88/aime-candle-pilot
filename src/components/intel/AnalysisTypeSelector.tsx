import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Activity, 
  BarChart3, 
  Target, 
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type AnalysisType = 
  | 'htf-ltf' 
  | 'valuation' 
  | 'onchain' 
  | 'vpa' 
  | 'ict' 
  | 'wyckoff';

interface AnalysisTypeOption {
  id: AnalysisType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  prompt: string;
}

interface AnalysisTypeColors {
  bg: string;
  bgSelected: string;
  text: string;
  border: string;
}

const analysisColors: Record<AnalysisType, AnalysisTypeColors> = {
  'htf-ltf': {
    bg: 'bg-blue-500/10',
    bgSelected: 'bg-blue-500',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  'valuation': {
    bg: 'bg-amber-500/10',
    bgSelected: 'bg-amber-500',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  'onchain': {
    bg: 'bg-purple-500/10',
    bgSelected: 'bg-purple-500',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  'vpa': {
    bg: 'bg-emerald-500/10',
    bgSelected: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  'ict': {
    bg: 'bg-rose-500/10',
    bgSelected: 'bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  'wyckoff': {
    bg: 'bg-cyan-500/10',
    bgSelected: 'bg-cyan-500',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
};

export const analysisTypes: AnalysisTypeOption[] = [
  {
    id: 'htf-ltf',
    label: 'HTF→LTF 탑다운',
    shortLabel: 'HTF→LTF',
    icon: TrendingUp,
    description: '고시간프레임에서 저시간프레임 분석',
    prompt: 'HTF에서 LTF로의 탑다운 분석을 진행해줘. Weekly, Daily, 4H, 1H 순서로 추세와 구조를 분석하고, 현재 진입 가능한 구간인지 판단해줘.',
  },
  {
    id: 'valuation',
    label: '코인 밸류에이션',
    shortLabel: 'Valuation',
    icon: Coins,
    description: 'Mcap, FDV, TVL, Unlock 분석',
    prompt: '코인 밸류에이션 분석을 진행해줘. Market Cap, FDV, TVL, 토큰 언락 스케줄, 유통량 대비 총 공급량을 분석하고 현재 가격이 고평가인지 저평가인지 판단해줘.',
  },
  {
    id: 'onchain',
    label: '온체인 데이터',
    shortLabel: 'On-chain',
    icon: Activity,
    description: 'CVD, OI, Funding, 청산 분석',
    prompt: '온체인 및 파생상품 데이터 분석을 진행해줘. CVD(누적거래량델타), OI(미결제약정), Funding Rate, 롱숏 비율, 청산 데이터를 분석하고 시장 심리를 판단해줘.',
  },
  {
    id: 'vpa',
    label: 'VPA 거래량',
    shortLabel: 'VPA',
    icon: BarChart3,
    description: '거래량 가격 분석',
    prompt: 'VPA(Volume Price Analysis) 분석을 진행해줘. 거래량과 가격의 관계, 매집/분산 구간, 거래량 이상 징후를 분석하고 스마트머니의 움직임을 파악해줘.',
  },
  {
    id: 'ict',
    label: 'ICT 분석',
    shortLabel: 'ICT',
    icon: Target,
    description: '유동성 구간 및 Price Action',
    prompt: 'ICT 분석을 진행해줘. 유동성 풀(Liquidity Pool), FVG(Fair Value Gap), Order Block, BOS/CHoCH를 분석하고 스마트머니가 노리는 유동성 구간을 파악해줘.',
  },
  {
    id: 'wyckoff',
    label: 'Wyckoff',
    shortLabel: 'Wyckoff',
    icon: Layers,
    description: '매집/분산 사이클 분석',
    prompt: 'Wyckoff 분석을 진행해줘. 현재 어떤 페이즈(Accumulation/Distribution/Markup/Markdown)에 있는지, Spring/UTAD 같은 이벤트가 있었는지, 다음 예상 움직임을 분석해줘.',
  },
];

interface AnalysisTypeSelectorProps {
  selectedType: AnalysisType | null;
  onSelect: (type: AnalysisType) => void;
  disabled?: boolean;
  compact?: boolean;
}

const AnalysisTypeSelector: React.FC<AnalysisTypeSelectorProps> = ({
  selectedType,
  onSelect,
  disabled = false,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          const colors = analysisColors[type.id];
          
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              disabled={disabled}
              className={cn(
                "flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] rounded-lg transition-all border",
                isSelected
                  ? `${colors.bgSelected} text-white border-transparent`
                  : `${colors.bg} ${colors.text} ${colors.border} hover:opacity-80`,
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon size={11} />
              <span className="truncate">{type.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {analysisTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-start p-3 rounded-xl border transition-all text-left",
              isSelected
                ? "bg-primary/10 border-primary"
                : "bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <Icon size={14} />
              </div>
              <span className="text-xs font-medium">{type.shortLabel}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {type.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default AnalysisTypeSelector;
