import React from 'react';
import { ToolbarItem } from './VerticalToolbarSimple';

const CheckIcon = () => <span style={{ fontSize: '14px', color: 'white' }}>✓</span>;

interface ToolbarButtonProps {
  item: ToolbarItem;
  isActive: boolean;
  isCompleted: boolean;
  isPulsing: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
  index: number;
}

const ToolbarButton = ({ 
  item, 
  isActive, 
  isCompleted, 
  isPulsing, 
  onClick, 
  onHover,
  index 
}: ToolbarButtonProps) => {
  const Icon = item.icon;

  return (
    <div 
      className="toolbar-button-wrapper"
      style={{
        transform: 'translateX(0px)',
        opacity: 1,
        transition: `all ${index * 0.1}s ease`
      }}
    >
      <button
        id={`toolbar-btn-${item.id}`}
        className={`toolbar-icon-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
        onClick={onClick}
        onMouseEnter={() => onHover(item.id)}
        onMouseLeave={() => onHover(null)}
        style={{
          transition: 'all 0.3s ease',
          ...(isPulsing && {
            animation: 'pulse 2s infinite',
            boxShadow: '0px 0px 20px rgba(255, 215, 0, 0.6)'
          })
        }}
      >
        <Icon />
        
        {/* Completion Badge */}
        {isCompleted && (
          <div 
            className="completion-badge"
            style={{
              transform: 'scale(1) rotate(0deg)',
              transition: 'all 0.3s ease'
            }}
          >
            <CheckIcon />
          </div>
        )}
      </button>

      {/* Tooltip */}
      {onHover && (
        <div
          className="toolbar-tooltip"
          style={{
            opacity: 1,
            transform: 'translateY(-50%) scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-header">
              <span className="tooltip-label">{item.label}</span>
              <kbd className="tooltip-shortcut">{item.shortcut}</kbd>
            </div>
            <div className="tooltip-description">{item.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolbarButton;