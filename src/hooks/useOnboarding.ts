import { useState, useEffect, useCallback } from 'react';
import useStickerStore from '@/store/stickerStore';

interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  content: string;
  action?: () => void;
  position: 'top' | 'right' | 'bottom' | 'left';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '.toolbar-brand',
    title: 'Welcome to Sticker Editor! ✨',
    content: 'Let\'s create amazing custom stickers together. This quick tour will show you the basics.',
    position: 'right',
  },
  {
    id: 'upload',
    target: '#toolbar-btn-upload',
    title: 'Step 1: Upload Your Design',
    content: 'Start by uploading an image or creating a design from scratch. We support PNG, JPG, and SVG files.',
    position: 'right',
  },
  {
    id: 'outline',
    target: '#toolbar-btn-outline',
    title: 'Step 2: Choose Your Cut Style',
    content: 'Select how you want your sticker to be cut - precise contour, square, circle, or custom shape.',
    position: 'right',
  },
  {
    id: 'material',
    target: '#toolbar-btn-material',
    title: 'Step 3: Pick Your Material',
    content: 'Choose from vinyl, paper, holographic, or transparent materials. Each has different durability and finish.',
    position: 'right',
  },
  {
    id: 'complete',
    target: '.add-to-cart-btn',
    title: 'You\'re All Set! 🎉',
    content: 'Configure your quantity and see live pricing. When you\'re happy, add to cart!',
    position: 'top',
  },
];

const useOnboarding = () => {
  const { onboarding, updateOnboarding, completeOnboardingStep } = useStickerStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const currentStep = onboardingSteps[currentStepIndex];

  const startOnboarding = useCallback(() => {
    if (!onboarding.isFirstVisit && onboarding.completedSteps.length === onboardingSteps.length) {
      console.log('You\'ve already completed the tour! Create something amazing 🎨');
      return;
    }
    
    setIsActive(true);
    setCurrentStepIndex(0);
    updateOnboarding({ currentStep: 0 });
    
    // Add overlay
    document.body.classList.add('onboarding-active');
  }, [onboarding, updateOnboarding]);

  const nextStep = useCallback(() => {
    completeOnboardingStep(currentStep.id);
    
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      updateOnboarding({ currentStep: currentStepIndex + 1 });
    } else {
      endOnboarding();
    }
  }, [currentStepIndex, currentStep, completeOnboardingStep, updateOnboarding]);

  const skipOnboarding = useCallback(() => {
    endOnboarding();
    console.log('You can restart the tour anytime by clicking the help button!');
  }, []);

  const endOnboarding = useCallback(() => {
    setIsActive(false);
    updateOnboarding({ 
      isFirstVisit: false,
      currentStep: 0 
    });
    document.body.classList.remove('onboarding-active');
    
    // Clean up highlights
    if (highlightedElement) {
      highlightedElement.classList.remove('onboarding-highlight');
    }
  }, [highlightedElement, updateOnboarding]);

  // Highlight current element
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const element = document.querySelector(currentStep.target) as HTMLElement;
    if (!element) return;

    // Remove previous highlight
    if (highlightedElement) {
      highlightedElement.classList.remove('onboarding-highlight');
    }

    // Add new highlight
    element.classList.add('onboarding-highlight');
    setHighlightedElement(element);

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return () => {
      element.classList.remove('onboarding-highlight');
    };
  }, [isActive, currentStep, highlightedElement]);

  // Auto-start for first-time users
  useEffect(() => {
    if (onboarding.isFirstVisit && !isActive) {
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [onboarding.isFirstVisit, isActive, startOnboarding]);

  const isTooltipVisible = (stepId: string) => {
    return isActive && currentStep?.id === stepId;
  };

  return {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps: onboardingSteps.length,
    startOnboarding,
    nextStep,
    skipOnboarding,
    endOnboarding,
    isTooltipVisible,
  };
};

export default useOnboarding;