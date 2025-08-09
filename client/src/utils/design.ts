import { colors } from './colors';

// Typography scales
export const typography = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  // Font sizes with line heights
  fontSize: {
    xs: { size: '12px', lineHeight: '16px' },
    sm: { size: '14px', lineHeight: '20px' },
    base: { size: '16px', lineHeight: '24px' },
    lg: { size: '18px', lineHeight: '28px' },
    xl: { size: '20px', lineHeight: '28px' },
    '2xl': { size: '24px', lineHeight: '32px' },
    '3xl': { size: '30px', lineHeight: '36px' },
    '4xl': { size: '36px', lineHeight: '40px' },
    '5xl': { size: '48px', lineHeight: '48px' },
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Spacing scale
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

// Transitions
export const transitions = {
  // Durations (in seconds for Framer Motion)
  duration: {
    fast: 0.15,
    base: 0.2,
    slow: 0.3,
    slower: 0.5,
  },
  
  // CSS timing functions (for CSS transitions)
  css: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Framer Motion timing functions
  timing: {
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
    easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
    easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
    linear: 'linear' as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Animation variants for Framer Motion
export const animationVariants = {
  // Page transitions
  pageInitial: {
    opacity: 0,
    y: 20,
  },
  pageAnimate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: transitions.timing.easeOut,
    },
  },
  pageExit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: transitions.timing.easeIn,
    },
  },
  
  // Stagger children animations
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: transitions.timing.easeOut,
      },
    },
  },
  
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: transitions.timing.ease,
      },
    },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: transitions.timing.easeOut,
      },
    },
  },
  
  // Slide animations
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: transitions.timing.easeOut,
      },
    },
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: transitions.timing.easeOut,
      },
    },
  },
};

// Glassmorphism effect
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

// Gradient presets
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
  sunset: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
  ocean: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  forest: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
  lavender: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  neutral: `linear-gradient(135deg, ${colors.gray700} 0%, ${colors.gray900} 100%)`,
};

// Common component styles
export const componentStyles = {
  // Card styles
  card: {
    base: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
      overflow: 'hidden' as const,
      transition: `all ${transitions.duration.base}s ${transitions.css.ease}`,
    },
    hover: {
      boxShadow: shadows.xl,
      transform: 'translateY(-4px)',
    },
  },
  
  // Button styles
  button: {
    base: {
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.base,
      fontSize: typography.fontSize.base.size,
      fontWeight: typography.fontWeight.medium,
      transition: `all ${transitions.duration.base}s ${transitions.css.ease}`,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
    },
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
      '&:hover': {
        backgroundColor: colors.primaryHover,
      },
    },
    secondary: {
      backgroundColor: colors.gray200,
      color: colors.gray700,
      '&:hover': {
        backgroundColor: colors.gray300,
      },
    },
  },
  
  // Input styles
  input: {
    base: {
      padding: `${spacing[3]} ${spacing[4]}`,
      borderRadius: borderRadius.base,
      border: `1px solid ${colors.gray300}`,
      fontSize: typography.fontSize.base.size,
      transition: `all ${transitions.duration.base}s ${transitions.css.ease}`,
      outline: 'none',
      '&:focus': {
        borderColor: colors.primary,
        boxShadow: `0 0 0 3px ${colors.primaryLight}`,
      },
    },
  },
};