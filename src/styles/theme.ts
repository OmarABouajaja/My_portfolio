import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themes = {
  light: {
    background: "bg-white",
    text: "text-gray-900",
    primary: "text-blue-600",
    secondary: "text-gray-600",
    accent: "bg-blue-100",
    border: "border-gray-200",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-100",
    primary: "text-blue-400",
    secondary: "text-gray-400",
    accent: "bg-blue-900",
    border: "border-gray-700",
  },
  highContrast: {
    background: "bg-black",
    text: "text-white",
    primary: "text-yellow-400",
    secondary: "text-yellow-200",
    accent: "bg-yellow-900",
    border: "border-yellow-500",
  },
} as const;

export type Theme = keyof typeof themes;

export const themeConfig = {
  light: {
    colors: {
      primary: {
        DEFAULT: '#0066FF',
        50: '#E5F0FF',
        100: '#CCE1FF',
        200: '#99C3FF',
        300: '#66A5FF',
        400: '#3387FF',
        500: '#0066FF',
        600: '#0052CC',
        700: '#003D99',
        800: '#002966',
        900: '#001433',
      },
      background: {
        DEFAULT: '#FFFFFF',
        secondary: '#F8FAFC',
        tertiary: '#F1F5F9',
      },
      foreground: {
        DEFAULT: '#0F172A',
        secondary: '#334155',
        muted: '#64748B',
      },
      accent: {
        purple: '#8B5CF6',
        blue: '#3B82F6',
        cyan: '#06B6D4',
      },
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      border: '#E2E8F0',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    },
  },
  dark: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
      background: {
        DEFAULT: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
      },
      foreground: {
        DEFAULT: '#F8FAFC',
        secondary: '#E2E8F0',
        muted: '#94A3B8',
      },
      accent: {
        purple: '#A78BFA',
        blue: '#60A5FA',
        cyan: '#22D3EE',
      },
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      border: '#1E293B',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
    },
  },
  animation: {
    fast: '0.15s ease-in-out',
    DEFAULT: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
}; 