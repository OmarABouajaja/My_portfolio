import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props interface for icon components
 * Extends SVG attributes with optional className
 */
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * TypeScript icon component
 * Features:
 * - Clean, minimal design
 * - Consistent stroke width
 * - Proper viewBox and dimensions
 */
export const TypeScriptIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M3 3h18v18H3z" />
    <path d="M12 7H8v8" />
    <path d="M8 11h4" />
    <path d="M17 7v4c0 1.1-.9 2-2 2h-1" />
    <path d="M14 15.5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
  </svg>
);

/**
 * React icon component
 * Features:
 * - Atom-like design
 * - Orbital rings
 * - Electron dots
 */
export const ReactIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

/**
 * Node.js icon component
 * Features:
 * - Hexagonal shape
 * - Leaf-like design
 * - Clean lines
 */
export const NodeIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

/**
 * MongoDB icon component
 * Features:
 * - Leaf-like design
 * - Curved lines
 * - Minimal style
 */
export const MongoIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2c-2.5 0-4.5 2-4.5 4.5 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5S14.5 2 12 2z" />
    <path d="M12 11c-2.5 0-4.5 2-4.5 4.5 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5S14.5 11 12 11z" />
  </svg>
);

export const WaveIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
    <path d="M19 10v2c0 4.97-4.03 9-9 9s-9-4.03-9-9v-2" />
    <path d="M12 19v4" />
    <path d="M8 23h8" />
  </svg>
);

export const RocketIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22 22 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const GraduationIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export const DocumentIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

export const HomeIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const EmailIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const BrainIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 4c3.5 0 6 2 6 5 0 2-1 3-2.5 4 1.5 1 2.5 2 2.5 4 0 3-2.5 5-6 5s-6-2-6-5c0-2 1-3 2.5-4C7 12 6 11 6 9c0-3 2.5-5 6-5z" />
    <path d="M12 4v16" />
    <path d="M9 8h6" />
    <path d="M9 16h6" />
  </svg>
);

export const ToolboxIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M3 13h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z" />
    <path d="M15 13V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v10" />
    <path d="M6 13V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" />
    <path d="M3 13h4" />
    <path d="M17 13h4" />
  </svg>
);

export const BriefcaseIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const MedalIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
    <path d="m8.21 13.89-3.68 8.02a.34.34 0 0 0 .49.37l6.98-3.89.84-3.47" />
    <path d="m15.79 13.89 3.68 8.02a.34.34 0 0 1-.49.37l-6.98-3.89-.84-3.47" />
  </svg>
);

export const BookIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M12 6v12" />
    <path d="M12 13l5-4" />
    <path d="M12 13l-5-4" />
  </svg>
);

export const PaletteIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="16" cy="8" r="1" />
    <circle cx="16" cy="16" r="1" />
    <circle cx="8" cy="16" r="1" />
    <path d="M12 3v3" />
    <path d="M3 12h3" />
    <path d="M12 18v3" />
    <path d="M18 12h3" />
  </svg>
);

export const RobotIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="8" cy="16" r="2" />
    <circle cx="16" cy="16" r="2" />
    <path d="M12 7v4" />
    <path d="M8 7h8" />
    <path d="M12 3v4" />
    <path d="M9 11h6" />
  </svg>
);

export const ParkingIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>
);

export const DeviceIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="8" y="8" width="8" height="8" rx="1" />
    <path d="M8 4v4" />
    <path d="M16 4v4" />
    <path d="M4 8h4" />
    <path d="M16 8h4" />
    <path d="M4 16h4" />
    <path d="M16 16h4" />
    <path d="M8 16v4" />
    <path d="M16 16v4" />
  </svg>
);

// Web Development Icons
export const TailwindIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M6.5 8C8 6 10.5 5 12.5 5c3 0 4.5 2 6.5 2 1.5 0 2.5-1 3-2-.5 3-2.5 5-5 5-2 0-3.5-2-6.5-2-1.5 0-2.5 1-3 2" />
    <path d="M6.5 16C8 14 10.5 13 12.5 13c3 0 4.5 2 6.5 2 1.5 0 2.5-1 3-2-.5 3-2.5 5-5 5-2 0-3.5-2-6.5-2-1.5 0-2.5 1-3 2" />
    <path d="M12 5v14" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const JavaScriptIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 8v8c0 2 1 3 3 3s3-1 3-3" />
    <path d="M16 8v8" />
    <path d="M16 12c1.5 0 2.5-1 2.5-2s-1-2-2.5-2-2.5 1-2.5 2" />
    <path d="M3 8h18" strokeDasharray="2 2" opacity="0.5" />
    <path d="M3 16h18" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const HTMLIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4 3l1.5 16.5L12 22l6.5-2.5L20 3H4z" />
    <path d="M8 8h8l-.5 5-3.5 2-3.5-2-.3-3" />
    <path d="M16 8l-.4 5-3.6 2-3.6-2-.2-3" />
  </svg>
);

