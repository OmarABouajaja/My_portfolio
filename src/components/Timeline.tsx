import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Award, Cpu, Rocket, Star } from "lucide-react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { useLocalized } from "@/hooks/useLocalized";
import { SectionHeader } from "@/components/BentoSection";

type Event = {
  id: string;
  year: number;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  icon: string;
  highlight: boolean;
  display_order: number;
};

const ICONS: Record<string, React.ReactNode> = {
  cpu: <Cpu className="h-4 w-4" />,
  award: <Award className="h-4 w-4" />,
  rocket: <Rocket className="h-4 w-4" />,
  star: <Star className="h-4 w-4" />,
};

const renderIcon = (iconStr: string) => {
  if (!iconStr) return <Cpu className="h-4 w-4" />;
  if (iconStr.startsWith("/") || iconStr.startsWith("http")) {
    return <img src={iconStr} alt="icon" className="h-5 w-5 object-contain" />;
  }
  return ICONS[iconStr] ?? <Cpu className="h-4 w-4" />;
};

export const Timeline = () => {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    safeFetchAll<Event>("timeline_events", { order: "display_order", ascending: true }).then(
      (data) => setEvents(data)
    );
  }, []);

  return (
    <section id="timeline" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader eyebrow="// 03_boot_log" title={t("timeline.title")} subtitle={t("timeline.subtitle")} />

      <div className="relative mt-14 ms-4 sm:ms-12">
        {/* Vertical circuit trace */}
        <div className="absolute start-3 top-0 bottom-0 w-[2px] overflow-hidden bg-gradient-to-b from-primary/0 via-primary/30 to-secondary/30">
          <motion.div
            className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-transparent via-primary to-transparent blur-[2px]"
            animate={{
              y: ["-100%", "500%"],
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
        <div className="absolute start-[10px] top-0 bottom-0 w-1.5 bg-primary/10 blur-sm" />

        <ul className="space-y-10">
          {events.map((e, idx) => (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: idx * 0.08 }}
              className="relative ps-12"
            >
              {/* Node */}
              <div className="absolute start-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-primary/60 bg-background-elevated text-primary shadow-glow-primary overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                <span className="relative z-10 flex items-center justify-center">{renderIcon(e.icon)}</span>
              </div>

              <div className="glass-panel rounded-lg p-5 transition-all hover:-translate-y-1 hover:shadow-glow-primary hover:border-primary/50">
                <div className="flex items-center gap-3">
                  <span className="terminal-text text-xs uppercase tracking-widest text-primary">{e.year}</span>
                  {e.highlight && (
                    <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-secondary">
                      milestone
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold">{pick(e, "title")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(e, "description")}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
