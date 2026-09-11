import { useEffect, useState } from "react";

export type Theme = string;

export interface ThemeColors {
  primary: string;
  primaryGlow: string;
  accent: string;
  ring: string;
  secondary: string;
}

export const PRESET_THEMES: Record<string, ThemeColors> = {
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
  },
  "ocean-blue": {
    primary: "210 100% 50%",
    primaryGlow: "210 100% 60%",
    accent: "195 100% 45%",
    ring: "210 100% 50%",
    secondary: "180 100% 45%"
  },
  "dracula": {
    primary: "326 100% 74%",
    primaryGlow: "326 100% 80%",
    accent: "326 100% 65%",
    ring: "326 100% 74%",
    secondary: "265 89% 78%"
  },
  "synthwave": {
    primary: "315 100% 50%",
    primaryGlow: "315 100% 60%",
    accent: "315 100% 40%",
    ring: "315 100% 50%",
    secondary: "30 100% 50%"
  }
};

export const useThemeEngine = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("neon-cyan");
  const [customThemes, setCustomThemes] = useState<Record<string, ThemeColors>>({});

  useEffect(() => {
    // Load custom themes
    try {
      const stored = localStorage.getItem("bo3_custom_themes");
      if (stored) {
        setCustomThemes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to parse custom themes", e);
    }

    const saved = localStorage.getItem("os_theme");
    if (saved) {
      // Re-apply it after a tiny delay so customThemes state is loaded, or just read from localstorage again
      // Actually we can just apply immediately by merging them
      let allThemes = PRESET_THEMES;
      try {
        const stored = localStorage.getItem("bo3_custom_themes");
        if (stored) {
          allThemes = { ...PRESET_THEMES, ...JSON.parse(stored) };
        }
      } catch(e) {}
      
      if (allThemes[saved]) {
        applyThemeInternal(saved, allThemes);
      } else {
        applyThemeInternal("neon-cyan", allThemes);
      }
    } else {
      applyThemeInternal("neon-cyan", PRESET_THEMES);
    }
  }, []);

  const applyThemeInternal = (theme: Theme, allThemesMap: Record<string, ThemeColors>) => {
    const root = document.documentElement;
    const colors = allThemesMap[theme];
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

  const applyTheme = (theme: Theme) => {
    applyThemeInternal(theme, { ...PRESET_THEMES, ...customThemes });
  };

  const addCustomTheme = (name: string, colors: ThemeColors) => {
    const updated = { ...customThemes, [name]: colors };
    setCustomThemes(updated);
    localStorage.setItem("bo3_custom_themes", JSON.stringify(updated));
    applyThemeInternal(name, { ...PRESET_THEMES, ...updated });
  };

  const removeCustomTheme = (name: string) => {
    const updated = { ...customThemes };
    delete updated[name];
    setCustomThemes(updated);
    localStorage.setItem("bo3_custom_themes", JSON.stringify(updated));
    if (currentTheme === name) {
      applyThemeInternal("neon-cyan", { ...PRESET_THEMES, ...updated });
    }
  };

  const allThemes = { ...PRESET_THEMES, ...customThemes };

  return { 
    currentTheme, 
    applyTheme, 
    themes: Object.keys(allThemes),
    allThemeColors: allThemes,
    customThemes,
    addCustomTheme,
    removeCustomTheme
  };
};
