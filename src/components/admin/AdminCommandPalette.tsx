import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Search, Gauge, FolderKanban, Clock, Wrench, Code2, Monitor, BadgeCheck,
  Cpu, Wifi, Share2, Smartphone, Wallet, Receipt, ScrollText, MessageSquare, 
  Star, Link2, Activity, BrainCircuit, LayoutGrid, BookOpen, TerminalSquare,
  ShieldAlert, Database, HardDrive, Cloud, BarChart3, Settings, LogOut, 
  Palette, Inbox, Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useThemeEngine } from "@/hooks/useThemeEngine";

interface Props {
  setActiveTab: (tab: string) => void;
}

// All searchable modules with keywords for fuzzy matching
const ALL_MODULES = [
  // Core
  { tab: "overview", icon: Gauge, label: "Dashboard", desc: "Overview & analytics", color: "text-primary", keywords: "home overview dashboard stats main" },
  { tab: "timeline", icon: Clock, label: "Timeline", desc: "Career history events", color: "text-primary", keywords: "timeline career history events milestones" },
  { tab: "projects", icon: FolderKanban, label: "Projects", desc: "Portfolio projects", color: "text-primary", keywords: "projects portfolio work showcase" },
  { tab: "services", icon: Wrench, label: "Services", desc: "Service offerings", color: "text-primary", keywords: "services offerings pricing packages" },
  { tab: "skills", icon: Code2, label: "Tech Stack", desc: "Skills & technologies", color: "text-primary", keywords: "skills stack tech technologies code" },
  { tab: "equipment", icon: Monitor, label: "Equipment", desc: "Hardware & setup", color: "text-primary", keywords: "equipment hardware setup gear desk" },
  { tab: "certifications", icon: BadgeCheck, label: "Certifications", desc: "Professional certs", color: "text-primary", keywords: "certifications certs credentials badges" },
  // Ecosystem
  { tab: "iot", icon: Cpu, label: "IoT Fleet", desc: "Connected devices", color: "text-secondary", keywords: "iot fleet hardware nodes sensors arduino" },
  { tab: "devices", icon: Smartphone, label: "Devices", desc: "Device matrix", color: "text-accent", keywords: "devices phones tablets matrix" },
  { tab: "localdrop", icon: Share2, label: "LocalDrop", desc: "File sharing", color: "text-accent", keywords: "localdrop share files transfer airdrop" },
  // Freelance
  { tab: "client_messages", icon: Inbox, label: "Client Comms", desc: "Secure messaging", color: "text-success", keywords: "client messages chat comms communication" },
  { tab: "finance", icon: Wallet, label: "Finances", desc: "Revenue & expenses", color: "text-primary", keywords: "finance money revenue expenses budget" },
  { tab: "invoices", icon: Receipt, label: "Invoices", desc: "Invoice generator", color: "text-primary", keywords: "invoices billing pdf generator clients" },
  { tab: "resume", icon: ScrollText, label: "Resume Pro", desc: "Dynamic CV builder", color: "text-accent", keywords: "resume cv curriculum vitae pdf" },
  { tab: "contact", icon: MessageSquare, label: "Inbox", desc: "Contact submissions", color: "text-primary", keywords: "contact inbox messages email submissions" },
  { tab: "testimonials", icon: Star, label: "Feedback", desc: "Client reviews", color: "text-primary", keywords: "testimonials feedback reviews ratings" },
  { tab: "social_links", icon: Link2, label: "Social Links", desc: "Contact channels", color: "text-accent", keywords: "social links github linkedin twitter contacts" },
  // Personal
  { tab: "lifeos", icon: Activity, label: "Life OS", desc: "Focus & habits", color: "text-secondary", keywords: "lifeos adhd focus habits brain dump" },
  { tab: "neuralflow", icon: BrainCircuit, label: "Neural Flow", desc: "Brain visualization", color: "text-destructive", keywords: "neural flow brain visualization ai" },
  { tab: "nexusboard", icon: LayoutGrid, label: "Task Board", desc: "Kanban tasks", color: "text-accent", keywords: "nexus board tasks kanban todos" },
  { tab: "blog", icon: BookOpen, label: "Blog", desc: "Articles & posts", color: "text-primary", keywords: "blog articles posts writing technical" },
  { tab: "vault", icon: TerminalSquare, label: "Cmd Vault", desc: "Command snippets", color: "text-success", keywords: "vault commands terminal snippets cli" },
  { tab: "encrypted_vault", icon: ShieldAlert, label: "Secret Vault", desc: "Encrypted storage", color: "text-destructive", keywords: "encrypted vault secrets passwords secure" },
  // System
  { tab: "datanexus", icon: Database, label: "Data Hub", desc: "Data explorer", color: "text-accent", keywords: "data nexus hub explorer tables" },
  { tab: "storage", icon: HardDrive, label: "DB & Storage", desc: "Database management", color: "text-warning", keywords: "storage database backup export import" },
  { tab: "cloud_infra", icon: Cloud, label: "Cloud Infra", desc: "Cloudflare & Supabase", color: "text-[#f48120]", keywords: "cloud infra cloudflare supabase servers dns" },
  { tab: "telemetry", icon: BarChart3, label: "Telemetry", desc: "Visitor analytics", color: "text-primary", keywords: "telemetry analytics visitors tracking logs" },
  { tab: "settings", icon: Settings, label: "Settings", desc: "System config", color: "text-primary", keywords: "settings config metadata options preferences" },
];

