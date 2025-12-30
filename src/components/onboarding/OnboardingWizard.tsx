import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TradingProfile } from '@/hooks/useTradingProfile';
import { 
  User, TrendingUp, Shield, Settings, History, 
  Target, AlertTriangle, ChevronRight, ChevronLeft, 
  Plus, X, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingWizardProps {
  onComplete: (profile: Partial<TradingProfile>) => void;
  initialData?: TradingProfile | null;
}

const STEPS = [
  { id: 'profile', title: '기본 프로필', icon: User },
  { id: 'style', title: '매매 스타일', icon: TrendingUp },
  { id: 'risk', title: '리스크 관리', icon: Shield },
  { id: 'rules', title: '나만의 규칙', icon: Settings },
  { id: 'experience', title: '과거 경험', icon: History },
  { id: 'preferences', title: '선호 설정', icon: Sparkles },
  { id: 'hard-rules', title: '절대 금지', icon: AlertTriangle },
  { id: 'goals', title: '목표 설정', icon: Target },
];

export function OnboardingWizard({ onComplete, initialData }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<TradingProfile>>({
    trader_nickname: initialData?.trader_nickname || '',
    experience_level: initialData?.experience_level || 'beginner',
    trader_type: initialData?.trader_type || 'hobby',
    trading_style: initialData?.trading_style || 'swing',
    preferred_direction: initialData?.preferred_direction || 'both',
    leverage_preference: initialData?.leverage_preference || 'none',
    primary_assets: initialData?.primary_assets || ['BTC', 'ETH'],
    excluded_assets: initialData?.excluded_assets || [],
    max_risk_per_trade: initialData?.max_risk_per_trade || 2,
    daily_loss_limit: initialData?.daily_loss_limit || 5,
    max_positions: initialData?.max_positions || 3,
    min_risk_reward: initialData?.min_risk_reward || 2,
    stop_loss_type: initialData?.stop_loss_type || 'hybrid',
    fixed_stop_percent: initialData?.fixed_stop_percent || 2,
    rsi_take_profit_start: initialData?.rsi_take_profit_start || 90,
    rsi_no_entry_above: initialData?.rsi_no_entry_above || 90,
    main_analysis_timeframe: initialData?.main_analysis_timeframe || '4H',
    entry_timeframe: initialData?.entry_timeframe || '15m',
    custom_rules: initialData?.custom_rules || [],
    weaknesses: initialData?.weaknesses || [],
    hard_rules: initialData?.hard_rules || [],
    response_length: initialData?.response_length || 'medium',
    use_emojis: initialData?.use_emojis || false,
    warning_intensity: initialData?.warning_intensity || 'normal',
    monthly_goal: initialData?.monthly_goal || 10,
    improvement_goals: initialData?.improvement_goals || [],
    onboarding_completed: true,
  });

  const [newAsset, setNewAsset] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newWeakness, setNewWeakness] = useState({ weakness: '', warning: '' });
  const [newHardRule, setNewHardRule] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const updateProfile = (key: keyof TradingProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const addToArray = (key: keyof TradingProfile, value: string) => {
    if (!value.trim()) return;
    const current = (profile[key] as string[]) || [];
    updateProfile(key, [...current, value.trim()]);
  };

  const removeFromArray = (key: keyof TradingProfile, index: number) => {
    const current = (profile[key] as string[]) || [];
    updateProfile(key, current.filter((_, i) => i !== index));
  };

  const addWeakness = () => {
    if (!newWeakness.weakness.trim()) return;
    const current = profile.weaknesses || [];
    updateProfile('weaknesses', [...current, newWeakness]);
    setNewWeakness({ weakness: '', warning: '' });
  };

  const removeWeakness = (index: number) => {
    const current = profile.weaknesses || [];
    updateProfile('weaknesses', current.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(profile);
      toast.success('개인화 설정이 완료되었습니다!');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>닉네임</Label>
              <Input
                value={profile.trader_nickname || ''}
                onChange={(e) => updateProfile('trader_nickname', e.target.value)}
                placeholder="트레이딩 닉네임"
              />
            </div>
            <div className="space-y-2">
              <Label>트레이딩 경력</Label>
              <Select value={profile.experience_level} onValueChange={(v) => updateProfile('experience_level', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">초보 (1년 미만)</SelectItem>
                  <SelectItem value="1-2years">1-2년</SelectItem>
                  <SelectItem value="3-5years">3-5년</SelectItem>
                  <SelectItem value="5years+">5년 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>트레이딩 유형</Label>
              <Select value={profile.trader_type} onValueChange={(v) => updateProfile('trader_type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">전업 트레이더</SelectItem>
                  <SelectItem value="parttime">부업</SelectItem>
                  <SelectItem value="hobby">취미</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>매매 스타일</Label>
              <Select value={profile.trading_style} onValueChange={(v) => updateProfile('trading_style', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scalping">스캘핑 (수분~수시간)</SelectItem>
                  <SelectItem value="daytrading">데이트레이딩 (당일 청산)</SelectItem>
                  <SelectItem value="swing">스윙 (수일~수주)</SelectItem>
                  <SelectItem value="position">포지션 (수주~수개월)</SelectItem>
                  <SelectItem value="longterm">장기 홀딩</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>선호 방향</Label>
              <Select value={profile.preferred_direction} onValueChange={(v) => updateProfile('preferred_direction', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">롱 위주</SelectItem>
                  <SelectItem value="short">숏 위주</SelectItem>
                  <SelectItem value="both">양방향</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>레버리지</Label>
              <Select value={profile.leverage_preference} onValueChange={(v) => updateProfile('leverage_preference', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">사용 안 함 (현물)</SelectItem>
                  <SelectItem value="low">저레버리지 (1-3x)</SelectItem>
                  <SelectItem value="medium">중레버리지 (3-10x)</SelectItem>
                  <SelectItem value="high">고레버리지 (10x+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>주력 종목</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                {(profile.primary_assets || []).map((asset, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {asset}
                    <X size={12} className="cursor-pointer" onClick={() => removeFromArray('primary_assets', i)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value.toUpperCase())}
                  placeholder="예: SOL"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('primary_assets', newAsset);
                      setNewAsset('');
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => { addToArray('primary_assets', newAsset); setNewAsset(''); }}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>1회 매매 최대 리스크 (%)</Label>
              <Input
                type="number"
                value={profile.max_risk_per_trade || 2}
                onChange={(e) => updateProfile('max_risk_per_trade', parseFloat(e.target.value))}
                min={0.1}
                max={100}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">포트폴리오의 {profile.max_risk_per_trade}%를 초과하면 진입하지 않습니다</p>
            </div>
            <div className="space-y-2">
              <Label>일일 최대 손실 한도 (%)</Label>
              <Input
                type="number"
                value={profile.daily_loss_limit || 5}
                onChange={(e) => updateProfile('daily_loss_limit', parseFloat(e.target.value))}
                min={1}
                max={100}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground">{profile.daily_loss_limit}% 손실 시 당일 매매 중단 권고</p>
            </div>
            <div className="space-y-2">
              <Label>최대 동시 포지션 수</Label>
              <Input
                type="number"
                value={profile.max_positions || 3}
                onChange={(e) => updateProfile('max_positions', parseInt(e.target.value))}
                min={1}
                max={20}
              />
            </div>
            <div className="space-y-2">
              <Label>최소 손익비</Label>
              <Input
                type="number"
                value={profile.min_risk_reward || 2}
                onChange={(e) => updateProfile('min_risk_reward', parseFloat(e.target.value))}
                min={0.5}
                max={10}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">{profile.min_risk_reward}:1 이상만 진입</p>
            </div>
            <div className="space-y-2">
              <Label>손절 방식</Label>
              <Select value={profile.stop_loss_type} onValueChange={(v) => updateProfile('stop_loss_type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed_percent">고정 % 손절</SelectItem>
                  <SelectItem value="technical">기술적 레벨</SelectItem>
                  <SelectItem value="hybrid">혼합</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'rules':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>RSI 익절 시작</Label>
              <Input
                type="number"
                value={profile.rsi_take_profit_start || 90}
                onChange={(e) => updateProfile('rsi_take_profit_start', parseInt(e.target.value))}
                min={50}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label>RSI 진입 금지 (이상)</Label>
              <Input
                type="number"
                value={profile.rsi_no_entry_above || 90}
                onChange={(e) => updateProfile('rsi_no_entry_above', parseInt(e.target.value))}
                min={50}
                max={100}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>메인 분석 TF</Label>
                <Select value={profile.main_analysis_timeframe} onValueChange={(v) => updateProfile('main_analysis_timeframe', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15분</SelectItem>
                    <SelectItem value="1H">1시간</SelectItem>
                    <SelectItem value="4H">4시간</SelectItem>
                    <SelectItem value="1D">일봉</SelectItem>
                    <SelectItem value="1W">주봉</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>진입 TF</Label>
                <Select value={profile.entry_timeframe} onValueChange={(v) => updateProfile('entry_timeframe', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5m">5분</SelectItem>
                    <SelectItem value="15m">15분</SelectItem>
                    <SelectItem value="1H">1시간</SelectItem>
                    <SelectItem value="4H">4시간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>추가 규칙</Label>
              <div className="space-y-2 mb-2">
                {(profile.custom_rules || []).map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 text-sm">
                    <span className="flex-1">{rule}</span>
                    <X size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeFromArray('custom_rules', i)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="예: 뉴스 발표 전후 1시간은 매매 금지"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('custom_rules', newRule);
                      setNewRule('');
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => { addToArray('custom_rules', newRule); setNewRule(''); }}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>나의 약점 (AI가 경고해줘야 할 것)</Label>
              <div className="space-y-3">
                {(profile.weaknesses || []).map((w, i) => (
                  <div key={i} className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">약점: {w.weakness}</p>
                        <p className="text-xs text-muted-foreground mt-1">경고: "{w.warning}"</p>
                      </div>
                      <X size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeWeakness(i)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                <Input
                  value={newWeakness.weakness}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, weakness: e.target.value }))}
                  placeholder="약점 (예: FOMO가 심함)"
                />
                <Input
                  value={newWeakness.warning}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, warning: e.target.value }))}
                  placeholder="AI 경고 문구 (예: 급등 중입니다. FOMO 주의하세요.)"
                />
                <Button type="button" variant="outline" className="w-full" onClick={addWeakness}>
                  <Plus size={16} className="mr-2" /> 약점 추가
                </Button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>응답 길이</Label>
              <Select value={profile.response_length} onValueChange={(v) => updateProfile('response_length', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">짧게 핵심만</SelectItem>
                  <SelectItem value="medium">적당히</SelectItem>
                  <SelectItem value="detailed">상세하게</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>이모지 사용</Label>
              <Switch checked={profile.use_emojis} onCheckedChange={(v) => updateProfile('use_emojis', v)} />
            </div>
            <div className="space-y-2">
              <Label>경고 강도</Label>
              <Select value={profile.warning_intensity} onValueChange={(v) => updateProfile('warning_intensity', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">부드럽게</SelectItem>
                  <SelectItem value="normal">보통</SelectItem>
                  <SelectItem value="strong">강하게 직설적으로</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'hard-rules':
        return (
          <div className="space-y-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-destructive">AI가 절대 추천하면 안 되는 것들</p>
              <p className="text-xs text-muted-foreground mt-1">이 규칙들은 어떤 상황에서도 위반되지 않습니다</p>
            </div>
            <div className="space-y-2">
              {(profile.hard_rules || []).map((rule, i) => (
                <div key={i} className="flex items-center gap-2 bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                  <AlertTriangle size={14} className="text-destructive shrink-0" />
                  <span className="flex-1 text-sm">{rule}</span>
                  <X size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeFromArray('hard_rules', i)} />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newHardRule}
                onChange={(e) => setNewHardRule(e.target.value)}
                placeholder="예: 밈코인 레버리지 매매"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('hard_rules', newHardRule);
                    setNewHardRule('');
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => { addToArray('hard_rules', newHardRule); setNewHardRule(''); }}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>월간 목표 수익률 (%)</Label>
              <Input
                type="number"
                value={profile.monthly_goal || 10}
                onChange={(e) => updateProfile('monthly_goal', parseFloat(e.target.value))}
                min={0}
                max={1000}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>개선하고 싶은 점</Label>
              <div className="space-y-2 mb-2">
                {(profile.improvement_goals || []).map((goal, i) => (
                  <div key={i} className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg p-2">
                    <Target size={14} className="text-primary shrink-0" />
                    <span className="flex-1 text-sm">{goal}</span>
                    <X size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeFromArray('improvement_goals', i)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="예: 인내심 기르기"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('improvement_goals', newGoal);
                      setNewGoal('');
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => { addToArray('improvement_goals', newGoal); setNewGoal(''); }}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <div className="border-b border-border bg-card/50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">AI 트레이딩 개인화 설정</h1>
            <span className="text-sm text-muted-foreground">{currentStep + 1} / {STEPS.length}</span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((step, i) => (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const IconComponent = STEPS[currentStep].icon;
              return <IconComponent size={24} className="text-primary" />;
            })()}
            <h2 className="text-xl font-bold">{STEPS[currentStep].title}</h2>
          </div>
          {renderStep()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-border bg-card/50 p-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={16} className="mr-2" />
            이전
          </Button>
          <Button onClick={nextStep}>
            {currentStep === STEPS.length - 1 ? '완료' : '다음'}
            {currentStep < STEPS.length - 1 && <ChevronRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
