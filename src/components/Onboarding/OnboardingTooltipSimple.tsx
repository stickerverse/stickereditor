import React from 'react';
import useOnboarding from '@/hooks/useOnboarding';
import './OnboardingTooltip.css';

const OnboardingTooltipSimple = () => {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    skipOnboarding,
  } = useOnboarding();

  if (!isActive || !currentStep) return null;

  const getTooltipPosition = () => {
    const target = document.querySelector(currentStep.target);
    if (!target) return { top: '50%', left: '50%' };

    const rect = target.getBoundingClientRect();
    const position: any = {};

    switch (currentStep.position) {
      case 'right':
        position.top = rect.top + rect.height / 2;
        position.left = rect.right + 20;
        position.transform = 'translateY(-50%)';
        break;
      case 'left':
        position.top = rect.top + rect.height / 2;
        position.right = window.innerWidth - rect.left + 20;
        position.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        position.top = rect.bottom + 20;
        position.left = rect.left + rect.width / 2;
        position.transform = 'translateX(-50%)';
        break;
      case 'top':
        position.bottom = window.innerHeight - rect.top + 20;
        position.left = rect.left + rect.width / 2;
        position.transform = 'translateX(-50%)';
        break;
    }

    return position;
  };

  return (
    <div>
      {/* Overlay */}
      <div
        className="onboarding-overlay"
        style={{ opacity: 1, transition: 'opacity 0.3s ease' }}
        onClick={skipOnboarding}
      />

      {/* Tooltip */}
      <div
        className={`onboarding-tooltip onboarding-tooltip-${currentStep.position}`}
        style={{
          ...getTooltipPosition(),
          opacity: 1,
          transform: getTooltipPosition().transform + ' scale(1)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Close button */}
        <button className="onboarding-close" onClick={skipOnboarding}>
          <span style={{ fontSize: '16px' }}>✕</span>
        </button>

        {/* Content */}
        <div className="onboarding-content">
          <h3 className="onboarding-title">{currentStep.title}</h3>
          <p className="onboarding-description">{currentStep.content}</p>
        </div>

        {/* Footer */}
        <div className="onboarding-footer">
          <div className="onboarding-progress">
            <span>{currentStepIndex + 1} of {totalSteps}</span>
            <div className="onboarding-progress-bar">
              <div
                className="onboarding-progress-fill"
                style={{ 
                  width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          <div className="onboarding-actions">
            <button className="onboarding-skip" onClick={skipOnboarding}>
              Skip tour
            </button>
            <button
              className="onboarding-next"
              onClick={nextStep}
              style={{ transform: 'scale(1)', transition: 'all 0.15s ease' }}
            >
              {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
              <span style={{ marginLeft: '0.5rem' }}>></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTooltipSimple;