import { useThemeEngine, Theme } from "@/hooks/useThemeEngine";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_NAMES: Record<Theme, string> = {
  "neon-cyan": "Neon Cyan",
  "matrix-green": "Matrix Green",
  "cyber-red": "Cyber Red",
};

export const ThemeSwitcher = () => {
  const { currentTheme, applyTheme, themes } = useThemeEngine();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change Theme"
          className="group inline-flex items-center gap-2 rounded-md border border-border bg-background-elevated/80 px-3 py-1.5 text-xs terminal-text tracking-wider text-muted-foreground transition-all hover:border-primary/80 hover:text-primary hover:shadow-glow-primary"
        >
          <Palette className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-bold uppercase hidden sm:inline-block">Theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel min-w-[150px]">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => applyTheme(t)}
            className={`cursor-pointer terminal-text text-xs uppercase tracking-wider group relative flex items-center gap-2 ${
              currentTheme === t ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div 
              className={`w-2 h-2 rounded-full ${currentTheme === t ? "bg-primary shadow-[0_0_8px_rgba(var(--primary))]" : "bg-muted-foreground"}`} 
            />
            {THEME_NAMES[t]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
