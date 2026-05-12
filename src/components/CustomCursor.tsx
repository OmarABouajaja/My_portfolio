import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Outer ring spring (slower, more fluid)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Inner dot spring (snappier, tightly bound)
  const dotSpringConfig = { damping: 20, stiffness: 400, mass: 0.2 };
  const dotXSpring = useSpring(cursorX, dotSpringConfig);
  const dotYSpring = useSpring(cursorY, dotSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.group')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Only mount on devices with a fine pointer (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", moveCursor);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glow Ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-primary/50 mix-blend-screen shadow-[0_0_15px_rgba(34,211,238,0.4)] backdrop-blur-[2px]"
        style={{ x: cursorXSpring, y: cursorYSpring }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(34,211,238,0.2)" : "rgba(34,211,238,0.1)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      {/* Inner Precision Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_#22d3ee]"
        style={{
          x: dotXSpring,
          y: dotYSpring,
          translateX: 13, // center the 6px dot in the 32px ring
          translateY: 13,
        }}
        animate={{
          scale: isClicking ? 0 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
      />
    </>
  );
};
