// Simple mock implementation for missing dependencies

// Framer Motion mocks
export const motion = {
  div: 'div',
  button: 'button',
};

export const AnimatePresence = ({ children }: any) => children;
export const useAnimation = () => ({
  start: () => {},
});

// Lucide React mocks
export const Upload = () => '⬆️';
export const Palette = () => '🎨'; 
export const Maximize2 = () => '⛶';
export const Type = () => 'T';
export const Grid3x3 = () => '⊞';
export const Sparkles = () => '✨';
export const HelpCircle = () => '?';
export const Check = () => '✓';
export const X = () => '✕';
export const ChevronRight = () => '>';

// React Toast mocks
export const toast = {
  info: (message: string) => console.log('Toast:', message),
};

// React Intersection Observer mock
export const useInView = () => ({
  ref: null,
  inView: true,
});