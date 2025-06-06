import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the screen size is considered mobile.
 * Uses window.innerWidth and updates on resize.
 */
export const useMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]); // Re-run effect if breakpoint changes

  return isMobile;
}; 