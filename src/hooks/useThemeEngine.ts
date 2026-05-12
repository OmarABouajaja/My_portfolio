import { useEffect, useState } from "react";

export type Theme = "neon-cyan" | "matrix-green" | "cyber-red";

const themes: Record<Theme, { primary: string, primaryGlow: string, accent: string, ring: string, secondary: string }> = {
  "neon-cyan": {
    primary: "215 100% 60%",
    primaryGlow: "215 100% 65%",
    accent: "187 95% 55%",
    ring: "187 95% 55%",
    secondary: "270 85% 65%"
  },
  "matrix-green": {
    primary: "142 76% 50%",
    primaryGlow: "142 80% 60%",
    accent: "142 70% 45%",
    ring: "142 95% 55%",
    secondary: "187 95% 55%"
  },
  "cyber-red": {
    primary: "0 84% 60%",
    primaryGlow: "0 90% 65%",
    accent: "0 84% 50%",
    ring: "0 84% 60%",
    secondary: "38 92% 60%"
  }
};

export const useThemeEngine = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("neon-cyan");

  useEffect(() => {
    const saved = localStorage.getItem("os_theme") as Theme;
    if (saved && themes[saved]) {
      applyTheme(saved);
    } else {
      applyTheme("neon-cyan"); // Default
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    const colors = themes[theme];
    if (colors) {
      root.style.setProperty("--primary", colors.primary);
      root.style.setProperty("--primary-glow", colors.primaryGlow);
      root.style.setProperty("--accent", colors.accent);
      root.style.setProperty("--ring", colors.ring);
      root.style.setProperty("--secondary", colors.secondary);
      
      root.style.setProperty("--gradient-cyber", `linear-gradient(135deg, hsl(${colors.primary}), hsl(${colors.secondary}))`);
      root.style.setProperty("--glow-primary", `0 0 40px hsl(${colors.primary} / 0.4), 0 0 80px hsl(${colors.primary} / 0.15)`);
      root.style.setProperty("--gradient-radial", `radial-gradient(circle at 50% 0%, hsl(${colors.primary} / 0.15), transparent 60%)`);
      root.style.setProperty("--gradient-grid", `linear-gradient(hsl(${colors.primary} / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(${colors.primary} / 0.15) 1px, transparent 1px)`);
      
      localStorage.setItem("os_theme", theme);
      setCurrentTheme(theme);
    }
  };

  return { currentTheme, applyTheme, themes: Object.keys(themes) as Theme[] };
};