export const AdminCommandPalette = ({ setActiveTab }: Props) => {
  const [open, setOpen] = useState(false);
  const { themes, applyTheme, currentTheme } = useThemeEngine();

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

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    try {
      sessionStorage.removeItem("nexus_demo_mode");
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const handleThemeCycle = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
    setOpen(false);
    toast.success(`Theme switched to ${themes[nextIndex]}`);
  };

  const handleDownloadApk = () => {
    window.open("https://github.com/Omar-ABouajaja/My_portfolio/releases/latest/download/app-debug.apk", "_blank");
    setOpen(false);
  };

  // Group modules by category
  const coreModules = ALL_MODULES.filter(m => ["overview","timeline","projects","services","skills","equipment","certifications"].includes(m.tab));
  const ecosystemModules = ALL_MODULES.filter(m => ["iot","devices","localdrop"].includes(m.tab));
  const freelanceModules = ALL_MODULES.filter(m => ["client_messages","finance","invoices","resume","contact","testimonials","social_links"].includes(m.tab));
  const personalModules = ALL_MODULES.filter(m => ["lifeos","neuralflow","nexusboard","blog","vault","encrypted_vault"].includes(m.tab));
  const systemModules = ALL_MODULES.filter(m => ["datanexus","storage","cloud_infra","telemetry","settings"].includes(m.tab));

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search modules, actions, settings..." />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
              <Search className="w-8 h-8 opacity-40" />
              <p className="text-sm">No matching modules found.</p>
              <p className="text-xs opacity-60">Try searching by keyword.</p>
            </div>
          </CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={handleThemeCycle}>
              <Palette className="mr-2 h-4 w-4 text-accent" />
              <div className="flex flex-col">
                <span>Cycle Theme</span>
                <span className="text-[10px] text-muted-foreground">Switch OS color scheme</span>
              </div>
            </CommandItem>
            <CommandItem onSelect={handleDownloadApk}>
              <Download className="mr-2 h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span>Download APK</span>
                <span className="text-[10px] text-muted-foreground">Get the Android app</span>
              </div>
            </CommandItem>
            <CommandItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-destructive" />
              <div className="flex flex-col">
                <span>Lock OS</span>
                <span className="text-[10px] text-muted-foreground">Sign out of admin</span>
              </div>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />

          {[
            { heading: "Core", items: coreModules },
            { heading: "Ecosystem", items: ecosystemModules },
            { heading: "Freelance", items: freelanceModules },
            { heading: "Personal", items: personalModules },
            { heading: "System", items: systemModules },
          ].map(group => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map(mod => {
                const Icon = mod.icon;
                return (
                  <CommandItem
                    key={mod.tab}
                    onSelect={() => navigateTo(mod.tab)}
                    keywords={mod.keywords.split(" ")}
                  >
                    <Icon className={`mr-2 h-4 w-4 ${mod.color}`} />
                    <div className="flex flex-col">
                      <span>{mod.label}</span>
                      <span className="text-[10px] text-muted-foreground">{mod.desc}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
