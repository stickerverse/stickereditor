import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Palette, 
  Maximize2, 
  Type, 
  Grid3x3,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import useStickerStore from '@/store/stickerStore';
import useOnboarding from '@/hooks/useOnboarding';
import './VerticalToolbar.css';
import ToolbarButton from './ToolbarButton';
import CompletionBadge from './CompletionBadge';

export interface ToolbarItem {
  id: string;
  icon: any;
  label: string;
  step: number;
  shortcut: string;
  requiredFor?: string[];
  description: string;
}

const toolbarItems: ToolbarItem[] = [
  { 
    id: 'upload', 
    icon: Upload, 
    label: 'Upload Image', 
    step: 1, 
    shortcut: '1',
    description: 'Start by uploading your image or design',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'outline', 
    icon: Maximize2, 
    label: 'Outline Style', 
    step: 2, 
    shortcut: '2',
    description: 'Choose how your sticker will be cut',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'material', 
    icon: Palette, 
    label: 'Material', 
    step: 3, 
    shortcut: '3',
    description: 'Select your sticker material',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'text', 
    icon: Type, 
    label: 'Add Text', 
    step: 4, 
    shortcut: '4',
    description: 'Add custom text to your design'
  },
  { 
    id: 'cliparts', 
    icon: Grid3x3, 
    label: 'Cliparts', 
    step: 5, 
    shortcut: '5',
    description: 'Browse and add clipart elements'
  },
];

const VerticalToolbar = () => {
  const { 
    activePanel, 
    setActivePanel, 
    onboarding,
    trackActivity,
    configuration 
  } = useStickerStore();
  
  const { startOnboarding, isTooltipVisible } = useOnboarding();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pulsingStep, setPulsingStep] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Check completed steps based on configuration
  useEffect(() => {
    const completed: string[] = [];
    if (configuration.image) completed.push('upload');
    if (configuration.outlineType) completed.push('outline');
    if (configuration.material) completed.push('material');
    setCompletedSteps(completed);
  }, [configuration]);

  // Pulse next recommended step
  useEffect(() => {
    if (completedSteps.length < 3) {
      const nextStep = toolbarItems[completedSteps.length]?.id;
      setPulsingStep(nextStep);
    } else {
      setPulsingStep(null);
    }
  }, [completedSteps]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      
      const item = toolbarItems.find(item => item.shortcut === e.key);
      if (item) {
        handleItemClick(item);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // Initial animation
  useEffect(() => {
    controls.start(i => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 300 }
    }));
  }, [controls]);

  const handleItemClick = (item: ToolbarItem) => {
    setActivePanel(item.label);
    trackActivity(`toolbar_click_${item.id}`);
    
    // Visual feedback
    const button = document.getElementById(`toolbar-btn-${item.id}`);
    if (button) {
      button.classList.add('toolbar-click-feedback');
      setTimeout(() => button.classList.remove('toolbar-click-feedback'), 300);
    }
  };

  const getProgress = () => {
    const requiredSteps = toolbarItems.filter(item => item.requiredFor?.includes('sticker-creation'));
    const completedRequired = requiredSteps.filter(item => completedSteps.includes(item.id));
    return (completedRequired.length / requiredSteps.length) * 100;
  };

  return (
    <motion.div 
      ref={containerRef}
      className="vertical-toolbar"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Progress Indicator */}
      <motion.div className="toolbar-progress">
        <motion.div 
          className="toolbar-progress-bar"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: getProgress() / 100 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </motion.div>

      {/* Logo/Brand Area */}
      <motion.div 
        className="toolbar-brand"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={32} color="var(--interactive-accent)" />
      </motion.div>

      {/* Toolbar Items */}
      <div className="toolbar-items">
        {toolbarItems.map((item, index) => (
          <ToolbarButton
            key={item.id}
            item={item}
            isActive={activePanel === item.label}
            isCompleted={completedSteps.includes(item.id)}
            isPulsing={pulsingStep === item.id}
            onClick={() => handleItemClick(item)}
            onHover={setHoveredItem}
            index={index}
          />
        ))}
      </div>

      {/* Help Button */}
      <motion.div className="toolbar-help">
        <motion.button
          className="toolbar-help-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => startOnboarding()}
        >
          <HelpCircle size={24} />
        </motion.button>
      </motion.div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {completedSteps.length === 3 && (
          <CompletionBadge />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VerticalToolbar;