import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, Terminal, LayoutDashboard, Cpu, MessageSquare, Download, Settings, Globe, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { SITE } from "@/config/siteConfig";
import { useLocation } from "react-router-dom";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const { data: projects = [] } = useQuery({
    queryKey: ["command_projects"],
    queryFn: () => safeFetchAll<any>("projects"),
  });

  // Disable global CommandMenu on admin route — admin has its own palette
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (hash: string) => {
    window.location.hash = hash;
    setOpen(false);
  };

  if (isAdminRoute) return null;

  return (
    <>
      {/* Keyboard Hint UI (Desktop) */}
      <div className="fixed bottom-6 right-6 z-[90] hidden sm:flex items-center gap-2 rounded-full border border-primary/30 bg-background-elevated/40 px-4 py-2 backdrop-blur-xl shadow-glow-primary transition-all duration-300 hover:border-primary/80 hover:bg-background-elevated/60 cursor-pointer group" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        <span className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
          System Search
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-primary/20 bg-primary/10 px-1.5 font-mono text-[10px] font-medium text-primary opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Mobile FAB (Visible only on small screens) */}
      <button 
        onClick={() => setOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-cyber shadow-glow-primary flex items-center justify-center text-primary-foreground transition active:scale-95"
      >
        <Search className="h-6 w-6" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search modules..." />
        <CommandList>
          <CommandEmpty>No modules found.</CommandEmpty>
          <CommandGroup heading="System Navigation">
            <CommandItem onSelect={() => navigate("#hero")}>
              <Terminal className="mr-2 h-4 w-4 text-primary" />
              <span>Core Module</span>
            </CommandItem>
            <CommandItem onSelect={() => navigate("#projects")}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-secondary" />
              <span>Deployed Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => navigate("#timeline")}>
              <Cpu className="mr-2 h-4 w-4 text-primary" />
              <span>Execution Timeline</span>
            </CommandItem>
            <CommandItem onSelect={() => navigate("#contact")}>
              <MessageSquare className="mr-2 h-4 w-4 text-secondary" />
              <span>Initialize Handshake (Contact)</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Localization Engine">
            <CommandItem onSelect={() => { i18n.changeLanguage('en'); setOpen(false); }}>
              <Globe className="mr-2 h-4 w-4" />
              <span>Set Locale: English</span>
            </CommandItem>
            <CommandItem onSelect={() => { i18n.changeLanguage('fr'); setOpen(false); }}>
              <Globe className="mr-2 h-4 w-4" />
              <span>Set Locale: Français</span>
            </CommandItem>
            <CommandItem onSelect={() => { i18n.changeLanguage('es'); setOpen(false); }}>
              <Globe className="mr-2 h-4 w-4" />
              <span>Set Locale: Español</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="System Files">
            <CommandItem onSelect={() => { window.open(SITE.resumePath, "_blank"); setOpen(false); }}>
              <Download className="mr-2 h-4 w-4 text-primary" />
              <span>Download System Schematics (Resume)</span>
            </CommandItem>
            <CommandItem onSelect={() => { window.location.href = "/admin"; setOpen(false); }}>
              <Settings className="mr-2 h-4 w-4 text-warning" />
              <span>Access Admin Subsystem</span>
            </CommandItem>
          </CommandGroup>
          {projects.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Live Projects">
                {projects.map((p: any) => (
                  <CommandItem key={p.id} onSelect={() => { if(p.live_url) window.open(p.live_url, "_blank"); setOpen(false); }}>
                    <ArrowUpRight className="mr-2 h-4 w-4 text-accent" />
                    <span>{p.title_en || p.title_es || p.title_fr}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
