import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { FetchState } from "@/hooks/useSiteMetadata";
import { gatherClientTelemetry, type ClientTelemetry } from "@/utils/telemetry";
import { dbInsert } from "@/integrations/supabase/mutations";
import { SITE } from "@/config/siteConfig";

type Line = { tag: string; tagClass: string; text: string; delay?: number };

interface Props {
  state: FetchState;
  onEngage?: () => void;
  onDone: () => void;
}

export const BootLoader = ({ state, onEngage, onDone }: Props) => {
  const { t } = useTranslation();
  const [printed, setPrinted] = useState<Line[]>([]);
  const [progress, setProgress] = useState(0);
  const [dissolving, setDissolving] = useState(false);
  const [readyToEngage, setReadyToEngage] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [telemetry, setTelemetry] = useState<ClientTelemetry | null>(null);
  const [botBlocked, setBotBlocked] = useState(false);

  useEffect(() => {
    const tel = gatherClientTelemetry();
    setTelemetry(tel);
    
    // Fire and forget insertion of visitor log
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => {
        dbInsert("visitor_logs", {
          ip_address: data.ip || "unknown",
          os: tel.os,
          browser: tel.browser,
          location: tel.timezone
        });
      })
      .catch(() => {
        dbInsert("visitor_logs", {
          ip_address: "unknown",
          os: tel.os,
          browser: tel.browser,
          location: tel.timezone
        });
      });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  const lines = useMemo<Line[]>(() => {
    const isOnline = state.status === "online";
    const projectCount = state.status === "loading" ? 0 : (state as any).projectCount ?? 0;
    const tStats = telemetry || { os: "...", browser: "...", resolution: "...", timezone: "..." };

    const seq: Line[] = [
      {
        tag: "[SYS]",
        tagClass: "text-primary",
        text: "> BOOT SEQUENCE INITIATED — THE_BO3 v3.2",
        delay: 120,
      },
      {
        tag: "[KERN]",
        tagClass: "text-primary",
        text: `> GATHERING CLIENT SPECS ...`,
        delay: 100,
      },
      {
        tag: "[KERN]",
        tagClass: "text-muted-foreground",
        text: `  > DETECTED OS ................ ${tStats.os}`,
        delay: 80,
      },
      {
        tag: "[KERN]",
        tagClass: "text-muted-foreground",
        text: `  > BROWSER ENGINE ............. ${tStats.browser}`,
        delay: 80,
      },
      {
        tag: "[KERN]",
        tagClass: "text-muted-foreground",
        text: `  > RESOLUTION ................. ${tStats.resolution}`,
        delay: 80,
      },
    ];

    if (telemetry?.isBot) {
      seq.push({
        tag: "[FATAL]",
        tagClass: "text-destructive",
        text: "> AUTOMATED BOT DETECTED. ACCESS DENIED.",
        delay: 50,
      });
      return seq;
    }

    seq.push(
      {
        tag: "[NET]",
        tagClass: "text-secondary",
        text: `> CONNECTING TO SUPABASE_CLOUD ...... ${isOnline ? "ESTABLISHED" : "FALLBACK_MODE"}`,
        delay: 220,
      },
      {
        tag: "[IOT]",
        tagClass: "text-[hsl(142_76%_50%)]",
        text: `> INITIALIZING IOT_CORE ............. OK`,
        delay: 160,
      },
      {
        tag: "[DATA]",
        tagClass: "text-secondary",
        text: `> FETCHING PROJECT_DATA ............. [${projectCount} modules loaded]`,
        delay: 200,
      },
      {
        tag: "[AUTH]",
        tagClass: "text-primary",
        text: `> ADMIN_GATEWAY ..................... SECURED`,
        delay: 140,
      },
      {
        tag: "[GPU]",
        tagClass: "text-secondary",
        text: `> WEBGL_RENDERER ................... INITIALIZED`,
        delay: 160,
      },
      {
        tag: "[i18n]",
        tagClass: "text-primary",
        text: `> LOCALIZATION_ENGINE ............... 4 LOCALES`,
        delay: 120,
      },
      {
        tag: "[SYS]",
        tagClass: "text-[hsl(142_76%_50%)]",
        text: `> SYSTEM READY. KERNEL_V3 — ALL SYSTEMS NOMINAL`,
        delay: 100,
      }
    );

    return seq;
  }, [state, telemetry]);

  useEffect(() => {
    if (state.status === "loading") return;
    setPrinted([]);
    let i = 0;
    const addLine = () => {
      if (i >= lines.length) {
        if (telemetry?.isBot) {
          setBotBlocked(true);
          return;
        }

        setTimeout(() => setReadyToEngage(true), 250);
        return;
      }
      i += 1;
      setPrinted(lines.slice(0, i));
      setProgress(Math.min(100, Math.round((i / lines.length) * 100)));
      setTimeout(addLine, lines[i - 1]?.delay ?? 100);
    };
    setTimeout(addLine, 150);
  }, [lines, state.status]);

  const engage = useCallback(() => {
    if (!readyToEngage || dissolving || botBlocked) return;
    setDissolving(true);
    onEngage?.();
    setTimeout(onDone, 850);
  }, [readyToEngage, dissolving, botBlocked, onEngage, onDone]);

  useEffect(() => {
    if (!readyToEngage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") engage();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [readyToEngage, engage]);

  return (
    <AnimatePresence>
      <motion.div
        key="boot"
        onClick={engage}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#030303] ${dissolving ? "dissolve-out" : ""}`}
        initial={{ opacity: 1 }}
      >
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scanline" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

        <div className="relative z-10 w-full max-w-3xl px-4 sm:px-6">
          <div className="glass-panel rounded-xl overflow-hidden shadow-elevated border border-primary/20">
            <div className="flex items-center gap-2 border-b border-border bg-[hsl(222_47%_5%)] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-4 terminal-text text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                the_bo3 — kernel boot
              </span>
              <div className="ml-auto flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <span className="terminal-text text-[9px] text-primary/70">LIVE</span>
              </div>
            </div>

            <div className="mt-4 animate-flicker opacity-50 flex items-center justify-center gap-2">
              <div className="h-1 w-4 bg-primary rounded-full"></div>
              <div className="h-1 w-1 bg-primary rounded-full animate-ping"></div>
              <div className="h-1 w-4 bg-primary rounded-full"></div>
            </div>
            
            <div className="mt-4 text-center text-[9px] text-muted-foreground uppercase tracking-widest animate-pulse">
              Click or press ENTER to engage
            </div>

            <div className="p-5 sm:p-7 terminal-text text-[13px] leading-7 bg-[hsl(222_47%_3%)]">
              <div className="mb-5 text-primary/50 text-[10px] leading-[1.3] hidden sm:block">
                <pre>{`╔════════════════════════════════════════════════════════════╗
║   ████████╗██╗  ██╗███████╗    ██████╗  ██████╗ ██████╗    ║
║   ╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██╔═══██╗╚════██╗   ║
║      ██║   ███████║█████╗      ██████╔╝██║   ██║ █████╔╝   ║
║      ██║   ██╔══██║██╔══╝      ██╔══██╗██║   ██║ ╚═══██╗   ║
║      ██║   ██║  ██║███████╗    ██████╔╝╚██████╔╝██████╔╝   ║
║      ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═════╝  ╚═════╝ ╚═════╝    ║
╚════════════════════════════════════════════════════════════╝`}</pre>
              </div>

              {/* Compact Mobile ASCII */}
              <div className="mb-4 text-primary/50 text-[8px] leading-[1.2] sm:hidden">
                <pre>{`╔═════════════════════════════╗
║ ██████╗ ██████╗ ██████╗   ║
║ ██╔══██╗██╔═══██╗╚════██╗ ║
║ ██████╔╝██║   ██║ █████╔╝ ║
║ ██╔══██╗██║   ██║ ╚═══██╗ ║
║ ██████╔╝╚██████╔╝██████╔╝ ║
║ ╚═════╝  ╚═════╝ ╚═════╝  ║
╚═════════════════════════════╝`}</pre>
              </div>

              <div className="mb-3 text-primary animate-flicker text-xs">
                ▌ welcome to my Space {`{${SITE.ownerName} Space }`}— Boot Sequence
              </div>

              <div className="space-y-0.5">
                {printed.map((l, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-wrap gap-2"
                  >
                    <span className={`${l.tagClass} font-semibold shrink-0`}>{l.tag}</span>
                    <span className="text-foreground/80">{l.text}</span>
                  </motion.div>
                ))}
                {state.status === "loading" && (
                  <div className="flex gap-2 text-muted-foreground">
                    <span className="text-primary font-semibold">[SYS]</span>
                    <span>
                      {"> "}CONTACTING CLOUD
                      <span className="animate-pulse">█</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span>system load</span>
                  <span className="tabular-nums">{progress.toString().padStart(3, "0")}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                  <motion.div
                    className="h-full rounded-full bg-gradient-cyber"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      boxShadow: "0 0 12px hsl(187 95% 55% / 0.6)",
                    }}
                  />
                </div>
              </div>

              {readyToEngage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 flex flex-col items-center gap-2"
                >
                  <div className="text-center text-[11px] uppercase tracking-[0.35em] text-primary">
                    {"> "}SYSTEM READY
                  </div>
                  <button
                    onClick={engage}
                    className="group mt-1 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-6 py-2.5 text-xs uppercase tracking-[0.3em] text-primary transition-all hover:border-primary hover:bg-primary/10 hover:shadow-glow-primary"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {t("boot.ready")}
                    {cursorVisible && <span className="text-primary">█</span>}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
