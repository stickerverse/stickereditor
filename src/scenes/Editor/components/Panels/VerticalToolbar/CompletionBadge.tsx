import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CompletionBadge = () => {
  return (
    <motion.div
      className="completion-celebration"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="celebration-content"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles size={32} />
        <span>Great Progress!</span>
      </motion.div>
    </motion.div>
  );
};

export default CompletionBadge;