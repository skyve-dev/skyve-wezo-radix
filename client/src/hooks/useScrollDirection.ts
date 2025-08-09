import { useState, useEffect } from 'react';

interface ScrollState {
  isHeaderVisible: boolean;
  isBottomNavVisible: boolean;
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
}

export const useScrollDirection = () => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isHeaderVisible: true,
    isBottomNavVisible: true,
    scrollY: 0,
    scrollDirection: 'none'
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollVelocity = 0;
    let lastTimestamp = Date.now();

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const currentTimestamp = Date.now();
      const timeDiff = currentTimestamp - lastTimestamp;
      const scrollDiff = currentScrollY - lastScrollY;
      
      // Calculate scroll velocity (pixels per millisecond)
      scrollVelocity = Math.abs(scrollDiff) / timeDiff;
      
      const scrollDirection: 'up' | 'down' | 'none' = 
        scrollDiff > 5 ? 'down' : 
        scrollDiff < -5 ? 'up' : 'none';

      // Determine header visibility
      let isHeaderVisible = true;
      if (currentScrollY <= 10) {
        // Always show at top
        isHeaderVisible = true;
      } else if (scrollDirection === 'down' && currentScrollY > 100) {
        // Hide when scrolling down (after 100px)
        isHeaderVisible = false;
      } else if (scrollDirection === 'up' && scrollVelocity > 0.5) {
        // Show on fast scroll up (velocity threshold)
        isHeaderVisible = true;
      } else {
        // Maintain current state for slow scroll up
        isHeaderVisible = scrollState.isHeaderVisible;
      }

      // Determine bottom nav visibility
      let isBottomNavVisible = true;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 20;

      if (currentScrollY <= 10 || isAtBottom) {
        // Always show at top or bottom
        isBottomNavVisible = true;
      } else if (scrollDirection === 'down' && currentScrollY > 100) {
        // Hide when scrolling down (after 100px)
        isBottomNavVisible = false;
      } else if (scrollDirection === 'up' && scrollVelocity > 0.5) {
        // Show on fast scroll up (velocity threshold)
        isBottomNavVisible = true;
      } else {
        // Maintain current state for slow scroll up
        isBottomNavVisible = scrollState.isBottomNavVisible;
      }

      setScrollState({
        isHeaderVisible,
        isBottomNavVisible,
        scrollY: currentScrollY,
        scrollDirection
      });

      lastScrollY = currentScrollY;
      lastTimestamp = currentTimestamp;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    const handleScroll = () => {
      requestTick();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollState.isHeaderVisible, scrollState.isBottomNavVisible]);

  return scrollState;
};