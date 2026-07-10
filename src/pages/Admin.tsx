import { useState } from "react";
import { SITE } from "@/config/siteConfig";
import { AuthGate } from "@/components/admin/AuthGate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
  LayoutDashboard, FileText, Settings, Database, Server,
  Search, Gauge, FolderKanban, Clock, Wrench, Code2, Monitor, BadgeCheck,
  Cpu, Wifi, Share2, Smartphone, Wallet, Receipt, ScrollText, MessageSquare, 
  Star, Link2, Activity, BrainCircuit, LayoutGrid, BookOpen, TerminalSquare,
  ShieldAlert, HardDrive, Cloud, BarChart3, LogOut, 
  Palette, Inbox, Download, Menu, X, ChevronLeft, ChevronRight, Terminal, Command
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { hasSupabase } from "@/integrations/supabase/safeFetch";
import { supabase } from "@/integrations/supabase/client";
import { VoiceMic } from "@/components/admin/VoiceMic";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { TimelineManager } from "@/components/admin/TimelineManager";
import { InvoiceGenerator } from "@/components/admin/InvoiceGenerator";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { EquipmentManager } from "@/components/admin/EquipmentManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";
import { ContactViewer } from "@/components/admin/ContactViewer";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { BlogManager } from "@/components/admin/BlogManager";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { IoTFleetManager } from "@/components/admin/IoTFleetManager";
import { FinanceManager } from "@/components/admin/FinanceManager";
import { DynamicResumePro } from "@/components/admin/DynamicResumePro";
import { LifeOS } from "@/components/admin/LifeOS";
import { CommandVault } from "@/components/admin/CommandVault";
import { EncryptedVault } from "@/components/admin/EncryptedVault";
import { NeuralFlow } from "@/components/admin/NeuralFlow";
import { NexusBoard } from "@/components/admin/NexusBoard";
import { LocalDrop } from "@/components/admin/LocalDrop";
import { DeviceMatrix } from "@/components/admin/DeviceMatrix";
import { StorageManager } from "@/components/admin/StorageManager";
import { TelemetryViewer } from "@/components/admin/TelemetryViewer";
import { ClientMessages } from "@/components/admin/ClientMessages";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";
import { DataNexusTab } from "@/components/admin/DataNexusTab";
import { CloudInfraManager } from "@/components/admin/CloudInfraManager";
import { TimeWarpProvider } from "@/hooks/useTimeWarp";
import { TimeWarpScrubber } from "@/components/admin/TimeWarpScrubber";