export const CSSIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4 3l1.5 16.5L12 22l6.5-2.5L20 3H4z" />
    <path d="M7 7h10l-1 12-4 1.5-4-1.5-.5-5.5" />
    <path d="M8.5 12h7" />
    <path d="M7.5 9.5h9" />
  </svg>
);

export const ViteIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2L3 7l9 5 9-5-9-5z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 17l9 5 9-5" />
    <path d="M12 7v15" />
  </svg>
);

export const GitIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <line x1="3" y1="12" x2="8" y2="12" />
    <line x1="16" y1="12" x2="21" y2="12" />
    <line x1="12" y1="3" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="21" />
    <path d="M15 9l-2-2-2 2" />
    <path d="M9 15l2 2 2-2" />
    <circle cx="12" cy="12" r="8" strokeDasharray="2 2" opacity="0.5" />
    <path d="M12 4v16" strokeDasharray="2 2" opacity="0.3" />
  </svg>
);

export const VSCodeIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M16 3v18l4-2V5z" />
    <path d="M16 3L4 9v6l12 6" />
    <path d="M4 9l12 6" />
    <path d="M4 15l12-6" />
  </svg>
);

export const NPMIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M3 8v8h5v-6h3v6h2V8" />
    <path d="M16 8v8h5v-6h-3v6h-2V8" />
    <rect x="3" y="8" width="18" height="8" rx="1" />
  </svg>
);

// Programming Languages
export const PythonIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 3c5.5 0 5.5 3 5.5 3v3h-11v3h11v3c0 0 0 3-5.5 3S6.5 15 6.5 15v-3h11" />
    <circle cx="8" cy="6" r="1" />
    <circle cx="16" cy="18" r="1" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M6.5 6.5C8 5 10 4 12 4" strokeDasharray="2 2" opacity="0.5" />
    <path d="M17.5 17.5C16 19 14 20 12 20" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const CPPIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M10 8v8m-2-4h4" />
    <path d="M16 8l-2 8" />
    <path d="M14 8l2 8" />
    <path d="M13 12h4" />
  </svg>
);

// Design Icons
export const FigmaIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    <circle cx="12" cy="12.5" r="1" />
    <path d="M15.5 12.5h-7" strokeDasharray="1 1" opacity="0.5" />
    <path d="M12 5v15" strokeDasharray="1 1" opacity="0.5" />
  </svg>
);

export const PhotoshopIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 15V9h3a2 2 0 1 1 0 4H7" />
    <path d="M14 9v6" />
    <path d="M17 9v6" />
    <path d="M14 12h3" />
    <path d="M3 8h18" />
    <path d="M3 16h18" />
  </svg>
);

export const BlenderIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
    <path d="M12 12l9-4.5V17l-9 4.5L3 17V7.5L12 12z" />
    <path d="M12 12v9.5" />
    <circle cx="12" cy="12" r="3" />
    <path d="M9 10l6 4" />
    <path d="M15 10l-6 4" />
  </svg>
);

// Additional Programming Language Icons
export const JavaIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M2 12c0 5 4 8 10 8s10-3 10-8v-2c0-5-4-8-10-8S2 5 2 10v2z" />
    <path d="M12 11c-2.5 0-4-1.5-4-3s1.5-3 4-3 4 1.5 4 3-1.5 3-4 3z" />
    <path d="M12 11v6" />
    <path d="M12 17c2.5 0 4-1.5 4-3" />
  </svg>
);

// Additional Embedded Systems Icons
export const ESP32Icon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <circle cx="12" cy="12" r="2" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" opacity="0.5" />
    <path d="M12 6c3.3 0 6 2.7 6 6" strokeDasharray="1 1" opacity="0.5" />
  </svg>
);

export const ArduinoIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <circle cx="8" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="16" cy="12" r="1.5" />
    <path d="M4 12h2" />
    <path d="M18 12h2" />
    <path d="M8 6v-2" />
    <path d="M16 6v-2" />
    <path d="M8 18v2" />
    <path d="M16 18v2" />
    <path d="M6 9h12" />
    <path d="M6 15h12" />
    <path d="M4 9v6" strokeDasharray="1 1" opacity="0.5" />
    <path d="M20 9v6" strokeDasharray="1 1" opacity="0.5" />
  </svg>
);

