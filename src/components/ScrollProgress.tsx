import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { hasSupabase } from "@/integrations/supabase/safeFetch";

/** Thick, highly visible glowing progress bar for better tracking (ADHD friendly) */
export const ScrollProgress = ({ isOffline }: { isOffline?: boolean }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const xPercent = useTransform(scaleX, [0, 1], ["-100%", "0%"]);

  const [justConnected, setJustConnected] = useState(false);
  const prevOffline = useRef(isOffline);

  useEffect(() => {
    if (prevOffline.current === true && isOffline === false && hasSupabase) {
      setJustConnected(true);
      const timer = setTimeout(() => setJustConnected(false), 2000);
      return () => clearTimeout(timer);
    }
    prevOffline.current = isOffline;
  }, [isOffline]);

  if (!hasSupabase || isOffline) {
    return (
      <div className="fixed left-0 right-0 top-0 z-[60] h-1.5 bg-background-elevated/40 overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "300%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-full w-1/3 bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.8)] rounded-full"
        />
      </div>
    );
  }

  if (justConnected) {
    return (
      <div className="fixed left-0 right-0 top-0 z-[60] h-1.5 bg-background-elevated/40 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0 }}
          className="h-full w-full bg-success shadow-[0_0_20px_rgba(34,197,94,0.8)]"
        />
      </div>
    );
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-1.5 bg-background-elevated/40 overflow-hidden">
      <motion.div
        style={{ x: xPercent }}
        className="h-full w-full bg-gradient-cyber shadow-[0_0_20px_#22d3ee] flex justify-end"
      >
        <div className="h-full w-3 bg-white shadow-[0_0_12px_white] rounded-full" />
      </motion.div>
    </div>
  );
};
