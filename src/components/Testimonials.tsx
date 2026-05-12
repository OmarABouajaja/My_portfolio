import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { useLocalized } from "@/hooks/useLocalized";
import { SectionHeader } from "@/components/BentoSection";

type Testimonial = {
  id: string;
  client_name: string;
  client_role: string;
  content_en: string; content_es: string | null; content_fr: string | null; content_ar: string | null;
  avatar_url: string | null;
  rating: number;
  featured: boolean;
  display_order: number;
};

export const Testimonials = () => {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    safeFetchAll<Testimonial>("testimonials", { order: "display_order", ascending: true }).then(
      (data) => setItems(data.filter(t => t.featured))
    );
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader 
        eyebrow="// 05_feedback" 
        title={t("testimonials.title")} 
        subtitle={t("testimonials.subtitle")} 
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel spotlight-container relative overflow-hidden rounded-xl p-6 transition hover:border-primary/50 hover:shadow-glow-primary group"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-cyber opacity-0 transition group-hover:opacity-[0.03]" />
            <div className="relative z-10">
              <div className="flex text-primary mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground min-h-[80px]">
                "{pick(item, "content")}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-elevated text-primary">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.client_name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.client_name}</h4>
                  <p className="terminal-text text-[10px] uppercase text-muted-foreground">{item.client_role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
