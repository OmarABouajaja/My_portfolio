import { useState, useId } from "react";
import { Clock, Zap, AlertTriangle, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import type { ClientProject } from "./types";

const statusColors: Record<string, string> = {
  active: "text-accent",
  review: "text-warning",
  completed: "text-success",
};

const statusIcons: Record<string, typeof Clock> = {
  active: Zap,
  review: AlertTriangle,
  completed: CheckCircle2,
};

export const ProjectCard = ({ project }: { project: ClientProject }) => {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = statusIcons[project.status] || Clock;
  const contentId = useId();

  return (
    <div className="glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow-primary/20 group">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="w-full text-left p-5 flex items-start justify-between gap-4 focus:outline-none focus:bg-primary/5"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <StatusIcon className={`w-4 h-4 shrink-0 ${statusColors[project.status]}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest terminal-text ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          <h3 className="font-display font-semibold text-foreground truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {project.lastUpdate || project.last_update}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Circular progress */}
          <div className="relative w-12 h-12">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={project.status === "completed" ? "hsl(var(--success))" : "hsl(var(--primary))"}
                strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${project.progress * 0.9425} 94.25`}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold terminal-text">
              {project.progress}%
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* Milestones */}
      <div 
        id={contentId}
        className={`overflow-hidden transition-all duration-400 ${expanded ? "max-h-80" : "max-h-0"}`}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-border/40 pt-4">
            <p className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Milestones</p>
            <div className="space-y-2.5">
              {project.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                    m.status === "done" ? "bg-success" :
                    m.status === "active" ? "bg-primary animate-pulse" :
                    "bg-muted-foreground/30"
                  }`} />
                  {m.status !== "pending" && m.status !== "done" && (
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-primary/30 animate-ping" />
                  )}
                  <span className={`text-sm ${m.status === "pending" ? "text-muted-foreground/50" : "text-foreground"}`}>
                    {m.label}
                  </span>
                  {m.status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-success ml-auto shrink-0" />}
                  {m.status === "active" && <Activity className="w-3.5 h-3.5 text-primary ml-auto shrink-0 animate-pulse" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
