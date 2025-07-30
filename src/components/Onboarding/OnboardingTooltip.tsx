import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import useOnboarding from '@/hooks/useOnboarding';
import './OnboardingTooltip.css';

const OnboardingTooltip = () => {
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
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay */}
          <motion.div
            className="onboarding-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={skipOnboarding}
          />

          {/* Tooltip */}
          <motion.div
            className={`onboarding-tooltip onboarding-tooltip-${currentStep.position}`}
            style={getTooltipPosition()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Close button */}
            <button className="onboarding-close" onClick={skipOnboarding}>
              <X size={16} />
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
                  <motion.div
                    className="onboarding-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              <div className="onboarding-actions">
                <button className="onboarding-skip" onClick={skipOnboarding}>
                  Skip tour
                </button>
                <motion.button
                  className="onboarding-next"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTooltip;