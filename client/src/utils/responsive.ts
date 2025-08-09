import React from 'react';

/**
 * Responsive breakpoint utilities for the application
 */

export const breakpoints = {
  mobile: 768, // Below this is considered mobile
  tablet: 1024,
  desktop: 1200,
} as const;

/**
 * Hook to determine if current screen size is mobile
 */
export const useIsMobile = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR fallback
  
  const [isMobile, setIsMobile] = React.useState(
    window.innerWidth < breakpoints.mobile
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoints.mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

/**
 * CSS media queries for responsive design
 */
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.mobile - 1}px)`,
  tablet: `(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
  desktop: `(min-width: ${breakpoints.tablet}px)`,
  notMobile: `(min-width: ${breakpoints.mobile}px)`,
} as const;