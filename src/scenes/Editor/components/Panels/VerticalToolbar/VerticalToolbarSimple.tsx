import React, { useState, useEffect, useRef } from 'react';
import useStickerStore from '@/store/stickerStore';
import useOnboarding from '@/hooks/useOnboarding';
import './VerticalToolbar.css';
import ToolbarButtonSimple from './ToolbarButtonSimple';
import CompletionBadgeSimple from './CompletionBadgeSimple';

// Use emoji icons for now to avoid dependency issues
const Icons = {
  Upload: () => <span style={{ fontSize: '24px' }}>⬆️</span>,
  Palette: () => <span style={{ fontSize: '24px' }}>🎨</span>,
  Maximize2: () => <span style={{ fontSize: '24px' }}>⛶</span>,
  Type: () => <span style={{ fontSize: '24px' }}>T</span>,
  Grid3x3: () => <span style={{ fontSize: '24px' }}>⊞</span>,
  Sparkles: () => <span style={{ fontSize: '24px' }}>✨</span>,
  HelpCircle: () => <span style={{ fontSize: '24px' }}>?</span>,
};

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
    icon: Icons.Upload, 
    label: 'Upload Image', 
    step: 1, 
    shortcut: '1',
    description: 'Start by uploading your image or design',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'outline', 
    icon: Icons.Maximize2, 
    label: 'Outline Style', 
    step: 2, 
    shortcut: '2',
    description: 'Choose how your sticker will be cut',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'material', 
    icon: Icons.Palette, 
    label: 'Material', 
    step: 3, 
    shortcut: '3',
    description: 'Select your sticker material',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'text', 
    icon: Icons.Type, 
    label: 'Add Text', 
    step: 4, 
    shortcut: '4',
    description: 'Add custom text to your design'
  },
  { 
    id: 'cliparts', 
    icon: Icons.Grid3x3, 
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
  
  const { startOnboarding } = useOnboarding();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pulsingStep, setPulsingStep] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check completed steps based on configuration
  useEffect(() => {
    const completed: string[] = [];
    if (configuration.material) completed.push('upload');
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
    <div 
      ref={containerRef}
      className="vertical-toolbar"
      style={{ transform: 'translateX(0px)', transition: 'transform 0.3s ease' }}
    >
      {/* Progress Indicator */}
      <div className="toolbar-progress">
        <div 
          className="toolbar-progress-bar"
          style={{ 
            transform: `scaleY(${getProgress() / 100})`,
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Logo/Brand Area */}
      <div 
        className="toolbar-brand"
        style={{ cursor: 'pointer' }}
      >
        <Icons.Sparkles />
      </div>

      {/* Toolbar Items */}
      <div className="toolbar-items">
        {toolbarItems.map((item, index) => (
          <ToolbarButtonSimple
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
      <div className="toolbar-help">
        <button
          className="toolbar-help-btn"
          onClick={() => startOnboarding()}
        >
          <Icons.HelpCircle />
        </button>
      </div>

      {/* Completion Celebration */}
      {completedSteps.length === 3 && (
        <CompletionBadgeSimple />
      )}
    </div>
  );
};

export default VerticalToolbar;