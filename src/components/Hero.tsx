import { Suspense, lazy, forwardRef, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="hero" className="relative isolate flex min-h-[100dvh] items-center overflow-hidden pt-20 pb-16 sm:py-24">
      <CircuitBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center mt-8 sm:mt-0">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated/60 px-3 py-1 terminal-text text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
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
            className="mt-4 sm:mt-6 terminal-text text-[10px] sm:text-xs uppercase tracking-[0.4em] text-primary"
          >
            {t("hero.role")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-2 sm:mt-3 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight drop-shadow-lg"
          >
            <span className="text-gradient-cyber">{t("hero.name")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground"
          >
            {t("hero.tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3"
          >
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-gradient-cyber px-5 py-3.5 sm:py-3 font-medium text-primary-foreground shadow-glow-primary transition hover:shadow-elevated touch-target"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-primary/40 bg-background-elevated/40 px-5 py-3.5 sm:py-3 font-medium text-foreground transition hover:border-primary hover:bg-primary/10 touch-target"
            >
              <Activity className="h-4 w-4 text-primary" />
              {t("hero.cta2")}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={meta?.resume_url || SITE.resumePath}
              download={!meta?.resume_url ? SITE.resumeFilename : undefined}
              target={meta?.resume_url ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-secondary/40 bg-background-elevated/40 px-5 py-3.5 sm:py-3 font-medium text-foreground transition hover:border-secondary hover:bg-secondary/10 touch-target"
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
              className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-sm"
            >
              <Stat label={t("bento.activeProjects")}>
                <CountUp end={meta.active_projects_count} className="terminal-text text-base sm:text-lg text-primary" />
              </Stat>
              <Stat label={t("bento.uptime")}>
                <CountUp end={99.9} decimals={1} suffix="%" className="terminal-text text-base sm:text-lg text-primary" />
              </Stat>
              <Stat label={t("bento.deployedNodes")}>
                <CountUp end={42} className="terminal-text text-base sm:text-lg text-primary" />
              </Stat>
            </motion.div>
          )}
        </div>

        {/* 3D Core HUD Cadre or Mobile Fallback */}
        <div className="relative h-[280px] sm:h-[360px] w-full lg:h-[560px] group mt-6 lg:mt-0">
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-3xl transition-opacity duration-700 group-hover:opacity-80 opacity-30" />
          
          {/* Clean Frame Container */}
          <div className="absolute inset-0 rounded-xl border border-border/40 bg-background-elevated/30 backdrop-blur-[2px] overflow-hidden">
            
            {/* Subtle corner accents */}
            <div className="absolute left-0 top-0 h-5 sm:h-6 w-5 sm:w-6 border-l border-t border-primary/30 rounded-tl-lg" />
            <div className="absolute right-0 top-0 h-5 sm:h-6 w-5 sm:w-6 border-r border-t border-primary/30 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 h-5 sm:h-6 w-5 sm:w-6 border-b border-l border-primary/30 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 h-5 sm:h-6 w-5 sm:w-6 border-b border-r border-primary/30 rounded-br-lg" />
            
            <Suspense fallback={<CoreFallback />}>
              <HeroCoreWrapper isMobile={isMobile} />
            </Suspense>
          </div>
        </div>
      </div>

      <a
        href="#projects"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition p-2 touch-target flex items-center justify-center"
        aria-label="Scroll"
      >
        <ChevronDown className="h-6 w-6 animate-pulse-slow" />
      </a>
    </section>
  );
};

const HeroCoreWrapper = forwardRef<HTMLDivElement, { isMobile?: boolean }>((props, ref) => (
  <div ref={ref} className="h-full w-full">
    <HeroCore isMobile={props.isMobile} />
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