const NavItem = ({
  value, icon: Icon, label, isCollapsed, colorClass = "text-primary",
  onClick, isActive, onSelect, reorderMode,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onTouchStart, onTouchMove, onTouchEnd,
  isDragOver, isDragging, catParent,
}: any) => {
  const btn = (
    <button
      onClick={() => { if (!reorderMode) { onSelect?.(value); onClick?.(); } }}
      data-item={value}
      data-cat-parent={catParent}
      draggable={reorderMode}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={[
        "relative flex items-center justify-start px-3 py-2.5 h-auto text-sm font-medium w-full rounded-md transition-all group",
        reorderMode ? "touch-none" : "",
        reorderMode
          ? isDragging
            ? "opacity-40 border border-dashed border-primary/60 bg-primary/5"
            : isDragOver
            ? "border border-primary/70 bg-primary/10 ring-1 ring-primary/30 scale-[0.99]"
            : "border border-dashed border-border/60 hover:border-primary/40 cursor-grab active:cursor-grabbing"
          : isActive
          ? `bg-primary/10 ${colorClass}`
          : "text-muted-foreground hover:bg-background-elevated hover:text-foreground",
      ].join(" ")}
    >
      {/* Drop-target indicator bar */}
      {reorderMode && isDragOver && (
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-full bg-primary shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
      )}
      {reorderMode && !isCollapsed && (
        <GripVertical className="h-3 w-3 mr-2 text-muted-foreground shrink-0 cursor-grab" />
      )}
      <Icon
        className={[
          "h-4 w-4 shrink-0",
          isCollapsed ? "mx-auto" : reorderMode ? "mr-2" : "mr-3",
          isActive ? colorClass : `${colorClass}/70`,
          "transition-transform group-hover:scale-110 duration-200",
        ].join(" ")}
      />
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
        }`}
      >
        {label}
      </span>
    </button>
  );

  if (isCollapsed && !reorderMode) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent side="right" className="z-50 ml-2">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return btn;
};

import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GripVertical, Unlock, Lock as LockIcon } from "lucide-react";

type NavItemDef = {
  value: string;
  icon: any;
  label: string;
  group: string;
  colorClass?: string;
};

const DEFAULT_NAV: NavItemDef[] = [
  // Core
  { value: "overview", icon: Gauge, label: "Dashboard", group: "Core" },
  { value: "timeline", icon: Clock, label: "Timeline", group: "Core" },
  { value: "projects", icon: FolderKanban, label: "Projects", group: "Core" },
  { value: "services", icon: Wrench, label: "Services", group: "Core" },
  { value: "skills", icon: Code2, label: "Stack", group: "Core" },
  { value: "equipment", icon: Monitor, label: "Equipment", group: "Core" },
  { value: "certifications", icon: BadgeCheck, label: "Certifications", group: "Core" },
  // Ecosystem
  { value: "iot", icon: Cpu, label: "IoT Fleet", group: "Ecosystem" },
  { value: "devices", icon: Smartphone, label: "Devices", group: "Ecosystem", colorClass: "text-accent" },
  { value: "localdrop", icon: Share2, label: "LocalDrop", group: "Ecosystem", colorClass: "text-accent" },
  // Freelance
  { value: "client_messages", icon: Inbox, label: "Client Comms", group: "Freelance", colorClass: "text-success" },
  { value: "finance", icon: Wallet, label: "Finances", group: "Freelance" },
  { value: "invoices", icon: Receipt, label: "Invoices", group: "Freelance" },
  { value: "resume", icon: ScrollText, label: "Resume Pro", group: "Freelance", colorClass: "text-accent" },
  { value: "contact", icon: MessageSquare, label: "Inbox", group: "Freelance" },
  { value: "testimonials", icon: Star, label: "Feedback", group: "Freelance" },
  { value: "social_links", icon: Link2, label: "Social Links", group: "Freelance", colorClass: "text-accent" },
  // Personal
  { value: "lifeos", icon: Activity, label: "Life OS", group: "Personal" },
  { value: "neuralflow", icon: BrainCircuit, label: "Neural Flow", group: "Personal", colorClass: "text-destructive" },
  { value: "nexusboard", icon: LayoutGrid, label: "Task Board", group: "Personal", colorClass: "text-accent" },
  { value: "blog", icon: BookOpen, label: "Blog", group: "Personal" },
  { value: "vault", icon: TerminalSquare, label: "Cmd Vault", group: "Personal", colorClass: "text-success" },
  { value: "encrypted_vault", icon: ShieldAlert, label: "Secret Vault", group: "Personal", colorClass: "text-destructive" },
  // System
  { value: "datanexus", icon: Database, label: "Data Hub", group: "System", colorClass: "text-accent" },
  { value: "storage", icon: HardDrive, label: "DB & Storage", group: "System", colorClass: "text-warning" },
  { value: "cloud_infra", icon: Cloud, label: "Cloud Infra", group: "System", colorClass: "text-[#f48120]" },
  { value: "telemetry", icon: BarChart3, label: "Telemetry", group: "System", colorClass: "text-primary" },
  { value: "settings", icon: Settings, label: "Settings", group: "System" },
];

const GROUP_ABBREV: Record<string, string> = { Core: "C", Ecosystem: "E", Freelance: "F", Personal: "P", System: "S" };

export default function Admin({ isDemoRoute }: { isDemoRoute?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reorderMode, setReorderMode] = useState(false);
  const [navOrder, setNavOrder] = useLocalStorage<string[]>("bo3_nav_order", DEFAULT_NAV.map(n => n.value));
  const [categoryOrder, setCategoryOrder] = useLocalStorage<string[]>("bo3_category_order", ["Core", "Ecosystem", "Freelance", "Personal", "System"]);
  
  const [dragType, setDragType] = useState<"category" | "item" | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleMobileNav = () => {
    setIsMobileMenuOpen(false);
  };

  // Build ordered nav from stored order, falling back to defaults for missing items
  const orderedNav: NavItemDef[] = (() => {
    const navMap = new Map(DEFAULT_NAV.map(n => [n.value, n]));
    const result: NavItemDef[] = [];
    for (const val of navOrder) {
      const item = navMap.get(val);
      if (item) result.push(item);
    }
    // Append any new items not in stored order
    for (const item of DEFAULT_NAV) {
      if (!navOrder.includes(item.value)) result.push(item);
    }
    return result;
  })();

  // Group items by checking categoryOrder.
  const groups = categoryOrder.map(cat => ({
    name: cat,
    items: orderedNav.filter(n => n.group === cat)
  })).filter(g => g.items.length > 0);

  // --- Category Drag Handlers ---
  const handleCatDragStart = (cat: string) => (e: React.DragEvent) => {
    setDragType("category"); setDragId(cat); setDragOverId(cat);
    e.dataTransfer.effectAllowed = "move";
    if (e.dataTransfer.setDragImage) {
      const el = e.currentTarget as HTMLElement;
      e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
    }
  };
  const handleCatDragOver = (cat: string) => (e: React.DragEvent) => {
    if (dragType !== "category") return;
    e.preventDefault(); setDragOverId(cat);
  };
  const handleCatDrop = (targetCat: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragType !== "category" || !dragId || dragId === targetCat) {
      setDragType(null); setDragId(null); setDragOverId(null); return;
    }
    const newOrder = [...categoryOrder];
    const fromIdx = newOrder.indexOf(dragId);
    const toIdx = newOrder.indexOf(targetCat);
    if (fromIdx > -1 && toIdx > -1) {
      newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, dragId);
      setCategoryOrder(newOrder);
    }
    setDragType(null); setDragId(null); setDragOverId(null);
  };

  // --- Item Drag Handlers ---
  const handleItemDragStart = (value: string) => (e: React.DragEvent) => {
    setDragType("item"); setDragId(value); setDragOverId(value);
    e.dataTransfer.effectAllowed = "move";
    if (e.dataTransfer.setDragImage) {
      const el = e.currentTarget as HTMLElement;
      e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
    }
  };
  const handleItemDragOver = (value: string, cat: string) => (e: React.DragEvent) => {
    if (dragType !== "item") return;
    const draggedItem = orderedNav.find(n => n.value === dragId);
    if (draggedItem?.group === cat) {
      e.preventDefault(); // Valid drop target (same category)
      setDragOverId(value);
    }
  };
  const handleItemDrop = (targetValue: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragType !== "item" || !dragId || dragId === targetValue) {
      setDragType(null); setDragId(null); setDragOverId(null); return;
    }
    const newOrder = [...navOrder];
    const fromIdx = newOrder.indexOf(dragId);
    const toIdx = newOrder.indexOf(targetValue);
    if (fromIdx > -1 && toIdx > -1) {
      newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, dragId);
      setNavOrder(newOrder);
    }
    setDragType(null); setDragId(null); setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDragType(null); setDragId(null); setDragOverId(null);
  };

  const handleResetOrder = () => {
    setNavOrder(DEFAULT_NAV.map(n => n.value));
    setCategoryOrder(["Core", "Ecosystem", "Freelance", "Personal", "System"]);
  };

  // ── Mobile Touch Handlers ──
  const handleTouchStart = (type: "category" | "item", id: string) => (e: React.TouchEvent) => {
    if (!reorderMode) return;
    setDragType(type); setDragId(id); setDragOverId(id);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!reorderMode || !dragId || !dragType) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dragType === "category") {
      const catHeader = el?.closest("div[data-cat]");
      if (catHeader) setDragOverId(catHeader.getAttribute("data-cat"));
    } else {
      const itemBtn = el?.closest("button[data-item]");
      const draggedItem = orderedNav.find(n => n.value === dragId);
      if (itemBtn) {
        const targetCat = itemBtn.getAttribute("data-cat-parent");
        if (targetCat === draggedItem?.group) setDragOverId(itemBtn.getAttribute("data-item"));
      }
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!reorderMode || !dragId || !dragType) return;
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dragType === "category") {
      const catHeader = targetElement?.closest("div[data-cat]");
      if (catHeader) {
        const targetCat = catHeader.getAttribute("data-cat");
        if (targetCat && targetCat !== dragId) {
          const newOrder = [...categoryOrder];
          const fromIdx = newOrder.indexOf(dragId);
          const toIdx = newOrder.indexOf(targetCat);
          if (fromIdx > -1 && toIdx > -1) {
            newOrder.splice(fromIdx, 1);
            newOrder.splice(toIdx, 0, dragId);
            setCategoryOrder(newOrder);
          }
        }
      }
    } else {
      const itemBtn = targetElement?.closest("button[data-item]");
      const draggedItem = orderedNav.find(n => n.value === dragId);
      if (itemBtn) {
        const targetItem = itemBtn.getAttribute("data-item");
        const targetCat = itemBtn.getAttribute("data-cat-parent");
        if (targetItem && targetItem !== dragId && targetCat === draggedItem?.group) {
          const newOrder = [...navOrder];
          const fromIdx = newOrder.indexOf(dragId);
          const toIdx = newOrder.indexOf(targetItem);
          if (fromIdx > -1 && toIdx > -1) {
            newOrder.splice(fromIdx, 1);
            newOrder.splice(toIdx, 0, dragId);
            setNavOrder(newOrder);
          }
        }
      }
    }
    setDragType(null); setDragId(null); setDragOverId(null);
  };

  return (
    <TimeWarpProvider>
    <AuthGate isDemoRoute={isDemoRoute}>
      <TooltipProvider>
      <AdminCommandPalette setActiveTab={setActiveTab} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-screen w-full overflow-hidden bg-background text-foreground pb-16 lg:pb-0">
        {/* Sidebar (Desktop Only) */}
        <aside className={`hidden lg:flex inset-y-0 left-0 z-50 flex-col border-r border-border/40 bg-background-elevated/30 backdrop-blur-2xl transition-all duration-300 ease-in-out ${isCollapsed ? "w-[72px]" : "w-64"}`}>
          {/* Header / Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0 relative">
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0 transition-transform hover:scale-105">
                <Server className="h-4 w-4" />
              </div>
              <div className={`min-w-0 transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto block"}`}>
                <h1 className="font-display font-semibold tracking-tight truncate">{SITE.brandHandle} Admin</h1>
                <div className="flex items-center gap-2 terminal-text text-[9px] uppercase tracking-widest text-muted-foreground truncate">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${sessionStorage.getItem("nexus_demo_mode") === "true" ? "bg-accent" : hasSupabase ? "bg-success" : "bg-warning"} animate-pulse`} />
                  {sessionStorage.getItem("nexus_demo_mode") === "true" ? "Demo Sandbox" : hasSupabase ? "Live Sync" : "Mock Mode"}
                </div>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col h-auto w-full justify-start items-stretch p-3 space-y-1 bg-transparent rounded-none hide-scrollbar">
            
            {groups.map((group) => {
              const isCatDragging = reorderMode && dragType === "category" && dragId === group.name;
              const isCatDragOver = reorderMode && dragType === "category" && dragOverId === group.name && dragId !== group.name;
              
              return (
                <div key={group.name} className="relative">
                  <div 
                    data-cat={group.name}
                    draggable={reorderMode}
                    onDragStart={handleCatDragStart(group.name)}
                    onDragOver={handleCatDragOver(group.name)}
                    onDrop={handleCatDrop(group.name)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={handleTouchStart("category", group.name)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={[
                      "px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 mb-1 transition-all flex items-center gap-2",
                      isCollapsed ? "justify-center" : "",
                      reorderMode ? "cursor-grab active:cursor-grabbing hover:bg-background-elevated rounded-md" : "",
                      isCatDragging ? "opacity-30" : "",
                      isCatDragOver ? "border-t-2 border-primary bg-primary/10 rounded-t-md" : "",
                    ].join(" ")}
                  >
                    {reorderMode && !isCollapsed && <GripVertical className="h-3 w-3 shrink-0" />}
                    {isCollapsed ? GROUP_ABBREV[group.name] || group.name[0] : group.name}
                  </div>
                  {group.items.map((item) => {
                    return (
                      <NavItem
                        key={item.value}
                        value={item.value}
                        icon={item.icon}
                        label={item.label}
                        isCollapsed={isCollapsed}
                        colorClass={item.colorClass}
                        isActive={activeTab === item.value}
                        onSelect={setActiveTab}
                        onClick={handleMobileNav}
                        reorderMode={reorderMode}
                        catParent={group.name}
                        isDragging={reorderMode && dragType === "item" && dragId === item.value}
                        isDragOver={reorderMode && dragType === "item" && dragOverId === item.value && dragId !== item.value}
                        onDragStart={handleItemDragStart(item.value)}
                        onDragOver={handleItemDragOver(item.value, group.name)}
                        onDrop={handleItemDrop(item.value)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={handleTouchStart("item", item.value)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      />
                    );
                  })}
                </div>
              );
            })}
            
            <div className="h-6 shrink-0" /> {/* Bottom Padding */}
          </div>

          {/* Desktop Collapse Toggle + Reorder Toggle */}
          <div className="hidden lg:flex h-auto border-t border-border/40 shrink-0 flex-col gap-0">
            {/* Reorder mode action bar */}
            {reorderMode && (
              <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-primary/20 animate-in slide-in-from-bottom duration-200">
                <span className="terminal-text text-[9px] uppercase tracking-widest text-primary/80">Drag to reorder</span>
                <button
                  onClick={handleResetOrder}
                  className="text-[9px] terminal-text uppercase tracking-widest text-muted-foreground hover:text-destructive transition px-1.5 py-0.5 rounded hover:bg-destructive/10"
                >
                  Reset
                </button>
              </div>
            )}
            <div className="flex items-center justify-between px-4 h-12">
              <button
                onClick={() => { setReorderMode(!reorderMode); if (isCollapsed) setIsCollapsed(false); }}
                className={`flex items-center gap-1.5 p-1.5 rounded-md transition-colors text-xs ${
                  reorderMode ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-background-elevated hover:text-foreground"
                }`}
                title={reorderMode ? "Lock navigation order" : "Reorder navigation"}
              >
                {reorderMode ? <Unlock className="w-4 h-4" /> : <GripVertical className="w-4 h-4" />}
                {!isCollapsed && <span className="text-[9px] terminal-text uppercase tracking-widest">{reorderMode ? "Lock" : "Order"}</span>}
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-background-elevated hover:text-foreground transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Topbar */}
          <header className="h-14 lg:h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shrink-0 z-40 sticky top-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-90 shrink-0"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <h2 className="font-display text-base font-semibold tracking-tight">{SITE.brandHandle}</h2>
                <span className={`h-1.5 w-1.5 rounded-full ${hasSupabase ? "bg-success" : "bg-warning"} animate-pulse`} />
              </div>
              
              <div className="hidden lg:flex items-center gap-2 terminal-text text-xs uppercase tracking-widest text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${hasSupabase ? "bg-success" : "bg-warning"} animate-pulse`} />
                {hasSupabase ? "Database Connected" : "Mock Data Mode"}
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <a
                href="https://github.com/Omar-ABouajaja/My_portfolio/releases/latest/download/app-debug.apk"
                download
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-md transition-colors"
                title="Download Android APK"
              >
                <Download className="w-4 h-4" />
                Get APK
              </a>
              <VoiceMic setActiveTab={setActiveTab} />
              <ThemeSwitcher />
              <button 
                onClick={async () => {
                  sessionStorage.removeItem("nexus_demo_mode");
                  await supabase.auth.signOut();
                  window.location.href = "/admin";
                }}
                className="hidden lg:flex text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors items-center gap-2"
              >
                Sign Out
              </button>
              <a href="/" className="hidden lg:flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors items-center gap-2">
                Exit to OS
              </a>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative pb-28 lg:pb-8">
            <div className="mx-auto w-full max-w-7xl space-y-6">

              {!hasSupabase && (
                <div className="mb-8 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
                  <strong>Running in Mock Mode:</strong> Supabase environment variables are missing. Data modifications will not persist.
                </div>
              )}

              <TabsContent value="overview">
                <AdminOverview setActiveTab={setActiveTab} />
              </TabsContent>

            <TabsContent value="projects">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Projects Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your portfolio projects across all languages.</p>
                <ProjectsManager />
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Timeline Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your career history events.</p>
                <TimelineManager />
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Services Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your core offerings and pricing.</p>
                <ServicesManager />
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Tech Stack Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage the technologies displayed in the marquee.</p>
                <SkillsManager />
              </div>
            </TabsContent>

            <TabsContent value="testimonials">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Testimonials Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage client feedback and reviews.</p>
                <TestimonialsManager />
              </div>
            </TabsContent>

            <TabsContent value="client_messages" className="h-full">
              <ClientMessages />
            </TabsContent>

            <TabsContent value="equipment">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Equipment Arsenal</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your setup and daily drivers.</p>
                <EquipmentManager />
              </div>
            </TabsContent>

            <TabsContent value="certifications">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Certifications Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your professional certifications and credentials.</p>
                <CertificationsManager />
              </div>
            </TabsContent>

            <TabsContent value="iot">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Hardware & IoT Fleet Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">Track live deployed nodes and lab inventory.</p>
                <IoTFleetManager />
              </div>
            </TabsContent>

            <TabsContent value="devices">
              <DeviceMatrix />
            </TabsContent>

            <TabsContent value="localdrop">
              <LocalDrop />
            </TabsContent>

            <TabsContent value="finance">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Freelance Finance Hub</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage revenue goals, transactions, and hardware expenses.</p>
                <FinanceManager />
              </div>
            </TabsContent>

            <TabsContent value="vault">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Developer Command Vault</h2>
                <p className="text-sm text-muted-foreground mb-6">Store and quickly copy complex terminal snippets.</p>
                <CommandVault />
              </div>
            </TabsContent>

            <TabsContent value="encrypted_vault">
              <div className="glass-panel rounded-xl p-6 min-h-[500px]">
                <EncryptedVault />
              </div>
            </TabsContent>

            <TabsContent value="lifeos">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">ADHD Life OS</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage daily brain dumps and sync with Apple Reminders.</p>
                <LifeOS />
              </div>
            </TabsContent>

            <TabsContent value="neuralflow">
              <div className="glass-panel rounded-xl p-6 min-h-[500px]">
                <NeuralFlow />
              </div>
            </TabsContent>

            <TabsContent value="nexusboard" className="flex-1 m-0 data-[state=active]:flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in-50 zoom-in-[0.98] duration-300 h-[calc(100vh-4rem)]">
              <NexusBoard />
            </TabsContent>

            <TabsContent value="blog">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Blog & Articles</h2>
                <p className="text-sm text-muted-foreground mb-6">Publish technical logs and engineering thoughts.</p>
                <BlogManager />
              </div>
            </TabsContent>

            <TabsContent value="social_links">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Social & Contact Links</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your public contact channels displayed on the portfolio.</p>
                <SocialLinksManager />
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Inbox</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage contact form submissions.</p>
                <ContactViewer />
              </div>
            </TabsContent>

            <TabsContent value="invoices">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Invoice Generator Pro</h2>
                <p className="text-sm text-muted-foreground mb-6">Create and manage professional PDF invoices for clients.</p>
                <InvoiceGenerator />
              </div>
            </TabsContent>

            <TabsContent value="resume">
              <div className="glass-panel rounded-xl p-6">
                <DynamicResumePro />
              </div>
            </TabsContent>

            <TabsContent value="storage">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Database & Local Storage</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage offline-first DB storage, export backups, and view resource metrics.</p>
                <StorageManager />
              </div>
            </TabsContent>

            <TabsContent value="cloud_infra" className="flex-1 m-0 data-[state=active]:flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in-50 zoom-in-[0.98] duration-300">
              <CloudInfraManager />
            </TabsContent>

            <TabsContent value="datanexus" className="flex-1 m-0 data-[state=active]:flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in-50 zoom-in-[0.98] duration-300 h-[calc(100vh-4rem)]">
              <DataNexusTab />
            </TabsContent>

            <TabsContent value="telemetry" className="flex-1 m-0 data-[state=active]:flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in-50 zoom-in-[0.98] duration-300 h-[calc(100vh-4rem)]">
              <TelemetryViewer />
            </TabsContent>

              <TabsContent value="settings">
                <div className="glass-panel rounded-xl p-6">
                  <h2 className="text-lg font-semibold">System Settings</h2>
                  <p className="text-sm text-muted-foreground mb-6">Configure global parameters and metadata.</p>
                  <SettingsPanel setActiveTab={setActiveTab} />
                </div>
              </TabsContent>
            </div>
          </main>
        </div>

        {/* ═══ FLOATING GLASSMORPHIC DOCK ═══ */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="relative bg-background/60 backdrop-blur-3xl border border-border/30 rounded-[28px] dock-glow flex items-center justify-around px-2 py-1" style={{ animation: 'dock-bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            {/* Subtle top edge highlight */}
            <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />

            {[
              { key: "overview", icon: Command, label: "Dash", color: "primary" },
              { key: "lifeos", icon: Activity, label: "Focus", color: "primary" },
              { key: "__cmd__", icon: Terminal, label: "Cmd", color: "primary", isCenter: true },
              { key: "iot", icon: Cpu, label: "IoT", color: "success" },
              { key: "settings", icon: Settings, label: "Sys", color: "foreground" },
            ].map((item) => {
              const isActive = !item.isCenter && activeTab === item.key;
              const Icon = item.icon;
              const colorVar = item.color === "primary" ? "hsl(var(--primary))" 
                : item.color === "success" ? "hsl(var(--success))" 
                : "hsl(var(--foreground))";

              if (item.isCenter) {
                return (
                  <button
                    key={item.key}
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                    className="relative -top-5 flex flex-col items-center"
                  >
                    <div className="w-[52px] h-[52px] rounded-full bg-gradient-cyber p-[1.5px] shadow-glow-primary transition-transform active:scale-90">
                      <div className="w-full h-full rounded-full bg-background/90 backdrop-blur-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary dock-icon-active" />
                      </div>
                    </div>
                    <span className="text-[8px] font-bold tracking-wider text-muted-foreground mt-0.5">{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 active:scale-90 ${
                    isActive ? "" : "text-muted-foreground/60"
                  }`}
                >
                  {/* Active glow dot */}
                  {isActive && (
                    <div 
                      className="absolute -top-0.5 w-5 h-[3px] rounded-full"
                      style={{ backgroundColor: colorVar, boxShadow: `0 0 12px ${colorVar}` }}
                    />
                  )}
                  <Icon 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? "dock-icon-active" : ""
                    }`}
                    style={isActive ? { color: colorVar } : {}}
                  />
                  <span 
                    className={`text-[9px] font-bold tracking-wide mt-0.5 transition-colors ${
                      isActive ? "" : "text-muted-foreground/50"
                    }`}
                    style={isActive ? { color: colorVar } : {}}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
        <TimeWarpScrubber />
      </Tabs>

      {/* ═══ MOBILE SLIDE-OUT MENU ═══ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-background/95 backdrop-blur-3xl border-r border-border/30 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 ease-out">
            {/* Header */}
            <div className="pt-[calc(env(safe-area-inset-top,0px)+16px)] px-5 pb-4 border-b border-border/20 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-cyber text-background shadow-glow-primary">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold tracking-tight text-base">{SITE.brandHandle}</h1>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${hasSupabase ? "bg-success" : "bg-warning"} animate-pulse`} />
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        {hasSupabase ? "Live" : "Mock"}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-background-elevated transition-all active:scale-90" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {(() => {
                let flatIndex = 0;
                return groups.map((group) => (
                  <div key={`mobile-${group.name}`}>
                    <div className="px-3 py-2.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mt-3 first:mt-0">
                      {group.name}
                    </div>
                    {group.items.map((item) => {
                      flatIndex++;
                      return (
                      <NavItem
                        key={`mobile-${item.value}`}
                        value={item.value}
                        icon={item.icon}
                        label={item.label}
                        isCollapsed={false}
                        colorClass={item.colorClass}
                        isActive={activeTab === item.value}
                        onSelect={setActiveTab}
                        onClick={handleMobileNav}
                        reorderMode={false}
                        flatIdx={flatIndex}
                      />
                      );
                    })}
                  </div>
                ));
              })()}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border/20 space-y-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
              <a
                href="https://github.com/Omar-ABouajaja/My_portfolio/releases/latest/download/app-debug.apk"
                download
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary transition-all active:scale-95 hover:bg-primary/20"
              >
                <Download className="w-4 h-4" />
                Download APK
              </a>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    sessionStorage.removeItem("nexus_demo_mode");
                    await supabase.auth.signOut();
                    window.location.href = "/admin";
                  }}
                  className="flex-1 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive transition-all active:scale-95"
                >
                  Sign Out
                </button>
                <a
                  href="/"
                  className="flex-1 rounded-xl border border-border/30 bg-background-elevated/50 px-3 py-2 text-xs font-medium text-muted-foreground text-center transition-all active:scale-95"
                >
                  Exit to OS
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
      </TooltipProvider>
    </AuthGate>
    </TimeWarpProvider>
  );
}
