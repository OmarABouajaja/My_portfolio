import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FLAG_MAP } from "@/components/FlagIcons";

export type LangCode = "en" | "es" | "fr" | "ar";

const LANGS: { code: LangCode; label: string; flag: string; native: string }[] = [
  { code: "en", label: "English", flag: "US", native: "EN" },
  { code: "es", label: "Español", flag: "ES", native: "ES" },
  { code: "fr", label: "Français", flag: "FR", native: "FR" },
  { code: "ar", label: "العربية (تونس)", flag: "TN", native: "AR" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language as LangCode) || "en";

  useEffect(() => {
    const isRTL = current === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = current;
  }, [current]);

  const active = LANGS.find((l) => l.code === current) ?? LANGS[0];
  const ActiveFlag = FLAG_MAP[active.flag];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change language"
          className="group inline-flex items-center gap-2 rounded-md border border-border bg-background-elevated/80 px-3 py-1.5 text-xs terminal-text uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/80 hover:text-primary hover:shadow-glow-primary"
        >
          {ActiveFlag ? (
            <span className="text-[18px] leading-none">
              <ActiveFlag />
            </span>
          ) : (
            <Globe className="h-3.5 w-3.5 animate-pulse" />
          )}
          <span className="font-bold">{active.native}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel min-w-[180px]">
        {LANGS.map((l) => {
          const FlagIcon = FLAG_MAP[l.flag];
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={() => i18n.changeLanguage(l.code)}
              className="cursor-pointer terminal-text text-xs uppercase tracking-wider group relative"
            >
              <span className="text-[18px] leading-none">
                {FlagIcon ? <FlagIcon /> : l.flag}
              </span>
              <span className="ml-3 flex-1">{l.label}</span>
              {current === l.code && <Check className="h-3.5 w-3.5 text-primary drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
