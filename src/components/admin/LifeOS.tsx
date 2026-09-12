import { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle2, Circle, Target, Zap, Coffee, Moon, Sun, Tag,
  Timer, Music, FileText, Flame, Smile, Plus, Trash2, Edit3, Check, X
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import { FocusMusic } from "./FocusMusic";

type Protocol = {
  id: string;
  title: string;
  completed: boolean;
  icon: "sun" | "moon" | "coffee" | "zap";
  tags?: string[];
};

const MOODS = ["😴", "😐", "🙂", "😊", "🔥"];
const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;

const defaultProtocols: Protocol[] = [
  { id: "p1", title: "Morning Hydration & Meds", completed: false, icon: "sun", tags: ["health", "morning"] },
  { id: "p2", title: "Inbox Triage (Zero Inbox)", completed: false, icon: "coffee", tags: ["work", "morning"] },
  { id: "p3", title: "2x Deep Work Sessions", completed: false, icon: "zap", tags: ["work", "focus"] },
  { id: "p4", title: "Evening Wind-down Routine", completed: false, icon: "moon", tags: ["health", "evening"] },
];

export const LifeOS = () => {
  const [tab, setTab] = useState<"protocol" | "focus" | "music" | "scratch">("protocol");

  // ── Protocols ────────────────────────────────────────────────────────────
  const [lastReset, setLastReset] = useLocalStorage("bo3_lifeos_last_reset", new Date().toDateString());
  const [protocols, setProtocols] = useLocalStorage<Protocol[]>("bo3_lifeos_protocols", defaultProtocols);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const allTags = Array.from(new Set(protocols.flatMap((p) => p.tags || [])));
  const filteredProtocols = activeTag === "all" ? protocols : protocols.filter((p) => p.tags?.includes(activeTag));

  // Daily reset
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setProtocols(protocols.map((p) => ({ ...p, completed: false })));
      setLastReset(today);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleProtocol = (id: string) =>
    setProtocols(protocols.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)));

  const deleteProtocol = (id: string) => setProtocols(protocols.filter((p) => p.id !== id));

  const saveEdit = (id: string) => {
    setProtocols(protocols.map((p) => (p.id === id ? { ...p, title: editTitle } : p)));
    setEditingId(null);
  };

  const addProtocol = () => {
    if (!addTitle.trim()) return;
    const newP: Protocol = { id: `p_${Date.now()}`, title: addTitle.trim(), completed: false, icon: "zap", tags: [] };
    setProtocols([...protocols, newP]);
    setAddTitle("");
    setShowAddForm(false);
  };

  const completedCount = protocols.filter((p) => p.completed).length;
  const progressPercent = protocols.length === 0 ? 0 : (completedCount / protocols.length) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // ── Streak ───────────────────────────────────────────────────────────────
  const [streak, setStreak] = useLocalStorage("bo3_lifeos_streak", 0);
  const [streakLastDate, setStreakLastDate] = useLocalStorage("bo3_lifeos_streak_date", "");
  useEffect(() => {
    if (completedCount > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (streakLastDate === today) return;
      if (streakLastDate === yesterday) { setStreak(streak + 1); setStreakLastDate(today); }
      else { setStreak(1); setStreakLastDate(today); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount]);

  // ── Mood ─────────────────────────────────────────────────────────────────
  const [todayMood, setTodayMood] = useLocalStorage<number | null>("bo3_lifeos_mood_today", null);
  const [moodDate, setMoodDate] = useLocalStorage("bo3_lifeos_mood_date", "");
  const selectMood = (idx: number) => {
    setTodayMood(idx);
    setMoodDate(new Date().toDateString());
  };
  const moodValid = moodDate === new Date().toDateString();

  // ── Pomodoro ─────────────────────────────────────────────────────────────
  const [pomMode, setPomMode] = useState<"work" | "break">("work");
  const [pomSeconds, setPomSeconds] = useLocalStorage("bo3_pom_seconds", POMODORO_WORK);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomCount, setPomCount] = useLocalStorage("bo3_pom_count", 0);
  const [pomIntention, setPomIntention] = useLocalStorage("bo3_pom_intention", "");
  const [workDur, setWorkDur] = useLocalStorage("bo3_pom_work_dur", 25);
  const [breakDur, setBreakDur] = useLocalStorage("bo3_pom_break_dur", 5);
  const pomRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pomToggle = () => {
    if (pomRunning) { clearInterval(pomRef.current!); setPomRunning(false); }
    else setPomRunning(true);
  };

  const pomReset = () => {
    clearInterval(pomRef.current!);
    setPomRunning(false);
    setPomSeconds(pomMode === "work" ? workDur * 60 : breakDur * 60);
  };

  const switchPomMode = (mode: "work" | "break") => {
    clearInterval(pomRef.current!);
    setPomRunning(false);
    setPomMode(mode);
    setPomSeconds(mode === "work" ? workDur * 60 : breakDur * 60);
  };

  useEffect(() => {
    if (pomRunning) {
      pomRef.current = setInterval(() => {
        setPomSeconds((s: number) => {
          if (s <= 1) {
            clearInterval(pomRef.current!);
            setPomRunning(false);
            if (pomMode === "work") { setPomCount((c: number) => c + 1); }
            // Ring bell via Web Audio
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = 660;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
              osc.start(); osc.stop(ctx.currentTime + 1.2);
            } catch { /* silent */ }
            if (typeof navigator.vibrate === "function") navigator.vibrate([80, 40, 80]);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(pomRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomRunning, pomMode]);

  const pomMins = String(Math.floor(pomSeconds / 60)).padStart(2, "0");
  const pomSecs = String(pomSeconds % 60).padStart(2, "0");
  const pomTotal = pomMode === "work" ? workDur * 60 : breakDur * 60;
  const pomProgress = 1 - pomSeconds / pomTotal;
  const pomCircumference = 2 * Math.PI * 80;

  // ── Brain Dump ────────────────────────────────────────────────────────────
  const [brainDump, setBrainDump] = useLocalStorage("bo3_lifeos_braindump", "");

  const getIcon = (iconStr: string, completed: boolean) => {
    const cls = `w-5 h-5 ${completed ? "text-primary" : "text-muted-foreground"}`;
    switch (iconStr) {
      case "sun": return <Sun className={cls} />;
      case "moon": return <Moon className={cls} />;
      case "coffee": return <Coffee className={cls} />;
      case "zap": return <Zap className={cls} />;
      default: return <Target className={cls} />;
    }
  };

  const tabItems = [
    { id: "protocol", label: "Protocol", icon: Target },
    { id: "focus", label: "Focus", icon: Timer },
    { id: "music", label: "Music", icon: Music },
    { id: "scratch", label: "Notes", icon: FileText },
  ] as const;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">

      {/* ── Sub-tab Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-background-elevated/50 rounded-2xl p-1 border border-border/30">
        {tabItems.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : ""}`} />
              <span className="hidden sm:inline">{t.label}</span>
              {isActive && (
                <motion.span layoutId="lifeos-tab-indicator" className="absolute inset-0 rounded-xl border border-primary/20 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ══ TAB: PROTOCOL ═══════════════════════════════════════════════ */}
        {tab === "protocol" && (
          <motion.div key="protocol" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Progress ring + mood + streak */}
            <div className="space-y-4">
              <div className="glass-panel rounded-xl p-5 border border-border flex items-center justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight">Daily Protocol</h2>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest terminal-text">System Integrity</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="text-3xl font-mono font-bold text-primary">{completedCount}<span className="text-muted-foreground text-xl">/{protocols.length}</span></div>
                    <div className="flex items-center gap-1.5 text-warning">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-bold">{streak} day streak</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                      className="text-primary transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
                  </div>
                </div>
              </div>

              {/* Mood Tracker */}
              <div className="glass-panel rounded-xl p-4 border border-border">
                <p className="text-[10px] uppercase tracking-widest terminal-text text-muted-foreground mb-3">Today's Mood</p>
                <div className="flex items-center justify-between">
                  {MOODS.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectMood(idx)}
                      className={`text-2xl rounded-xl p-2 transition-all active:scale-90 ${moodValid && todayMood === idx ? "bg-primary/20 scale-110 shadow-glow-primary" : "hover:bg-background-elevated"}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {moodValid && todayMood !== null && (
                  <p className="text-[10px] text-center text-muted-foreground mt-2">Feeling: {MOODS[todayMood]}</p>
                )}
              </div>

              {/* Tag Filter */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
                {["all", ...allTags].map((tag) => (
                  <button key={tag} onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-1 transition-colors ${
                      activeTag === tag ? "bg-primary text-primary-foreground" : "bg-background-elevated hover:bg-background-elevated/80 text-muted-foreground"
                    }`}>
                    {tag !== "all" && <Tag className="w-3 h-3" />}{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Checklist */}
            <div className="space-y-3">
              {filteredProtocols.map((p) => (
                <div key={p.id} className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  p.completed ? "bg-primary/10 border-primary/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]" : "bg-background-elevated/40 border-border"
                }`}>
                  <div onClick={() => toggleProtocol(p.id)} className={`p-2 rounded-full transition-colors cursor-pointer ${p.completed ? "bg-primary/20" : "bg-background-elevated"}`}>
                    {getIcon(p.icon, p.completed)}
                  </div>
                  {editingId === p.id ? (
                    <input
                      autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(p.id); if (e.key === "Escape") setEditingId(null); }}
                      className="flex-1 bg-transparent border-b border-primary text-sm focus:outline-none"
                    />
                  ) : (
                    <div className="flex-1 cursor-pointer" onClick={() => toggleProtocol(p.id)}>
                      <span className={`text-sm font-medium ${p.completed ? "line-through opacity-60" : ""}`}>{p.title}</span>
                      {p.tags && p.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {p.tags.map((t) => (
                            <span key={t} className="text-[9px] uppercase tracking-wider text-muted-foreground bg-background px-1.5 py-0.5 rounded-sm">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    {editingId === p.id ? (
                      <>
                        <button onClick={() => saveEdit(p.id)} className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-muted-foreground hover:bg-background-elevated rounded-lg transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(p.id); setEditTitle(p.title); }} className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-background-elevated rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteProtocol(p.id)} className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        {p.completed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground/30" />}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Protocol */}
              {showAddForm ? (
                <div className="flex gap-2">
                  <input autoFocus value={addTitle} onChange={(e) => setAddTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addProtocol(); if (e.key === "Escape") setShowAddForm(false); }}
                    placeholder="New protocol name…"
                    className="flex-1 bg-background-elevated border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button onClick={addProtocol} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">Add</button>
                  <button onClick={() => setShowAddForm(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all text-sm">
                  <Plus className="w-4 h-4" /> Add Protocol
                </button>
              )}
              <p className="text-[10px] text-muted-foreground text-center">Last reset: {lastReset}</p>
            </div>
          </motion.div>
        )}

        {/* ══ TAB: FOCUS (POMODORO) ════════════════════════════════════════ */}
        {tab === "focus" && (
          <motion.div key="focus" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="max-w-md mx-auto space-y-6">
            {/* Intention */}
            <div className="glass-panel rounded-xl p-5 border border-border">
              <label className="text-[10px] uppercase tracking-widest terminal-text text-muted-foreground block mb-2">What are you working on?</label>
              <input value={pomIntention} onChange={(e) => setPomIntention(e.target.value)}
                placeholder="e.g. Finish portfolio redesign…"
                className="w-full bg-transparent border-b border-border text-sm text-foreground focus:outline-none focus:border-primary pb-1 placeholder:text-muted-foreground/40 transition-colors" />
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              {(["work", "break"] as const).map((m) => (
                <button key={m} onClick={() => switchPomMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${pomMode === m ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-background-elevated text-muted-foreground hover:text-foreground"}`}>
                  {m === "work" ? "⚡ Work" : "☕ Break"}
                </button>
              ))}
            </div>

            {/* Timer Ring */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                  <motion.circle cx="100" cy="100" r="80" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={pomCircumference}
                    animate={{ strokeDashoffset: pomCircumference * (1 - pomProgress) }}
                    transition={{ duration: 0.5 }}
                    className={`${pomMode === "work" ? "text-primary" : "text-success"} drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-mono font-bold tracking-tighter">{pomMins}:{pomSecs}</span>
                  <span className="text-[10px] terminal-text uppercase tracking-widest text-muted-foreground mt-1">
                    {pomMode === "work" ? "Focus" : "Break"}
                  </span>
                  <span className="mt-2 text-xs text-warning flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {pomCount} sessions today
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button onClick={pomReset} className="px-4 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-background-elevated transition-all">Reset</button>
                <motion.button whileTap={{ scale: 0.94 }} onClick={pomToggle}
                  className="w-16 h-16 rounded-full bg-gradient-cyber flex items-center justify-center shadow-glow-primary text-background">
                  {pomRunning ? <span className="text-xl">⏸</span> : <span className="text-xl">▶</span>}
                </motion.button>
                <button onClick={() => setPomCount(0)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-background-elevated transition-all">Clear</button>
              </div>
            </div>

            {/* Duration Settings */}
            <div className="glass-panel rounded-xl p-4 border border-border grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest terminal-text text-muted-foreground">Work (min)</label>
                <input type="number" min={1} max={90} value={workDur}
                  onChange={(e) => { setWorkDur(Number(e.target.value)); if (!pomRunning && pomMode === "work") setPomSeconds(Number(e.target.value) * 60); }}
                  className="w-full mt-1 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest terminal-text text-muted-foreground">Break (min)</label>
                <input type="number" min={1} max={30} value={breakDur}
                  onChange={(e) => { setBreakDur(Number(e.target.value)); if (!pomRunning && pomMode === "break") setPomSeconds(Number(e.target.value) * 60); }}
                  className="w-full mt-1 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ TAB: MUSIC ══════════════════════════════════════════════════ */}
        {tab === "music" && (
          <motion.div key="music" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="max-w-lg mx-auto">
            <FocusMusic />
          </motion.div>
        )}

        {/* ══ TAB: SCRATCHPAD ═════════════════════════════════════════════ */}
        {tab === "scratch" && (
          <motion.div key="scratch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="h-[70vh]">
            <div className="glass-panel rounded-xl border border-border h-full flex flex-col overflow-hidden">
              <div className="border-b border-border/40 bg-background-elevated/30 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-warning" />
                  <span className="terminal-text text-[10px] uppercase tracking-widest font-bold text-foreground">Neural Scratchpad</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              </div>
              <textarea
                value={brainDump} onChange={(e) => setBrainDump(e.target.value)}
                placeholder="Dump thoughts, ideas, rapid tasks here. Auto-synced to local storage…"
                className="w-full flex-1 bg-transparent border-none resize-none p-5 text-sm font-mono text-muted-foreground focus:text-foreground focus:ring-0 focus:outline-none hide-scrollbar placeholder:opacity-30"
                spellCheck={false}
              />
              <div className="px-4 py-2 border-t border-border/20 flex items-center justify-between">
                <span className="text-[9px] terminal-text text-muted-foreground/50">{brainDump.length} chars</span>
                <button onClick={() => setBrainDump("")} className="text-[9px] terminal-text uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors">Clear</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
