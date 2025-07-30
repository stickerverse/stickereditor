import { Variants } from 'framer-motion';

export const panelVariants: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  },
};

export const staggerChildren: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const priceUpdateAnimation = {
  initial: { y: 5, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -5, opacity: 0 },
  transition: { duration: 0.3 },
};