import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ToolbarItem } from './VerticalToolbar';

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
    <motion.div 
      className="toolbar-button-wrapper"
      custom={index}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.button
        id={`toolbar-btn-${item.id}`}
        className={`toolbar-icon-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
        onClick={onClick}
        onMouseEnter={() => onHover(item.id)}
        onMouseLeave={() => onHover(null)}
        whileHover={{ 
          scale: 1.1, 
          boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.5)" 
        }}
        whileTap={{ scale: 0.95 }}
        animate={isPulsing ? {
          boxShadow: [
            "0px 0px 0px rgba(255, 215, 0, 0)",
            "0px 0px 20px rgba(255, 215, 0, 0.6)",
            "0px 0px 0px rgba(255, 215, 0, 0)"
          ]
        } : {}}
        transition={isPulsing ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {
          type: "spring", 
          stiffness: 300, 
          damping: 20
        }}
      >
        <Icon size={24} />
        
        {/* Completion Badge */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div 
              className="completion-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Check size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {onHover && (
          <motion.div
            className="toolbar-tooltip"
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tooltip-content">
              <div className="tooltip-header">
                <span className="tooltip-label">{item.label}</span>
                <kbd className="tooltip-shortcut">{item.shortcut}</kbd>
              </div>
              <div className="tooltip-description">{item.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ToolbarButton;