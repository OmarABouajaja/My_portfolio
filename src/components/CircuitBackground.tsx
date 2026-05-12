import { motion } from "framer-motion";

/**
 * Animated SVG circuit-trace background. Glowing data packets travel along
 * the lines using stroke-dashoffset animation. Pure presentation, no JS rAF.
 */
export const CircuitBackground = () => {
  const lines = [
    "M0,120 L240,120 L260,140 L520,140 L540,160 L840,160",
    "M0,300 L160,300 L180,320 L420,320 L440,300 L760,300 L780,320 L1000,320",
    "M0,520 L320,520 L340,540 L600,540 L620,520 L900,520",
    "M120,0 L120,180 L100,200 L100,420 L120,440 L120,640",
    "M380,0 L380,140 L400,160 L400,360 L380,380 L380,640",
    "M760,0 L760,220 L780,240 L780,460 L760,480 L760,640",
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <svg
        viewBox="0 0 1000 640"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(187 95% 65%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(187 95% 55%)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trace" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(187 95% 55%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(187 95% 65%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(270 85% 65%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* base traces */}
        {lines.map((d, i) => (
          <path key={`base-${i}`} d={d} className="circuit-line" />
        ))}

        {/* moving data packets */}
        {lines.map((d, i) => (
          <motion.path
            key={`packet-${i}`}
            d={d}
            stroke="url(#trace)"
            strokeWidth={2}
            fill="none"
            strokeDasharray="60 600"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -660 }}
            transition={{
              duration: 5 + i * 0.7,
              ease: "linear",
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        {/* nodes */}
        {[
          [240, 120], [520, 140], [160, 300], [420, 320], [760, 300],
          [320, 520], [600, 540], [120, 180], [400, 160], [780, 240],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={12} fill="url(#node-glow)" />
            <circle cx={cx} cy={cy} r={2.5} className="circuit-node" />
          </g>
        ))}
      </svg>

      {/* radial vignette to blend with content */}
      <div className="absolute inset-0 bg-gradient-radial" />
    </div>
  );
};
