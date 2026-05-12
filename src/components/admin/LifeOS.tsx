import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Target, Zap, Coffee, Moon, Sun } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Protocol = { id: string; title: string; completed: boolean; icon: "sun" | "moon" | "coffee" | "zap" };

export const LifeOS = () => {
  const [lastReset, setLastReset] = useLocalStorage("bo3_lifeos_last_reset", new Date().toDateString());
  
  const defaultProtocols: Protocol[] = [
    { id: "p1", title: "Morning Hydration & Meds", completed: false, icon: "sun" },
    { id: "p2", title: "Inbox Triage (Zero Inbox)", completed: false, icon: "coffee" },
    { id: "p3", title: "2x Deep Work Sessions", completed: false, icon: "zap" },
    { id: "p4", title: "Evening Wind-down Routine", completed: false, icon: "moon" },
  ];

  const [protocols, setProtocols] = useLocalStorage<Protocol[]>("bo3_lifeos_protocols", defaultProtocols);

  // Check if we need to reset daily protocols
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setProtocols(protocols.map(p => ({ ...p, completed: false })));
      setLastReset(today);
    }
  }, [lastReset, protocols, setProtocols, setLastReset]);

  const toggleProtocol = (id: string) => {
    setProtocols(protocols.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const getIcon = (iconStr: string, completed: boolean) => {
    const className = `w-5 h-5 ${completed ? 'text-primary' : 'text-muted-foreground'}`;
    switch(iconStr) {
      case "sun": return <Sun className={className} />;
      case "moon": return <Moon className={className} />;
      case "coffee": return <Coffee className={className} />;
      case "zap": return <Zap className={className} />;
      default: return <Target className={className} />;
    }
  };

  const [brainDump, setBrainDump] = useLocalStorage("bo3_lifeos_braindump", "");
  const completedCount = protocols.filter(p => p.completed).length;
  const progressPercent = protocols.length === 0 ? 0 : (completedCount / protocols.length) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      
      {/* Left Column: Protocols & Focus Ring */}
      <div className="space-y-6">
        <div className="glass-panel rounded-xl p-6 border border-border flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight">Daily Protocol</h2>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest terminal-text">System Integrity check</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-3xl font-mono font-bold text-primary">{completedCount}<span className="text-muted-foreground text-xl">/{protocols.length}</span></div>
            </div>
          </div>

          {/* SVG Focus Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle 
                cx="50" cy="50" r={radius} 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="8" 
                className="text-muted/20"
              />
              {/* Progress track */}
              <circle 
                cx="50" cy="50" r={radius} 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-primary transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>

        {/* Protocol Checklist */}
        <div className="space-y-3">
          {protocols.map(p => (
            <div 
              key={p.id}
              onClick={() => toggleProtocol(p.id)}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                p.completed 
                  ? "bg-primary/10 border-primary/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]" 
                  : "bg-background-elevated/40 border-border hover:border-primary/50"
              }`}
            >
              <div className={`p-2.5 rounded-full transition-colors ${p.completed ? "bg-primary/20" : "bg-background-elevated"}`}>
                {getIcon(p.icon, p.completed)}
              </div>
              
              <span className={`text-base font-medium transition-colors ${p.completed ? "text-foreground line-through opacity-70" : "text-foreground/90"}`}>
                {p.title}
              </span>

              <div className="ml-auto">
                {p.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center">Last reset: {lastReset}</div>
      </div>

      {/* Right Column: Brain Dump Scratchpad */}
      <div className="h-full min-h-[400px]">
        <div className="glass-panel rounded-xl border border-border h-full flex flex-col overflow-hidden relative">
          <div className="border-b border-border/40 bg-background-elevated/30 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <span className="terminal-text text-[10px] uppercase tracking-widest font-bold text-foreground">Neural Scratchpad</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
          </div>
          <div className="flex-1 p-0 relative">
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              placeholder="Dump thoughts, engineering ideas, and rapid tasks here. Automatically synced to local storage..."
              className="w-full h-full bg-transparent border-none resize-none p-5 text-sm font-mono text-muted-foreground focus:text-foreground focus:ring-0 focus:outline-none hide-scrollbar placeholder:opacity-30"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
