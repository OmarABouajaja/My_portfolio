import { Suspense, lazy, forwardRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Activity, ChevronDown, Download } from "lucide-react";
import { CircuitBackground } from "@/components/CircuitBackground";
import { CountUp } from "@/components/CountUp";
import type { SiteMetadata } from "@/hooks/useSiteMetadata";
import { SITE } from "@/config/siteConfig";

const HeroCore = lazy(() =>
  import("@/components/HeroCore").then((m) => ({ default: m.HeroCore })),
);

interface Props {
  meta?: SiteMetadata;
}

export const Hero = ({ meta }: Props) => {
  const { t } = useTranslation();
  const hiring = meta?.hiring_status ?? true;

  return (
    <section id="hero" className="relative isolate flex min-h-screen items-center overflow-hidden pt-24">
      <CircuitBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated/60 px-3 py-1 terminal-text text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                  hiring ? "bg-success" : "bg-warning"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  hiring ? "bg-success" : "bg-warning"
                }`}
              />
            </span>
            {hiring ? t("hero.availability") : t("hero.unavailable")}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-6 terminal-text text-xs uppercase tracking-[0.4em] text-primary"
          >
            {t("hero.role")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight drop-shadow-lg"
          >
            <span className="text-gradient-cyber">{t("hero.name")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            {t("hero.tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-cyber px-5 py-3 font-medium text-primary-foreground shadow-glow-primary transition hover:shadow-elevated"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-background-elevated/40 px-5 py-3 font-medium text-foreground transition hover:border-primary hover:bg-primary/10"
            >
              <Activity className="h-4 w-4 text-primary" />
              {t("hero.cta2")}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={meta?.resume_url || SITE.resumePath}
              download={!meta?.resume_url ? SITE.resumeFilename : undefined}
              target={meta?.resume_url ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-secondary/40 bg-background-elevated/40 px-5 py-3 font-medium text-foreground transition hover:border-secondary hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 text-secondary" />
              {t("hero.resume")}
            </motion.a>
          </motion.div>

          {meta && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 grid grid-cols-3 gap-4 max-w-sm"
            >
              <Stat label={t("bento.activeProjects")}>
                <CountUp end={meta.active_projects_count} className="terminal-text text-lg text-primary" />
              </Stat>
              <Stat label={t("bento.uptime")}>
                <CountUp end={99.9} decimals={1} suffix="%" className="terminal-text text-lg text-primary" />
              </Stat>
              <Stat label={t("bento.deployedNodes")}>
                <CountUp end={42} className="terminal-text text-lg text-primary" />
              </Stat>
            </motion.div>
          )}
        </div>

        {/* 3D Core HUD Cadre */}
        <div className="relative h-[240px] sm:h-[360px] w-full lg:h-[560px] group">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
          
          {/* HUD Frame Container */}
          <div className="absolute inset-0 rounded-xl border border-primary/20 bg-background-elevated/20 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-[2px] overflow-hidden">
            
            {/* Corner Brackets */}
            <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-primary/60 rounded-tl-lg" />
            <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-primary/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-primary/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-primary/60 rounded-br-lg" />
            
            {/* HUD Labels */}
            <div className="absolute left-4 top-3 terminal-text text-[9px] uppercase tracking-[0.3em] text-primary/70">
              SYS.CORE.01
            </div>
            <div className="absolute bottom-3 right-4 terminal-text text-[9px] uppercase tracking-[0.3em] text-secondary/70 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              RENDERING_ACTIVE
            </div>
            
            {/* Scanning line */}
            <div className="absolute left-0 top-0 w-full h-[1px] bg-primary/40 shadow-[0_0_10px_#3b82f6] animate-scanline pointer-events-none" />
            
            <Suspense fallback={<CoreFallback />}>
              <HeroCoreWrapper />
            </Suspense>
          </div>
        </div>
      </div>

      <a
        href="#projects"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition"
        aria-label="Scroll"
      >
        <ChevronDown className="h-6 w-6 animate-pulse-slow" />
      </a>
    </section>
  );
};

const HeroCoreWrapper = forwardRef<HTMLDivElement>((_props, ref) => (
  <div ref={ref} className="h-full w-full">
    <HeroCore />
  </div>
));
HeroCoreWrapper.displayName = "HeroCoreWrapper";

const Stat = forwardRef<HTMLDivElement, { label: string; children: React.ReactNode }>(
  ({ label, children }, ref) => (
    <div ref={ref} className="glass-panel relative overflow-hidden rounded-md p-3 border-l-2 border-l-primary/50 bg-gradient-to-br from-background-elevated to-background shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
      <div className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground relative z-10">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  ),
);
Stat.displayName = "Stat";

const CoreFallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
  </div>
);