export const RaspberryPiIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="7" cy="9" r="1" />
    <circle cx="7" cy="15" r="1" />
    <circle cx="17" cy="9" r="1" />
    <circle cx="17" cy="15" r="1" />
    <path d="M7 12h10" />
    <path d="M12 6v12" />
    <path d="M3 10h2" />
    <path d="M19 10h2" />
    <path d="M3 14h2" />
    <path d="M19 14h2" />
  </svg>
);

// Soft Skills Icons
export const TeachingIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
    <path d="M12 6v6" />
    <path d="M9 9h6" />
    <path d="M8 17h8" />
    <path d="M8 13h3" />
    <circle cx="12" cy="6" r="1" />
    <path d="M15 15l-3-3-3 3" />
    <path d="M20 2v20" strokeDasharray="2 2" opacity="0.5" />
    <path d="M4 7h16" strokeDasharray="1 1" opacity="0.5" />
  </svg>
);

export const TeamworkIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="11" r="4" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M21 7a4 4 0 0 0-3-3.87" />
    <path d="M3 7a4 4 0 0 1 3-3.87" />
    <path d="M14 8h6" />
    <path d="M17 5v6" />
    <path d="M10 7v8" strokeDasharray="2 2" opacity="0.5" />
    <path d="M6 11h8" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const LeadershipIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 17v4" />
    <path d="M8 21h8" />
    <path d="M12 3L2 12h4l-2 8h16l-2-8h4L12 3z" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 7v3" />
    <path d="M9 14l3 3 3-3" />
  </svg>
);

export const CommunicationIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
    <path d="M8 9h8" />
    <path d="M8 13h6" />
    <circle cx="12" cy="11" r="4" strokeDasharray="2 2" />
  </svg>
);

export const ProblemSolvingIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v6" />
    <path d="M9 12h6" />
  </svg>
);

export const TimeManagementIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M12 6v6" strokeDasharray="2 2" />
    <path d="M16 8l-4 4" strokeDasharray="2 2" />
  </svg>
);

// Additional Tools
export const DatabaseIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12V5" strokeDasharray="2 2" />
    <path d="M21 12V5" strokeDasharray="2 2" />
  </svg>
);

export const APIIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M8 7v10" />
    <path d="M16 7v10" />
    <path d="M4 12h16" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const CloudIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    <path d="M13 12l3 3m0 0l3-3m-3 3V8" />
  </svg>
);

// Development Tools
export const LinuxIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2a7 7 0 0 1 7 7v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9a7 7 0 0 1 7-7z" />
    <circle cx="9" cy="8" r="1" />
    <circle cx="15" cy="8" r="1" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M12 16v3" />
    <path d="M9 19h6" />
    <path d="M6 12c-2 2-2 3-2 4" />
    <path d="M18 12c2 2 2 3 2 4" />
  </svg>
);

export const PHPIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
    <path d="M5.5 12.5c0-1.1.9-2 2-2h2v4h-2c-1.1 0-2-.9-2-2z" />
    <path d="M14.5 12.5c0-1.1.9-2 2-2h2v4h-2c-1.1 0-2-.9-2-2z" />
  </svg>
);

export const SQLIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M3 7c0-1.1 3.5-2 8-2s8 .9 8 2-3.5 2-8 2-8-.9-8-2z" />
    <path d="M3 7v10c0 1.1 3.5 2 8 2s8-.9 8-2V7" />
    <path d="M3 12c0 1.1 3.5 2 8 2s8-.9 8-2" />
    <path d="M3 17c0 1.1 3.5 2 8 2s8-.9 8-2" />
  </svg>
);

export const CanvaIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
    <path d="M12 3v3" strokeDasharray="2 2" opacity="0.5" />
    <path d="M12 18v3" strokeDasharray="2 2" opacity="0.5" />
    <path d="M3 12h3" strokeDasharray="2 2" opacity="0.5" />
    <path d="M18 12h3" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const CSharpIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M10 8v8m-2-4h4" />
    <path d="M16 8l-2 8" />
    <path d="M14 8l2 8" />
    <path d="M13 12h4" />
  </svg>
);

export const SelfLearningIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 8v4l2 2" />
    <path d="M3.05 11a9 9 0 1 1 .5 4" />
    <path d="M3 15l2-2-2-2" />
    <circle cx="12" cy="12" r="4" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const ResourceManagementIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5" />
    <path d="M3 12v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
    <path d="M3 12h18" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const VolunteeringIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path d="M12 7v6" />
    <path d="M9 10h6" />
  </svg>
);

export const ResponsivenessIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    <path d="M22 12h-4" strokeDasharray="2 2" opacity="0.5" />
    <path d="M6 12H2" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const GitHubIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const PrototypingIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8" />
    <path d="M14 10h4" />
  </svg>
); 