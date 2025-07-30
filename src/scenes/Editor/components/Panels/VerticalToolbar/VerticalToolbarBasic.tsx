import React, { useState, useEffect } from 'react';
import { styled } from 'baseui';
import useStickerStore from '@/store/stickerStore';

const Container = styled('div', {
  position: 'fixed',
  left: 0,
  top: '64px',
  width: '84px',
  height: 'calc(100vh - 64px)',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  boxShadow: '1px 0px 1px rgba(0, 0, 0, 0.15)',
});

const ProgressBar = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '4px',
  height: '100%',
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
});

const ProgressFill = styled('div', (props: any) => ({
  width: '100%',
  height: `${props.progress}%`,
  background: 'linear-gradient(to bottom, #FFD700, #FFC107)',
  transformOrigin: 'bottom',
  transition: 'height 0.3s ease',
}));

const Brand = styled('div', {
  padding: '1.5rem 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid #e0e0e0',
  cursor: 'pointer',
  fontSize: '32px',
});

const Items = styled('div', {
  flex: 1,
  padding: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  alignItems: 'center',
});

const Button = styled('button', (props: any) => ({
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${props.isActive ? '#FFD700' : 'transparent'}`,
  color: props.isActive ? '#FFD700' : '#666666',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.3s ease',
  outline: 'none',
  fontSize: '24px',
  ':hover': {
    color: '#333333',
    backgroundColor: '#f5f5f5',
    transform: 'translateX(4px)',
  },
}));

const Badge = styled('div', {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  width: '20px',
  height: '20px',
  backgroundColor: '#4CAF50',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '14px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
});

const HelpButton = styled('button', {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  border: '2px solid #e0e0e0',
  color: '#666666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontSize: '24px',
  margin: '1rem 0',
  ':hover': {
    borderColor: '#FFD700',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
});

interface ToolbarItem {
  id: string;
  icon: string;
  label: string;
  shortcut: string;
  description: string;
  requiredFor?: string[];
}

const toolbarItems: ToolbarItem[] = [
  { 
    id: 'upload', 
    icon: '⬆️', 
    label: 'Images', 
    shortcut: '1',
    description: 'Start by uploading your image or design',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'outline', 
    icon: '⛶', 
    label: 'Elements', 
    shortcut: '2',
    description: 'Choose how your sticker will be cut',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'material', 
    icon: '🎨', 
    label: 'Background', 
    shortcut: '3',
    description: 'Select your sticker material',
    requiredFor: ['sticker-creation']
  },
  { 
    id: 'text', 
    icon: 'T', 
    label: 'Text', 
    shortcut: '4',
    description: 'Add custom text to your design'
  },
  { 
    id: 'cliparts', 
    icon: '⊞', 
    label: 'Illustrations', 
    shortcut: '5',
    description: 'Browse and add clipart elements'
  },
];

const VerticalToolbarBasic = () => {
  const { 
    activePanel, 
    setActivePanel, 
    configuration,
    trackActivity
  } = useStickerStore();
  
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Check completed steps based on configuration
  useEffect(() => {
    const completed: string[] = [];
    if (configuration.imageUploaded) completed.push('upload');
    if (configuration.material) completed.push('material');
    if (configuration.outlineType) completed.push('outline');
    setCompletedSteps(completed);
  }, [configuration]);

  const handleItemClick = (item: ToolbarItem) => {
    setActivePanel(item.label);
    trackActivity(`toolbar_click_${item.id}`);
  };

  const getProgress = () => {
    const requiredSteps = toolbarItems.filter(item => item.requiredFor?.includes('sticker-creation'));
    const completedRequired = requiredSteps.filter(item => completedSteps.includes(item.id));
    return (completedRequired.length / requiredSteps.length) * 100;
  };

  return (
    <Container>
      {/* Progress Indicator */}
      <ProgressBar>
        <ProgressFill progress={getProgress()} />
      </ProgressBar>

      {/* Logo/Brand Area */}
      <Brand>✨</Brand>

      {/* Toolbar Items */}
      <Items>
        {toolbarItems.map((item) => (
          <div key={item.id} style={{ position: 'relative' }}>
            <Button
              id={`toolbar-btn-${item.id}`}
              isActive={activePanel === item.label}
              onClick={() => handleItemClick(item)}
              title={`${item.description} (Press ${item.shortcut})`}
            >
              {item.icon}
              
              {/* Completion Badge */}
              {completedSteps.includes(item.id) && (
                <Badge>✓</Badge>
              )}
            </Button>
          </div>
        ))}
      </Items>

      {/* Help Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <HelpButton 
          title="Help & Onboarding"
          onClick={() => setHelpModalOpen(true)}
        >
          ?
        </HelpButton>
      </div>
      {isHelpModalOpen && (
        <Modal>
          <ModalContent>
            <p>Welcome to Sticker Editor! Use the toolbar to create amazing stickers.</p>
            <CloseButton onClick={() => setHelpModalOpen(false)}>Close</CloseButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default VerticalToolbarBasic;