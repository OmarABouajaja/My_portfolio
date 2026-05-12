import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/hooks/useLocalized";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { Cpu, LayoutTemplate, Terminal, Server, ArrowRight } from "lucide-react";

type Service = {
  id: string;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  features_en: string[]; features_es: string[] | null; features_fr: string[] | null; features_ar: string[] | null;
  icon: string;
  price_tier: string | null;
  display_order: number;
};

const ICONS: Record<string, any> = { Cpu, LayoutTemplate, Terminal, Server };

export const ServicesSection = () => {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    safeFetchAll<Service>("services", { order: "display_order", ascending: true }).then(setServices);
  }, []);

  if (!services.length) return null;

  // pick() works on {field_en, field_es, ...} rows — features are arrays, resolve manually
  const pickFeatures = (svc: Service): string[] => {
    const key = `features_${lang}` as keyof Service;
    const localized = svc[key] as string[] | null;
    return localized?.length ? localized : svc.features_en || [];
  };

  return (
    <section id="services" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12">
        <span className="terminal-text text-[10px] uppercase tracking-[0.2em] text-primary">
          // 03_services
        </span>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {t("servicesSection.title")}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("servicesSection.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, i) => {
          const Icon = ICONS[svc.icon] || Terminal;
          const features = pickFeatures(svc);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={svc.id}
              className="glass-panel group relative overflow-hidden rounded-2xl border border-border p-8 hover:border-primary/50 transition-all duration-500"
            >
              <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                {svc.price_tier && (
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground terminal-text bg-background-elevated px-2 py-1 rounded-md">
                    {svc.price_tier}
                  </span>
                )}
              </div>

              <h3 className="font-display text-xl font-bold mb-3">{pick(svc, "title")}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                {pick(svc, "description")}
              </p>

              <div className="space-y-3 mb-8">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="text-primary mt-0.5">▹</span>
                    <span className="text-foreground/80">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <a
                  href="#contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-background-elevated px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition group-hover:bg-primary/10 group-hover:text-primary"
                >
                  {t("servicesSection.cta")} <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
