import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Cpu, Wifi, Code2, Database, GitBranch, Box, Cog, Layers,
  Radio, Server, Terminal, Bot, Workflow, CircuitBoard, Zap, Globe,
} from "lucide-react";
import { SectionHeader } from "@/components/BentoSection";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";

const ICON_MAP: Record<string, React.ReactNode> = {
  code: <Code2 className="h-3.5 w-3.5" />,
  globe: <Globe className="h-3.5 w-3.5" />,
  server: <Server className="h-3.5 w-3.5" />,
  database: <Database className="h-3.5 w-3.5" />,
  layers: <Layers className="h-3.5 w-3.5" />,
  zap: <Zap className="h-3.5 w-3.5" />,
  box: <Box className="h-3.5 w-3.5" />,
  circuit: <CircuitBoard className="h-3.5 w-3.5" />,
  cpu: <Cpu className="h-3.5 w-3.5" />,
  radio: <Radio className="h-3.5 w-3.5" />,
  terminal: <Terminal className="h-3.5 w-3.5" />,
  bot: <Bot className="h-3.5 w-3.5" />,
  workflow: <Workflow className="h-3.5 w-3.5" />,
  git: <GitBranch className="h-3.5 w-3.5" />,
  wifi: <Wifi className="h-3.5 w-3.5" />,
  cog: <Cog className="h-3.5 w-3.5" />,
};

type Skill = {
  id: string;
  name: string;
  icon: string;
  display_order: number;
};



const COPY = {
  en: { eyebrow: "// 04_runtime", title: "Tech Stack", subtitle: "Modules currently loaded into the runtime." },
  es: { eyebrow: "// 04_runtime", title: "Stack Técnico", subtitle: "Módulos cargados actualmente en el runtime." },
  fr: { eyebrow: "// 04_runtime", title: "Stack technique", subtitle: "Modules actuellement chargés dans le runtime." },
  ar: { eyebrow: "// 04_runtime", title: "المكونات التقنية", subtitle: "الوحدات المحمّلة حاليًا في النظام." },
};

export const TechMarquee = () => {
  const { i18n } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const lang = (i18n.language as keyof typeof COPY) || "en";
  const c = COPY[lang] ?? COPY.en;

  useEffect(() => {
    safeFetchAll<Skill>("skills", { order: "display_order", ascending: true }).then(
      (data) => setSkills(data)
    );
  }, []);

  if (skills.length === 0) return null;

  // Duplicate twice for seamless loop
  const row = [...skills, ...skills];

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <SectionHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <div className="mt-10 relative overflow-hidden">
        {/* edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex gap-3 marquee-track">
          {row.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="glass-panel flex shrink-0 items-center gap-2 rounded-full px-4 py-2 transition hover:border-primary/60 hover:shadow-glow-primary shadow-[inset_0_0_12px_rgba(34,211,238,0.03)]"
            >
              <div className="text-primary">{ICON_MAP[s.icon] || ICON_MAP.code}</div>
              <span className="terminal-text text-xs uppercase tracking-wider text-foreground">
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-3 marquee-track-reverse">
          {row.reverse().map((s, i) => (
            <div
              key={`r-${s.name}-${i}`}
              className="glass-panel flex shrink-0 items-center gap-2 rounded-full px-4 py-2 transition hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] shadow-[inset_0_0_12px_rgba(168,85,247,0.03)]"
            >
              <div className="text-secondary">{ICON_MAP[s.icon] || ICON_MAP.code}</div>
              <span className="terminal-text text-xs uppercase tracking-wider text-foreground">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
