import { useState } from "react";
import { SITE } from "@/config/siteConfig";
import { AuthGate } from "@/components/admin/AuthGate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { LayoutDashboard, FileText, Settings, Database, Server } from "lucide-react";
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
import { TimeWarpProvider } from "@/hooks/useTimeWarp";
import { TimeWarpScrubber } from "@/components/admin/TimeWarpScrubber";
import { Layers, MessageSquare, Star, BookOpen, Command, Cpu, DollarSign, Activity, Terminal, Share2, Smartphone, HardDrive, Menu, X, ChevronLeft, ChevronRight, ActivitySquare, Lock, Hexagon } from "lucide-react";

const NavItem = ({
  value, icon: Icon, label, isCollapsed, colorClass = "text-primary",
  onClick, isActive, onSelect, reorderMode,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onTouchStart, onTouchMove, onTouchEnd,
  flatIdx, isDragOver, isDragging,
}: any) => {
  const btn = (
    <button
      onClick={() => { if (!reorderMode) { onSelect?.(value); onClick?.(); } }}
      data-nav-idx={flatIdx}
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
  { value: "overview", icon: Command, label: "Dashboard", group: "Core" },
  { value: "timeline", icon: LayoutDashboard, label: "Timeline", group: "Core" },
  { value: "projects", icon: Database, label: "Projects", group: "Core" },
  { value: "services", icon: Layers, label: "Services", group: "Core" },
  { value: "skills", icon: Layers, label: "Stack", group: "Core" },
  { value: "equipment", icon: HardDrive, label: "Equipment", group: "Core" },
  // Ecosystem
  { value: "iot", icon: Cpu, label: "IoT Fleet", group: "Ecosystem" },
  { value: "devices", icon: Smartphone, label: "Devices", group: "Ecosystem", colorClass: "text-accent" },
  { value: "localdrop", icon: Share2, label: "LocalDrop", group: "Ecosystem", colorClass: "text-accent" },
  // Freelance
  { value: "client_messages", icon: Lock, label: "Client Comms", group: "Freelance", colorClass: "text-success" },
  { value: "finance", icon: DollarSign, label: "Finances", group: "Freelance" },
  { value: "invoices", icon: FileText, label: "Invoices", group: "Freelance" },
  { value: "resume", icon: FileText, label: "Resume Pro", group: "Freelance", colorClass: "text-accent" },
  { value: "contact", icon: MessageSquare, label: "Inbox", group: "Freelance" },
  { value: "testimonials", icon: Star, label: "Feedback", group: "Freelance" },
  { value: "social_links", icon: Hexagon, label: "Social Links", group: "Freelance", colorClass: "text-accent" },
  // Personal
  { value: "lifeos", icon: Activity, label: "Life OS", group: "Personal" },
  { value: "neuralflow", icon: Activity, label: "Neural Flow", group: "Personal", colorClass: "text-destructive" },
  { value: "nexusboard", icon: Command, label: "Task Board", group: "Personal", colorClass: "text-accent" },
  { value: "blog", icon: BookOpen, label: "Blog", group: "Personal" },
  { value: "vault", icon: Terminal, label: "Cmd Vault", group: "Personal", colorClass: "text-success" },
  { value: "encrypted_vault", icon: Lock, label: "Secret Vault", group: "Personal", colorClass: "text-destructive" },
  // System
  { value: "datanexus", icon: Hexagon, label: "Data Hub", group: "System", colorClass: "text-accent" },
  { value: "storage", icon: HardDrive, label: "DB & Storage", group: "System", colorClass: "text-warning" },
  { value: "telemetry", icon: ActivitySquare, label: "Telemetry", group: "System", colorClass: "text-primary" },
  { value: "settings", icon: Settings, label: "Settings", group: "System" },
];

const GROUP_ABBREV: Record<string, string> = { Core: "C", Ecosystem: "E", Freelance: "F", Personal: "P", System: "S" };

export default function Admin({ isDemoRoute }: { isDemoRoute?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reorderMode, setReorderMode] = useState(false);
  const [navOrder, setNavOrder] = useLocalStorage<string[]>("bo3_nav_order", DEFAULT_NAV.map(n => n.value));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

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

  // Group items while preserving custom order within groups
  const groups = (() => {
    const groupOrder: string[] = [];
    const groupMap: Record<string, NavItemDef[]> = {};
    for (const item of orderedNav) {
      if (!groupMap[item.group]) {
        groupMap[item.group] = [];
        groupOrder.push(item.group);
      }
      groupMap[item.group].push(item);
    }
    return groupOrder.map(g => ({ name: g, items: groupMap[g] }));
  })();

  const handleDragStart = (flatIdx: number) => (e: React.DragEvent) => {
    setDragIdx(flatIdx);
    setDragOverIdx(flatIdx);
    e.dataTransfer.effectAllowed = "move";
    // Semi-transparent ghost image
    if (e.dataTransfer.setDragImage) {
      const el = e.currentTarget as HTMLElement;
      e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
    }
  };

  const handleDragOver = (targetFlatIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(targetFlatIdx);
  };

  const handleDrop = (targetFlatIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetFlatIdx) {
      setDragIdx(null); setDragOverIdx(null); return;
    }
    const newOrder = [...orderedNav.map(n => n.value)];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(targetFlatIdx, 0, moved);
    setNavOrder(newOrder);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleResetOrder = () => {
    setNavOrder(DEFAULT_NAV.map(n => n.value));
  };

  // ── Mobile Touch Handlers ──
  const handleTouchStart = (flatIdx: number) => (e: React.TouchEvent) => {
    if (!reorderMode) return;
    setDragIdx(flatIdx);
    setDragOverIdx(flatIdx);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!reorderMode || dragIdx === null) return;
    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const btn = el?.closest("button[data-nav-idx]");
    if (btn) {
      const idx = parseInt(btn.getAttribute("data-nav-idx") || "-1", 10);
      if (idx !== -1) setDragOverIdx(idx);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!reorderMode || dragIdx === null) return;
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropBtn = targetElement?.closest("button[data-nav-idx]");
    if (dropBtn) {
      const targetIdx = parseInt(dropBtn.getAttribute("data-nav-idx") || "-1", 10);
      if (targetIdx !== -1 && targetIdx !== dragIdx) {
        const newOrder = [...orderedNav.map(n => n.value)];
        const [moved] = newOrder.splice(dragIdx, 1);
        newOrder.splice(targetIdx, 0, moved);
        setNavOrder(newOrder);
      }
    }
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // Flatten for index tracking
  let flatIndex = -1;

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
              return (
                <div key={group.name}>
                  <div className={`px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 mb-1 transition-all ${isCollapsed ? "text-center" : ""}`}>
                    {isCollapsed ? GROUP_ABBREV[group.name] || group.name[0] : group.name}
                  </div>
                  {group.items.map((item) => {
                    flatIndex++;
                    const fi = flatIndex;
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
                        flatIdx={fi}
                        isDragging={reorderMode && dragIdx === fi}
                        isDragOver={reorderMode && dragOverIdx === fi && dragIdx !== fi}
                        onDragStart={handleDragStart(fi)}
                        onDragOver={handleDragOver(fi)}
                        onDrop={handleDrop(fi)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={handleTouchStart(fi)}
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
          <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shrink-0 z-40 sticky top-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
              >
                <Menu className="h-4 w-4" />
              </button>
              <h2 className="font-display text-lg font-semibold tracking-tight lg:hidden">{SITE.adminTitle}</h2>
              
              <div className="hidden lg:flex items-center gap-2 terminal-text text-xs uppercase tracking-widest text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${hasSupabase ? "bg-success" : "bg-warning"} animate-pulse`} />
                {hasSupabase ? "Database Connected" : "Mock Data Mode"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <VoiceMic setActiveTab={setActiveTab} />
              <ThemeSwitcher />
              <button 
                onClick={async () => {
                  sessionStorage.removeItem("nexus_demo_mode");
                  await supabase.auth.signOut();
                  window.location.href = "/admin";
                }}
                className="text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
              >
                Sign Out
              </button>
              <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                Exit to OS
              </a>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
            <div className="mx-auto w-full max-w-7xl space-y-6">
              {/* Mobile Navigation Warning */}
              <div className="lg:hidden mb-6 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
                <strong>Mobile Notice:</strong> You have to be on a PC to get the full quality experience. Using a desktop also reduces the chance of mobile browser crashes when handling heavy admin tasks.
              </div>

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

            <TabsContent value="localdrop">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">LocalDrop</h2>
                <p className="text-sm text-muted-foreground mb-6">Peer-to-peer file transfer over local Wi-Fi via WebRTC.</p>
                <LocalDrop />
              </div>
            </TabsContent>

            <TabsContent value="devices">
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-semibold">Device Matrix</h2>
                <p className="text-sm text-muted-foreground mb-6">Screen mirroring, device monitoring, and ecosystem bridge control.</p>
                <DeviceMatrix />
              </div>
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

        {/* Mobile Bottom App Bar (Crash-proofed without Radix TabsList) */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[68px] bg-background/80 backdrop-blur-2xl border-t border-border/40 z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <button onClick={() => setActiveTab("overview")} className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 ${activeTab === "overview" ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"}`}>
            {activeTab === "overview" && <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-glow-primary" />}
            <Command className={`w-5 h-5 ${activeTab === "overview" ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
            <span className="text-[9px] font-bold tracking-wide">Dash</span>
          </button>
          
          <button onClick={() => setActiveTab("lifeos")} className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 ${activeTab === "lifeos" ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"}`}>
            {activeTab === "lifeos" && <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-glow-primary" />}
            <Activity className={`w-5 h-5 ${activeTab === "lifeos" ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
            <span className="text-[9px] font-bold tracking-wide">Focus</span>
          </button>
          
          {/* Action Button */}
          <div className="relative -top-6 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-cyber p-[2px] shadow-glow-primary animate-in zoom-in duration-500 hover:scale-105 transition-transform">
              <button 
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                className="w-full h-full rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary/10 transition-colors shadow-inner"
              >
                <Terminal className="w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </button>
            </div>
          </div>

          <button onClick={() => setActiveTab("iot")} className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 ${activeTab === "iot" ? "text-success scale-110" : "text-muted-foreground hover:text-foreground"}`}>
            {activeTab === "iot" && <div className="absolute top-0 w-8 h-1 bg-success rounded-b-full shadow-[0_0_10px_rgba(34,197,94,0.6)]" />}
            <Cpu className={`w-5 h-5 ${activeTab === "iot" ? "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" : ""}`} />
            <span className="text-[9px] font-bold tracking-wide">IoT</span>
          </button>
          
          <button onClick={() => setActiveTab("settings")} className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-300 ${activeTab === "settings" ? "text-foreground scale-110" : "text-muted-foreground hover:text-foreground"}`}>
            {activeTab === "settings" && <div className="absolute top-0 w-8 h-1 bg-foreground rounded-b-full shadow-md" />}
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wide">Sys</span>
          </button>
        </nav>
        <TimeWarpScrubber />
      </Tabs>

      {/* Mobile Slide-Out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-background/90 backdrop-blur-2xl border-r border-border/50 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 ease-out">
            <div className="h-20 flex items-center justify-between px-6 border-b border-border/40 shrink-0 bg-background/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-glow-primary">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-display font-semibold tracking-tight text-lg">{SITE.brandHandle}</h1>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Admin Menu</span>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-background-elevated transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
              {groups.map((group) => (
                <div key={`mobile-${group.name}`}>
                  <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 mb-1">
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
              ))}
              <div className="h-16" />
            </div>
          </aside>
        </div>
      )}
      </TooltipProvider>
    </AuthGate>
    </TimeWarpProvider>
  );
}
