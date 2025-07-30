import { useState, useEffect, useCallback } from 'react';

interface Configuration {
  material?: string;
  outlineType?: string;
  quantity?: number;
}

interface OnboardingState {
  isFirstVisit: boolean;
  currentStep: number;
  completedSteps: string[];
}

interface StickerStore {
  // Panel state
  activePanel: string;
  setActivePanel: (panel: string) => void;
  
  // Configuration state
  configuration: Configuration;
  updateConfiguration: (config: Partial<Configuration>) => void;
  
  // Onboarding state
  onboarding: OnboardingState;
  updateOnboarding: (update: Partial<OnboardingState>) => void;
  completeOnboardingStep: (stepId: string) => void;
  
  // Activity tracking
  trackActivity: (activity: string) => void;
  
  // Handlers (to be integrated with existing uibox handlers)
  handlers?: any;
  setHandlers: (handlers: any) => void;
}

// Simple state management using localStorage for persistence
const useStickerStore = (): StickerStore => {
  const [activePanel, setActivePanel] = useState<string>('Upload Image');
  const [configuration, setConfiguration] = useState<Configuration>({});
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem('sticker-store-onboarding');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      isFirstVisit: true,
      currentStep: 0,
      completedSteps: [],
    };
  });
  const [handlers, setHandlers] = useState<any>();

  // Persist onboarding state
  useEffect(() => {
    localStorage.setItem('sticker-store-onboarding', JSON.stringify(onboarding));
  }, [onboarding]);

  // Persist configuration
  useEffect(() => {
    localStorage.setItem('sticker-store-configuration', JSON.stringify(configuration));
  }, [configuration]);

  const updateConfiguration = useCallback((config: Partial<Configuration>) => {
    setConfiguration(prev => ({ ...prev, ...config }));
  }, []);

  const updateOnboarding = useCallback((update: Partial<OnboardingState>) => {
    setOnboarding(prev => ({ ...prev, ...update }));
  }, []);

  const completeOnboardingStep = useCallback((stepId: string) => {
    setOnboarding(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, stepId]
    }));
  }, []);

  const trackActivity = useCallback((activity: string) => {
    console.log('Activity tracked:', activity);
    // Can be extended to send to analytics
  }, []);

  return {
    activePanel,
    setActivePanel,
    configuration,
    updateConfiguration,
    onboarding,
    updateOnboarding,
    completeOnboardingStep,
    trackActivity,
    handlers,
    setHandlers,
  };
};

export default useStickerStore;