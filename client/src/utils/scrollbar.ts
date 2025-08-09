// Utility to enhance scrollbar visibility during scroll events
export const initializeScrollbarBehavior = () => {
  let scrollTimeout: ReturnType<typeof setTimeout>;
  
  const handleScroll = (element: Element) => {
    // Add scrolling class to show scrollbar
    element.classList.add('scrolling');
    
    // Clear existing timeout
    clearTimeout(scrollTimeout);
    
    // Set timeout to hide scrollbar after scrolling stops
    scrollTimeout = setTimeout(() => {
      element.classList.remove('scrolling');
    }, 1000); // Hide after 1 second of no scrolling
  };
  
  // Add scroll listeners to all scrollable elements
  const addScrollListeners = () => {
    const scrollableElements = document.querySelectorAll('*');
    
    scrollableElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const isScrollable = 
        computedStyle.overflowY === 'auto' || 
        computedStyle.overflowY === 'scroll' ||
        computedStyle.overflow === 'auto' ||
        computedStyle.overflow === 'scroll';
      
      if (isScrollable) {
        element.addEventListener('scroll', () => handleScroll(element), { passive: true });
      }
    });
    
    // Also add to window for global scrolling
    window.addEventListener('scroll', () => {
      document.documentElement.classList.add('scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('scrolling');
      }, 1000);
    }, { passive: true });
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addScrollListeners);
  } else {
    addScrollListeners();
  }
  
  // Re-initialize when new elements are added (for dynamic content)
  const observer = new MutationObserver(() => {
    addScrollListeners();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};