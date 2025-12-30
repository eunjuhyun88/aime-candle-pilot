import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useAuth } from '@/hooks/useAuth';
import { useTradingProfile, TradingProfile } from '@/hooks/useTradingProfile';

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useTradingProfile();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // If user has completed onboarding, redirect to home
    if (!profileLoading && profile?.onboarding_completed) {
      navigate('/');
    }
  }, [profile, profileLoading, navigate]);

  const handleComplete = async (profileData: Partial<TradingProfile>) => {
    setSaving(true);
    const { error } = await saveProfile(profileData);
    setSaving(false);
    
    if (!error) {
      navigate('/');
    }
  };

  if (authLoading || profileLoading || saving) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">
            {saving ? '프로필 저장 중...' : '로딩 중...'}
          </p>
        </div>
      </div>
    );
  }

  return <OnboardingWizard onComplete={handleComplete} initialData={profile} />;
}
