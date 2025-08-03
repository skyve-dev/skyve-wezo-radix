import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  excludePaths?: string[];
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ excludePaths = ['/listings'] }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if current path should maintain scroll position
    const shouldMaintainScroll = excludePaths.some(path => 
      pathname.startsWith(path)
    );

    // Only scroll to top if the path is not excluded
    if (!shouldMaintainScroll) {
      window.scrollTo(0, 0);
    }
  }, [pathname, excludePaths]);

  return null;
};

export default ScrollToTop;