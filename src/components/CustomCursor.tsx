import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Checked once at module load — avoids per-render matchMedia calls.
// hasFinePointer is false on touch-only devices (phones/tablets).
const hasFinePointer =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring spring — slower, more fluid trail
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 300, mass: 0.5 });

  // Inner dot spring — snappier, tightly bound
  const dotXSpring = useSpring(cursorX, { damping: 20, stiffness: 400, mass: 0.2 });
  const dotYSpring = useSpring(cursorY, { damping: 20, stiffness: 400, mass: 0.2 });

  useEffect(() => {
    // Skip wiring listeners completely on touch-only devices
    if (!hasFinePointer) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".group") ||
        target.closest("select") ||
        target.closest("label[for]");
      setIsHovering(!!interactive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  // Don't render anything on touch devices or before first mouse move
  if (!hasFinePointer || !isVisible) return null;

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
          translateX: 13, // center the 6px dot inside the 32px ring
          translateY: 13,
        }}
        animate={{
          scale: isClicking ? 0 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
      />
    </>
  );
};
