import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress component that displays a progress bar at the top of the page
 * Features:
 * - Tracks page scroll position
 * - Smooth spring animation for progress updates
 * - Fixed positioning at the top of the viewport
 * - Primary color background with left-to-right scaling
 */
export function ScrollProgress() {
  // Get scroll progress from Framer Motion's useScroll hook
  const { scrollYProgress } = useScroll();
  
  // Create a spring animation for smooth progress updates
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,  // Controls the spring's stiffness
    damping: 30,     // Controls how quickly the spring settles
    restDelta: 0.001 // Minimum change before animation stops
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
} 