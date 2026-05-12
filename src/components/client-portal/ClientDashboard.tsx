import { useState } from "react";
import { SITE } from "@/config/siteConfig";
import { Shield, LogOut, FileText, MessageSquare, Cpu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { ProjectCard } from "./ProjectCard";
import { SecureChat } from "./SecureChat";
import type { ClientProject } from "./types";

export const ClientDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<"projects" | "chat">("projects");
  const clientName = sessionStorage.getItem("nexus_client_name") || "Client";
  const tokenId = sessionStorage.getItem("nexus_client_token_id") || "ct-1";

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["client_projects", tokenId],
    queryFn: async () => {
      const data = await safeFetchAll<ClientProject>("client_projects", {
        order: "created_at",
        ascending: true,
        filter: { client_token_id: tokenId },
      });
      return data.map(p => ({
        ...p,
        lastUpdate: p.last_update || p.lastUpdate || "recently",
        milestones: (p.milestones || []) as ClientProject["milestones"],
      }));
    },
  });

  const projectList = projects || [];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-sm tracking-tight">{SITE.clientPortalTitle}</h1>
              <p className="text-[9px] terminal-text uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Authenticated · Token Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Main Site
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors border border-transparent hover:border-destructive/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
            Welcome, <span className="text-gradient-cyber">{clientName}</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your active projects and communicate securely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Active", value: projectList.filter(p => p.status === "active").length, color: "text-accent" },
            { label: "In Review", value: projectList.filter(p => p.status === "review").length, color: "text-warning" },
            { label: "Completed", value: projectList.filter(p => p.status === "completed").length, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="glass-panel rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold terminal-text ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest terminal-text mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-background-elevated/50 border border-border/30 mb-6 w-fit">
          {([
            { key: "projects" as const, icon: FileText, label: "Projects" },
            { key: "chat" as const, icon: MessageSquare, label: "Secure Chat" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "projects" ? (
          loadingProjects ? (
            <div className="flex justify-center py-12"><Cpu className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-4">
              {projectList.length > 0 ? (
                projectList.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))
              ) : (
                <div className="text-center py-12 glass-panel rounded-xl">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">No active projects found for this token.</p>
                </div>
              )}
            </div>
          )
        ) : (
          <SecureChat />
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] text-muted-foreground/40 terminal-text uppercase tracking-widest">
            {SITE.brandHandle} · {SITE.clientPortalTitle} · Encrypted Session
          </p>
        </div>
      </main>
    </div>
  );
};
