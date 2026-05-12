import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/hooks/useLocalized";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { Monitor, Cpu, Code2, Headphones, Keyboard, Mouse, Terminal } from "lucide-react";

type Equipment = {
  id: string;
  name: string;
  category: "hardware" | "software" | "iot" | "audio";
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
};

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "hardware": return <Monitor className="w-4 h-4" />;
    case "software": return <Code2 className="w-4 h-4" />;
    case "iot": return <Cpu className="w-4 h-4" />;
    case "audio": return <Headphones className="w-4 h-4" />;
    default: return <Terminal className="w-4 h-4" />;
  }
};

export const EquipmentSection = () => {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    safeFetchAll<Equipment>("equipment", { order: "display_order", ascending: true }).then(
      (data) => setEquipment(data)
    );
  }, []);

  if (equipment.length === 0) return null;

  const categories = Array.from(new Set(equipment.map(e => e.category)));

  return (
    <section id="equipment" className="relative mx-auto max-w-6xl px-6 py-24 border-t border-border/40">
      <div className="mb-12">
        <span className="terminal-text text-[10px] uppercase tracking-[0.2em] text-primary">
          // 04_arsenal
        </span>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {t("equipmentSection.title")}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("equipmentSection.subtitle")}
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <CategoryIcon category={category} />
              </div>
              <h3 className="font-display text-2xl font-semibold capitalize">{category}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.filter(e => e.category === category).map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id}
                  className="glass-panel flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border/50 hover:bg-background-elevated transition group"
                >
                  {item.image_url ? (
                    <div className="w-full md:w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-background">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ) : (
                    <div className="w-full md:w-24 h-24 shrink-0 rounded-lg bg-background-elevated flex items-center justify-center border border-border/50">
                      <CategoryIcon category={category} />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {pick(item, "description")}
                    </p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest terminal-text text-primary mt-3 hover:underline">
                        {t("equipmentSection.link")} ↗
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
