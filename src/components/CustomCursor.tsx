import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Checked once at module load — no per-render overhead.
const hasFinePointer =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Raw position — updated every mousemove via rAF, zero lag
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Ring trails with a very light spring for the glow-ring effect.
  // High stiffness + low mass keeps it close to real position.
  const ringX = useSpring(cursorX, { stiffness: 600, damping: 40, mass: 0.08 });
  const ringY = useSpring(cursorY, { stiffness: 600, damping: 40, mass: 0.08 });

  // rafId ref to cancel pending frames on cleanup
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasFinePointer) return;

    const onMove = (e: MouseEvent) => {
      // Cancel any pending frame so we don't stack them
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        // Ring offset — center the 32px ring on the cursor tip
        cursorX.set(e.clientX - 16);
        cursorY.set(e.clientY - 16);
        setIsVisible(true);

        const t = e.target as HTMLElement;
        setIsHovering(
          !!(
            t.closest("a") ||
            t.closest("button") ||
            t.closest("[role='button']") ||
            t.closest("label") ||
            t.closest("select") ||
            t.closest(".group")
          )
        );
      });
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [cursorX, cursorY]);

  if (!hasFinePointer || !isVisible) return null;

  return (
    <>
      {/* ── Outer glow ring — trails slightly behind for depth ── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-primary/50 mix-blend-screen shadow-[0_0_14px_rgba(34,211,238,0.35)]"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isClicking ? 0.75 : isHovering ? 1.55 : 1,
          backgroundColor: isHovering
            ? "rgba(34,211,238,0.18)"
            : "rgba(34,211,238,0.06)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

      {/* ── Inner precision dot — pixel-perfect, zero lag ── */}
      {/*
          Uses raw cursorX/cursorY (no spring), so it sits exactly on the
          hot-spot. translateX/Y 13 = (32 - 6) / 2 to center the 6px dot
          inside the 32px ring element.
      */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(187_95%_55%)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 13,
          translateY: 13,
        }}
        animate={{
          scale: isClicking ? 2.5 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </>
  );
};
