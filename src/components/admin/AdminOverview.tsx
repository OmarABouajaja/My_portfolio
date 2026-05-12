import { useState, useEffect } from "react";
import { Activity, Plus, FileText, CheckCircle2, Circle, Clock, MessageSquare, Play, Pause, RotateCcw, PenTool, Cpu, DollarSign, Headphones, Share2, Smartphone, Trash2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useDesktopNotifications } from "@/hooks/useDesktopNotifications";

type FocusTask = { id: number; title: string; status: string };

export const AdminOverview = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({ 
    queryKey: ["projects"], 
    queryFn: () => safeFetchAll("projects") 
  });
  
  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({ 
    queryKey: ["contact_submissions"], 
    queryFn: () => safeFetchAll("contact_submissions") 
  });
  
  const { data: visitors = [], isLoading: isLoadingVisitors } = useQuery({ 
    queryKey: ["visitors"], 
    queryFn: () => safeFetchAll("visitor_logs") 
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({ 
    queryKey: ["chat_messages"], 
    queryFn: () => safeFetchAll("chat_messages") 
  });

  const [telemetryNodes] = useLocalStorage<any[]>("bo3_iot_nodes", []);
  const activeNodesCount = telemetryNodes.filter(n => n.status === "online").length;

  const [financeTransactions] = useLocalStorage<any[]>("bo3_finance_tx", []);
  const [financeGoal] = useLocalStorage("bo3_finance_goal", 5000);
  
  const calculatedIncome = financeTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const safeFinanceGoal = Math.max(financeGoal, 1);
  const revenueProgress = Math.min((calculatedIncome / safeFinanceGoal) * 100, 100);

  const [pairedDevices] = useLocalStorage<any[]>("bo3_device_matrix", []);
  const [localDropHistory] = useLocalStorage<any[]>("bo3_localdrop_history", []);
  const activeDevicesCount = pairedDevices.filter(d => d.status !== "offline").length;

  const [focusTasks, setFocusTasks] = useLocalStorage<FocusTask[]>("bo3_focus_tasks", []);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const appendTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setFocusTasks([...focusTasks, { id: Date.now(), title: newTaskTitle, status: "todo" }]);
    setNewTaskTitle("");
  };

  const toggleTaskStatus = (targetId: number) => {
    setFocusTasks(focusTasks.map(task => {
      if (task.id === targetId) {
        const nextStatus = task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo";
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const deleteTask = (targetId: number) => {
    setFocusTasks(focusTasks.filter(t => t.id !== targetId));
  };

  const { 
    mins, 
    secs, 
    isActive, 
    brownNoiseEnabled, 
    setBrownNoiseEnabled, 
    toggleTimer, 
    resetTimer 
  } = useFocusTimer(25);

  const [scratchpadData, setScratchpadData] = useLocalStorage("bo3_brain_dump", "");
  
  const unreadContacts = contacts.filter((c: any) => c.status === "new").length;
  const unreadMessages = messages.filter((m: any) => !m.read && m.sender === "client").length;
  
  // Trigger OS-level desktop notifications when unread counts increase
  useDesktopNotifications(unreadContacts, unreadMessages);
  
  const isAggregatingData = isLoadingProjects || isLoadingContacts || isLoadingVisitors || isLoadingMessages;

  // Recent activity feed — merge contacts + visitors, sort by time
  const recentActivity = (() => {
    const items: { type: string; label: string; time: string; raw: number }[] = [];
    contacts.slice(-5).forEach((c: any) => {
      items.push({ type: "contact", label: `${c.name || "Someone"} sent a message`, time: c.created_at || "", raw: new Date(c.created_at || 0).getTime() });
    });
    visitors.slice(-5).forEach((v: any) => {
      items.push({ type: "visitor", label: `Visitor from ${v.location || v.os || "unknown"}`, time: v.created_at || "", raw: new Date(v.created_at || 0).getTime() });
    });
    return items.sort((a, b) => b.raw - a.raw).slice(0, 5);
  })();

  const timeAgo = (iso: string) => {
    if (!iso) return "just now";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ─── Top Stat Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="group glass-panel p-5 rounded-xl border border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-glow-primary transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Projects</h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <p className={`text-3xl font-display font-bold ${isAggregatingData ? "text-transparent animate-pulse bg-muted rounded-md h-8 w-12" : "text-foreground"}`}>
            {!isAggregatingData && projects.length}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-accent/20 hover:border-accent/50 transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visitors</h3>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <p className={`text-3xl font-display font-bold ${isAggregatingData ? "text-transparent animate-pulse bg-muted rounded-md h-8 w-12" : "text-foreground"}`}>
            {!isAggregatingData && visitors.length}
          </p>
        </div>
        <div className={`group glass-panel p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${unreadContacts > 0 ? "border-secondary shadow-glow-secondary bg-secondary/5" : "border-secondary/20 hover:border-secondary/50 hover:bg-secondary/5 hover:shadow-glow-secondary"}`}>
          <div className="flex justify-between items-center mb-4 relative">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inbox</h3>
            {unreadContacts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
            )}
            <MessageSquare className={`h-4 w-4 ${unreadContacts > 0 ? "text-secondary animate-pulse" : "text-secondary"}`} />
          </div>
          <p className={`text-3xl font-display font-bold ${isAggregatingData ? "text-transparent animate-pulse bg-muted rounded-md h-8 w-12" : "text-foreground"}`}>
            {!isAggregatingData && contacts.length}
            {unreadContacts > 0 && <span className="ml-2 text-sm text-secondary font-normal">({unreadContacts} new)</span>}
          </p>
        </div>
        <div className="group glass-panel p-5 rounded-xl border border-warning/20 hover:border-warning/50 hover:bg-warning/5 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 h-1 bg-warning/50 group-hover:bg-warning transition-all duration-500 ease-out" style={{ width: `${revenueProgress}%` }} />
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue</h3>
            <DollarSign className="h-4 w-4 text-warning" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">${calculatedIncome.toLocaleString()}</p>
        </div>
        <div className="group glass-panel p-5 rounded-xl border border-success/20 hover:border-success/50 hover:bg-success/5 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">IoT Fleet</h3>
            <Cpu className="h-4 w-4 text-success" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{activeNodesCount}<span className="text-lg text-muted-foreground font-normal">/{telemetryNodes.length || 3}</span></p>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-accent/20 hover:border-accent/50 transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Devices</h3>
            <Smartphone className="h-4 w-4 text-accent" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{activeDevicesCount}<span className="text-lg text-muted-foreground font-normal">/{pairedDevices.length}</span></p>
        </div>
        <div className="group glass-panel p-5 rounded-xl border border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-glow-primary transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transfers</h3>
            <Share2 className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{localDropHistory.length}</p>
        </div>
      </div>

      {/* ─── Second Row: Actions & Focus ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span> Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              aria-label="Quick Action: New Project" 
              onClick={() => setActiveTab?.("projects")}
              className="group flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] transition-all duration-300 text-left"
            >
              <div className="p-2.5 bg-primary/20 rounded-lg text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-sm">New Project</div>
                <div className="text-xs text-muted-foreground">Add to portfolio</div>
              </div>
            </button>
            <button 
              aria-label="Quick Action: Create Invoice" 
              onClick={() => setActiveTab?.("invoices")}
              className="group flex items-center gap-4 p-4 rounded-xl bg-warning/5 border border-warning/20 hover:bg-warning/10 hover:border-warning/50 hover:shadow-[0_4px_20px_rgba(234,179,8,0.15)] transition-all duration-300 text-left"
            >
              <div className="p-2.5 bg-warning/20 rounded-lg text-warning group-hover:scale-110 group-hover:bg-warning group-hover:text-warning-foreground transition-all duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-sm">Create Invoice</div>
                <div className="text-xs text-muted-foreground">Generate PDF</div>
              </div>
            </button>
            <button 
              aria-label="Quick Action: Check Inbox" 
              onClick={() => setActiveTab?.("contact")}
              className="group flex items-center gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 hover:border-secondary/50 hover:shadow-[0_4px_20px_rgba(168,85,247,0.15)] transition-all duration-300 text-left"
            >
              <div className="p-2.5 bg-secondary/20 rounded-lg text-secondary group-hover:scale-110 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-sm">Check Inbox</div>
                <div className="text-xs text-muted-foreground">Client messages</div>
              </div>
            </button>
            <button 
              aria-label="Quick Action: LocalDrop" 
              onClick={() => setActiveTab?.("localdrop")}
              className="group flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/50 hover:shadow-[0_4px_20px_rgba(20,184,166,0.15)] transition-all duration-300 text-left"
            >
              <div className="p-2.5 bg-accent/20 rounded-lg text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-sm">LocalDrop</div>
                <div className="text-xs text-muted-foreground">P2P file transfer</div>
              </div>
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col border border-primary/20 shadow-glow-primary">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span> Focus Tasks
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Click to toggle status · right-click or trash to delete</p>
            </div>
            <span className="text-[10px] bg-primary text-primary-foreground px-2.5 py-1 rounded-md uppercase tracking-widest font-bold shadow-sm">
              ADHD Mode
            </span>
          </div>
          <div className="space-y-3 flex-1">
            {focusTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  aria-label={`Toggle status for task: ${task.title}`}
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`group flex-1 flex items-center text-left gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    task.status === "done" ? "border-success/20 bg-success/5 opacity-50 hover:opacity-100" :
                    task.status === "in-progress" ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]" :
                    "border-border bg-background-elevated/30 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  {task.status === "done" ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> :
                   task.status === "in-progress" ? <Clock className="w-5 h-5 text-primary animate-pulse shrink-0" /> :
                   <Circle className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary/50 transition-colors" />}
                  <span className={`text-sm font-medium transition-all ${
                    task.status === 'done' ? 'line-through text-muted-foreground' : 
                    task.status === 'in-progress' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {task.title}
                  </span>
                  
                  <div className="ml-auto hidden sm:block">
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      task.status === 'done' ? 'bg-success/20 text-success' :
                      task.status === 'in-progress' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition shrink-0 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                  aria-label={`Delete task: ${task.title}`}
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <form onSubmit={appendTask} className="mt-3 flex gap-2">
              <input 
                type="text" 
                aria-label="New Focus Task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task... (Press Enter)"
                className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all placeholder:text-muted-foreground/50"
              />
              <button 
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-xl p-6 border border-secondary/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {isActive && brownNoiseEnabled && (
              <div className="absolute inset-0 bg-secondary/5 animate-pulse-slow pointer-events-none" />
            )}
            <div className="flex justify-between items-center w-full mb-2">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-widest">Focus Mode Timer</h3>
              <button 
                onClick={() => setBrownNoiseEnabled(!brownNoiseEnabled)}
                className={`p-1.5 rounded-md transition ${brownNoiseEnabled ? 'bg-secondary/20 text-secondary' : 'bg-background-elevated text-muted-foreground hover:text-foreground'}`}
                title="Toggle ADHD Brown Noise"
              >
                <Headphones className="w-4 h-4" />
              </button>
            </div>
            <div className="text-5xl font-mono font-bold text-foreground my-4 tracking-tight drop-shadow-md z-10">
              {mins}:{secs}
            </div>
            <div className="flex gap-3 z-10">
              <button 
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition ${
                  isActive ? "bg-warning/20 text-warning hover:bg-warning/30" : "bg-primary/20 text-primary hover:bg-primary/30"
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isActive ? "Pause" : "Start Focus"}
              </button>
              <button 
                onClick={resetTimer}
                className="p-2.5 rounded-full bg-background-elevated hover:bg-muted transition text-muted-foreground"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 border border-border flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PenTool className="w-4 h-4 text-primary" /> Brain Dump
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Auto-saved</span>
            </div>
            <textarea 
              aria-label="Brain Dump Scratchpad"
              value={scratchpadData}
              onChange={(e) => setScratchpadData(e.target.value)}
              placeholder="Dump ideas, snippets, or phone numbers here..."
              className="w-full flex-1 min-h-[150px] bg-background-elevated/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 transition resize-none terminal-text text-foreground/90"
            />
          </div>

        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel rounded-xl p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" /> Recent Activity
            </h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest terminal-text">Live Feed</span>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background-elevated/30 border border-border/30 hover:border-border/60 transition">
                <div className={`p-1.5 rounded-md ${item.type === "contact" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"}`}>
                  {item.type === "contact" ? <MessageSquare className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 truncate">{item.label}</p>
                </div>
                <span className="text-[10px] text-muted-foreground terminal-text uppercase tracking-widest shrink-0">
                  {timeAgo(item.time)}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Activity className="w-6 h-6 mx-auto mb-2 opacity-40" />
                No activity recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
