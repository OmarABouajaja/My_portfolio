import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Cpu, Github, Server, Wifi, Database, Cog } from "lucide-react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { useLocalized } from "@/hooks/useLocalized";
import type { SiteMetadata } from "@/hooks/useSiteMetadata";

type Project = {
  id: string;
  slug: string;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  category: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
};

interface Props { meta?: SiteMetadata }

export const BentoSection = ({ meta }: Props) => {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    safeFetchAll<Project>("projects", { order: "display_order", ascending: true }).then(
      (data) => setProjects(data)
    );
  }, []);

  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const lastBuild = meta ? new Date(meta.last_build).toLocaleDateString() : "—";

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="// 02_modules"
        title={t("bento.featured")}
        subtitle={t("bento.subtitle")}
      />

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[180px]">
        {/* Featured project 1 — large */}
        {featured[0] && (
          <BentoCard className="md:col-span-4 md:row-span-2 group">
            <ProjectCardContent project={featured[0]} pick={pick} large />
          </BentoCard>
        )}

        {/* Live stats */}
        <BentoCard className="md:col-span-2">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
                {t("bento.liveStats")}
              </span>
              <span className="flex items-center gap-1 text-[10px] terminal-text uppercase text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                live
              </span>
            </div>
            <div className="space-y-2">
              <StatRow icon={<Database className="h-3.5 w-3.5" />} label={t("bento.activeProjects")} value={String(meta?.active_projects_count ?? "--")} />
              <StatRow icon={<Server className="h-3.5 w-3.5" />} label={t("bento.uptime")} value="99.9%" />
              <StatRow icon={<Wifi className="h-3.5 w-3.5" />} label={t("bento.lastBuild")} value={lastBuild} />
            </div>
          </div>
        </BentoCard>

        {/* Service categories */}
        <BentoCard className="md:col-span-2">
          <span className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("bento.services")}
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {[t("services.robotics"), t("services.iot"), t("services.fullstack"), t("services.consulting")].map((s) => (
              <span key={s} className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] text-foreground">
                {s}
              </span>
            ))}
          </div>
        </BentoCard>

        {/* Featured project 2 */}
        {featured[1] && (
          <BentoCard className="md:col-span-3 md:row-span-2 group">
            <ProjectCardContent project={featured[1]} pick={pick} />
          </BentoCard>
        )}

        {/* Other projects */}
        {projects
          .filter((p) => !p.featured)
          .map((p) => (
            <BentoCard key={p.id} className="md:col-span-3 group">
              <ProjectCardContent project={p} pick={pick} compact />
            </BentoCard>
          ))}
      </div>
    </section>
  );
};

const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`spotlight-container glass-panel relative rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow-primary ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-cyber opacity-0 transition group-hover:opacity-[0.08]"
        style={{ transform: "translateZ(-10px)" }}
      />
      <div className="relative z-[1] h-full" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const StatRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border/40 pb-1.5 last:border-none last:pb-0">
    <span className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
    <span className="terminal-text text-sm text-foreground">{value}</span>
  </div>
);

interface PCProps { project: Project; pick: ReturnType<typeof useLocalized>["pick"]; large?: boolean; compact?: boolean }
const ProjectCardContent = ({ project, pick, large, compact }: PCProps) => (
  <div className="flex h-full flex-col">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 terminal-text text-[10px] uppercase tracking-widest text-primary">
          <Cog className="h-3 w-3" />
          {project.category}
        </div>
        <h3 className={`mt-2 font-display font-semibold leading-tight ${large ? "text-3xl" : compact ? "text-lg" : "text-2xl"}`}>
          {pick(project, "title")}
        </h3>
      </div>
      <div className="flex gap-1">
        {project.github_url && (
          <a aria-label="GitHub" href={project.github_url} target="_blank" rel="noreferrer" className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary">
            <Github className="h-3.5 w-3.5" />
          </a>
        )}
        {project.live_url && (
          <a aria-label="Live" href={project.live_url} target="_blank" rel="noreferrer" className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>

    {!compact && (
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {pick(project, "description")}
      </p>
    )}

    <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
      {project.tech_stack.slice(0, large ? 8 : 4).map((tech) => (
        <span key={tech} className="terminal-text text-[10px] uppercase rounded border border-primary/20 bg-gradient-to-br from-background-elevated to-background px-1.5 py-0.5 text-muted-foreground shadow-sm">
          {tech}
        </span>
      ))}
    </div>
  </div>
);

const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div>
    <div className="terminal-text text-xs uppercase tracking-[0.4em] text-primary">{eyebrow}</div>
    <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
    {subtitle && <p className="mt-3 max-w-xl text-muted-foreground">{subtitle}</p>}
  </div>
);

export { SectionHeader };
