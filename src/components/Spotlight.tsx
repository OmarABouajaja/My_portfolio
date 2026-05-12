import { useRef } from "react";

interface Props { children: React.ReactNode; className?: string; }

/** Paints a soft radial spotlight that follows the cursor via CSS vars */
export const Spotlight = ({ children, className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight-container ${className}`}>
      {children}
    </div>
  );
};
