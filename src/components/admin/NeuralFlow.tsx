import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play, Pause, Square, Volume2, VolumeX, Zap, BrainCircuit, Activity,
  Timer, Coffee, SkipForward, Radio, Plus, X, Music2, Waves,
  History, TrendingUp, ChevronDown, Headphones
} from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Stream {
  id: string;
  name: string;
  emoji: string;
  url: string;
  isCustom?: boolean;
  isOffline?: boolean; // procedural audio (Web Audio API)
}

interface FocusSession {
  id: string;
  task: string;
  duration: number; // minutes
  completedAt: string;
  mode: "focus" | "break";
}

// ─── Default Streams ────────────────────────────────────────────────────────
const DEFAULT_STREAMS: Stream[] = [
  // Procedural (offline, Web Audio API)
  { id: "brown", name: "Brown Noise", emoji: "🟤", url: "", isOffline: true },
  { id: "white", name: "White Noise", emoji: "⚪", url: "", isOffline: true },
  // Streaming
  { id: "lofi", name: "Lofi Hip-Hop", emoji: "🎵", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { id: "rain", name: "Rain & Thunder", emoji: "🌧️", url: "https://stream.zeno.fm/yn65m50fmk0uv" },
  { id: "deepwork", name: "Deep Work Beats", emoji: "⚡", url: "https://stream.zeno.fm/oxnfd4vr0t8uv" },
  { id: "jazz", name: "Focus Jazz", emoji: "🎷", url: "https://stream.zeno.fm/wrb1h5s5f5zuv" },
  { id: "piano", name: "Piano Focus", emoji: "🎹", url: "https://stream.zeno.fm/0r9wd0g04cruv" },
  { id: "nature", name: "Nature Sounds", emoji: "🌿", url: "https://stream.zeno.fm/4d6bksfnrk0uv" },
  { id: "cafe", name: "Café Ambience", emoji: "☕", url: "https://stream.zeno.fm/mfm0nz04f18uv" },
];

// ─── Procedural Audio Engine ────────────────────────────────────────────────
class ProceduralAudio {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  sources: (AudioBufferSourceNode | OscillatorNode)[] = [];

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  stop() {
    this.sources.forEach(s => { try { s.stop(); s.disconnect(); } catch {} });
    this.sources = [];
  }

  setVolume(v: number) {
    if (this.masterGain) this.masterGain.gain.value = v;
  }

  playBrown() {
    this.init();
    this.stop();
    if (!this.ctx || !this.masterGain) return;
    const bufSize = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const out = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufSize; i++) {
      const w = Math.random() * 2 - 1;
      out[i] = (last + 0.02 * w) / 1.02;
      last = out[i];
      out[i] *= 3.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const filt = this.ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 400;
    noise.connect(filt);
    filt.connect(this.masterGain);
    noise.start();
    this.sources.push(noise);
  }

  playWhite() {
    this.init();
    this.stop();
    if (!this.ctx || !this.masterGain) return;
    const bufSize = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const out = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      out[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const filt = this.ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 1200;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.3;
    noise.connect(filt);
    filt.connect(gainNode);
    gainNode.connect(this.masterGain);
    noise.start();
    this.sources.push(noise);
  }

  playChime() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.12);
    osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.24);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }
}

const proceduralEngine = new ProceduralAudio();

// ─── Visualizer Bar Count ───────────────────────────────────────────────────
const BAR_COUNT = 20;

// ─── Component ──────────────────────────────────────────────────────────────
export const NeuralFlow = () => {
  // ── Focus State ──
  const [isActive, setIsActive] = useState(false);
  const [targetTask, setTargetTask] = useState("");
  const [focusDuration, setFocusDuration] = useLocalStorage("nf_focus_dur", 25);
  const [breakDuration, setBreakDuration] = useLocalStorage("nf_break_dur", 5);
  const [pomodoroEnabled, setPomodoroEnabled] = useLocalStorage("nf_pomodoro", true);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentPhase, setCurrentPhase] = useState<"focus" | "break">("focus");
  const [sessionCount, setSessionCount] = useState(0);

  // ── Audio State ──
  const [streams, setStreams] = useLocalStorage<Stream[]>("nf_streams", DEFAULT_STREAMS);
  const [activeStreamId, setActiveStreamId] = useLocalStorage("nf_active_stream", "lofi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useLocalStorage("nf_volume", 0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(4));
  const [streamError, setStreamError] = useState<string | null>(null);

  // ── UI State ──
  const [showAddStream, setShowAddStream] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // ── Session History ──
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>("nf_sessions", []);

  // ── Refs ──
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const activeStream = streams.find(s => s.id === activeStreamId) ?? streams[0];

  // ── Web Audio Analyser ──
  const setupAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
    }
    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
  }, []);

  const animateBars = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const step = Math.floor(data.length / BAR_COUNT);
    setBars(Array.from({ length: BAR_COUNT }, (_, i) => Math.max(4, (data[i * step] / 255) * 100)));
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, []);

  // ── Playback ──
  const playStream = useCallback(async () => {
    if (!activeStream) return;
    setStreamError(null);

    if (activeStream.isOffline) {
      // Procedural audio
      proceduralEngine.setVolume(isMuted ? 0 : volume);
      if (activeStream.id === "brown") proceduralEngine.playBrown();
      else if (activeStream.id === "white") proceduralEngine.playWhite();
      setIsPlaying(true);
      return;
    }

    // Streaming audio
    if (!audioRef.current) return;
    try {
      setupAnalyser();
      if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
      await audioRef.current.play();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(animateBars);
    } catch {
      setStreamError("Stream unavailable — try another or add a custom URL.");
      setIsPlaying(false);
    }
  }, [activeStream, volume, isMuted, setupAnalyser, animateBars]);

  const pauseStream = useCallback(() => {
    proceduralEngine.stop();
    audioRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
    setBars(Array(BAR_COUNT).fill(4));
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pauseStream() : playStream();
  }, [isPlaying, pauseStream, playStream]);

  const switchStream = useCallback((id: string) => {
    pauseStream();
    setActiveStreamId(id);
    setStreamError(null);
  }, [pauseStream, setActiveStreamId]);

  // ── When stream changes, reload audio src ──
  useEffect(() => {
    if (!audioRef.current || !activeStream) return;
    if (activeStream.isOffline) return; // procedural doesn't use <audio>
    const wasPlaying = isPlaying;
    audioRef.current.src = activeStream.url;
    audioRef.current.load();
    if (wasPlaying) setTimeout(() => playStream(), 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStreamId]);

  // ── Volume sync ──
  useEffect(() => {
    const v = isMuted ? 0 : volume;
    if (audioRef.current) audioRef.current.volume = v;
    proceduralEngine.setVolume(v);
  }, [volume, isMuted]);

  // ── Cleanup ──
  useEffect(() => () => {
    cancelAnimationFrame(animFrameRef.current);
    proceduralEngine.stop();
  }, []);

  // ── Timer ──
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      if (isActive && endTime) {
        const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(diff);
        if (diff === 0) {
          handlePhaseComplete();
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }
    };
    if (isActive && endTime) frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, endTime]);

  // ── Focus Handlers ──
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTask.trim()) { toast.error("Define your target task first."); return; }
    const ms = focusDuration * 60 * 1000;
    setEndTime(Date.now() + ms);
    setTimeLeft(focusDuration * 60);
    setCurrentPhase("focus");
    setIsActive(true);
    if (!isPlaying) playStream();
    toast.success("Focus session started. Let's go.");
    try { document.documentElement.requestFullscreen(); } catch {}
  };

  const handlePhaseComplete = () => {
    proceduralEngine.playChime();

    if (currentPhase === "focus") {
      // Log completed focus session
      const session: FocusSession = {
        id: Date.now().toString(),
        task: targetTask,
        duration: focusDuration,
        completedAt: new Date().toISOString(),
        mode: "focus",
      };
      setSessions(prev => [session, ...prev].slice(0, 50));
      setSessionCount(c => c + 1);

      if (pomodoroEnabled) {
        // Switch to break
        toast.success(`Focus done! Take a ${breakDuration}min break.`);
        setCurrentPhase("break");
        const ms = breakDuration * 60 * 1000;
        setEndTime(Date.now() + ms);
        setTimeLeft(breakDuration * 60);
      } else {
        handleEnd();
        toast.success("Focus session completed!");
      }
    } else {
      // Break completed — back to focus
      toast.info("Break over! Ready for another round?");
      setCurrentPhase("focus");
      const ms = focusDuration * 60 * 1000;
      setEndTime(Date.now() + ms);
      setTimeLeft(focusDuration * 60);
    }
  };

  const handleAbort = () => {
    setIsActive(false);
    setEndTime(null);
    setCurrentPhase("focus");
    pauseStream();
    toast.error("Session aborted.");
    try { document.exitFullscreen(); } catch {}
  };

  const handleEnd = () => {
    setIsActive(false);
    setEndTime(null);
    setCurrentPhase("focus");
    try { document.exitFullscreen(); } catch {}
  };

  const skipPhase = () => {
    if (currentPhase === "focus") {
      handlePhaseComplete();
    } else {
      setCurrentPhase("focus");
      const ms = focusDuration * 60 * 1000;
      setEndTime(Date.now() + ms);
      setTimeLeft(focusDuration * 60);
      toast.info("Break skipped. Back to work!");
    }
  };

  const addCustomStream = () => {
    if (!customUrl.trim()) return;
    const id = `custom_${Date.now()}`;
    const ns: Stream = { id, name: customName.trim() || "My Stream", emoji: "📻", url: customUrl.trim(), isCustom: true };
    setStreams([...streams, ns]);
    setCustomName(""); setCustomUrl(""); setShowAddStream(false);
    switchStream(id);
  };

  const removeStream = (id: string) => {
    setStreams(streams.filter(s => s.id !== id));
    if (activeStreamId === id) switchStream("lofi");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalFocusMinutes = sessions
    .filter(s => s.mode === "focus")
    .reduce((sum, s) => sum + s.duration, 0);

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVE STATE — Fullscreen Focus View
  // ─────────────────────────────────────────────────────────────────────────
  if (isActive) {
    const progress = currentPhase === "focus"
      ? 1 - timeLeft / (focusDuration * 60)
      : 1 - timeLeft / (breakDuration * 60);
    const circumference = 2 * Math.PI * 140;

    return (
      <div className="fixed inset-0 z-[200] bg-black text-foreground flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle animated background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: currentPhase === "focus"
              ? "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 70%)"
              : "radial-gradient(circle at 50% 50%, hsl(var(--success)) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6 gap-6 sm:gap-10">
          {/* Phase indicator */}
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] ${currentPhase === "focus" ? "text-primary" : "text-success"}`}>
            {currentPhase === "focus" ? <BrainCircuit className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
            {currentPhase === "focus" ? "Deep Focus" : "Break Time"}
            {pomodoroEnabled && (
              <span className="text-muted-foreground font-normal ml-2">#{sessionCount + 1}</span>
            )}
          </div>

          {/* Circular Progress Timer */}
          <div className="relative flex items-center justify-center">
            <svg className="w-56 h-56 sm:w-72 sm:h-72 -rotate-90" viewBox="0 0 300 300">
              {/* Background ring */}
              <circle cx="150" cy="150" r="140" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" opacity="0.2" />
              {/* Progress ring */}
              <circle
                cx="150" cy="150" r="140" fill="none"
                stroke={currentPhase === "focus" ? "hsl(var(--primary))" : "hsl(var(--success))"}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-2">remaining</span>
            </div>
          </div>

          {/* Task */}
          <div className="text-center w-full">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Current Objective</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground/90 bg-white/5 py-3 px-6 rounded-2xl border border-white/10">
              {targetTask}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            {/* Audio controls */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-full border border-white/10">
              <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 text-muted-foreground hover:text-foreground transition">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01}
                value={isMuted ? 0 : volume}
                onChange={e => { setIsMuted(false); setVolume(Number(e.target.value)); }}
                className="w-16 sm:w-24 h-1 accent-primary cursor-pointer"
              />
            </div>

            {/* Now playing pill */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-full border border-white/10 text-xs text-muted-foreground">
              <span>{activeStream?.emoji}</span>
              <span className="max-w-[80px] truncate">{activeStream?.name}</span>
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3">
                  {[0.4, 0.7, 1, 0.6].map((d, i) => (
                    <span key={i} className="w-[2px] rounded-full bg-primary animate-bounce" style={{ height: `${d * 100}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Skip / Abort */}
            {pomodoroEnabled && (
              <button onClick={skipPhase} className="p-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition" title="Skip phase">
                <SkipForward className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleAbort}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 text-xs font-bold uppercase tracking-widest transition"
            >
              <Square className="w-3.5 h-3.5" /> Abort
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INACTIVE STATE — Setup Dashboard
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-6">
      {/* Hidden audio element for streaming */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="none" />

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Neural Flow
        </h2>
        <p className="text-sm text-muted-foreground">
          ADHD-optimized focus engine with integrated ambient music and Pomodoro cycles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ── Left Column: Focus Setup ── */}
        <div className="space-y-4">
          <div className="glass-panel p-4 sm:p-6 rounded-xl border border-border">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" /> Focus Parameters
            </h3>
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Single Target Task</label>
                <input
                  type="text"
                  placeholder="What is the ONE thing you will do?"
                  value={targetTask}
                  onChange={e => setTargetTask(e.target.value)}
                  className="mt-1.5 w-full bg-background-elevated border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Focus (min)</label>
                  <input
                    type="number" min={1} max={120}
                    value={focusDuration}
                    onChange={e => setFocusDuration(Number(e.target.value))}
                    className="mt-1.5 w-full bg-background-elevated border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Break (min)</label>
                  <input
                    type="number" min={1} max={30}
                    value={breakDuration}
                    onChange={e => setBreakDuration(Number(e.target.value))}
                    className="mt-1.5 w-full bg-background-elevated border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pomodoroEnabled}
                  onChange={e => setPomodoroEnabled(e.target.checked)}
                  className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm">Pomodoro Mode (auto-cycle focus → break)</span>
              </label>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-all rounded-xl py-3 font-bold uppercase tracking-widest text-xs active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" /> Start Focus Session
              </button>
            </form>
          </div>

          {/* Session Stats */}
          <div className="glass-panel p-4 sm:p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" /> Stats
              </h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-[10px] terminal-text uppercase tracking-widest text-muted-foreground hover:text-primary transition flex items-center gap-1"
              >
                <History className="w-3 h-3" /> History
                <ChevronDown className={`w-3 h-3 transition-transform ${showHistory ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background-elevated rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{sessions.filter(s => s.mode === "focus").length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Sessions</p>
              </div>
              <div className="bg-background-elevated rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{Math.round(totalFocusMinutes / 60 * 10) / 10}h</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Total Focus</p>
              </div>
            </div>

            {/* History list */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 max-h-40 overflow-y-auto space-y-1.5">
                    {sessions.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No sessions yet. Start your first focus session!</p>
                    )}
                    {sessions.slice(0, 20).map(s => (
                      <div key={s.id} className="flex items-center justify-between bg-background-elevated/60 rounded-lg px-3 py-2 text-xs">
                        <span className="truncate flex-1 mr-2 text-foreground">{s.task}</span>
                        <span className="text-muted-foreground shrink-0">{s.duration}min</span>
                        <span className="text-muted-foreground/60 shrink-0 ml-2 text-[10px]">
                          {new Date(s.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right Column: Music Player ── */}
        <div className="space-y-4">
          {/* Now Playing / Visualizer */}
          <div className="glass-panel rounded-xl border border-border p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl shrink-0 ${isPlaying ? "animate-pulse" : ""}`}>
                  {activeStream?.emoji ?? "🎵"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{activeStream?.name ?? "Select a stream"}</p>
                  <p className="text-[10px] uppercase tracking-widest terminal-text text-muted-foreground mt-0.5">
                    {isPlaying ? "▶ Playing" : "Paused"} {activeStream?.isOffline ? "· Offline" : "· Stream"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-lg text-muted-foreground hover:bg-background-elevated hover:text-foreground transition">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-full bg-gradient-cyber flex items-center justify-center shadow-glow-primary transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-background" /> : <Play className="w-5 h-5 text-background ml-0.5" />}
                </motion.button>
              </div>
            </div>

            {/* Frequency Bars */}
            {!activeStream?.isOffline && (
              <div className="flex items-end justify-center gap-[3px] h-12 mb-3">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.08, ease: "linear" }}
                    className="w-full rounded-full"
                    style={{
                      background: isPlaying ? `hsl(${215 + (i / BAR_COUNT) * 105} 100% 60%)` : "hsl(var(--muted))",
                      opacity: isPlaying ? 0.8 : 0.3,
                      minHeight: 4,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Waves className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                type="range" min={0} max={1} step={0.01}
                value={isMuted ? 0 : volume}
                onChange={e => { setIsMuted(false); setVolume(Number(e.target.value)); }}
                className="w-full h-1.5 rounded-full accent-primary cursor-pointer"
              />
              <span className="text-[10px] terminal-text text-muted-foreground w-7 shrink-0">
                {Math.round((isMuted ? 0 : volume) * 100)}
              </span>
            </div>

            {streamError && <p className="mt-2 text-[11px] text-destructive text-center">{streamError}</p>}
          </div>

          {/* Stream Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5" /> Streams
              </h3>
              <button
                onClick={() => setShowAddStream(!showAddStream)}
                className="flex items-center gap-1 text-[10px] terminal-text uppercase tracking-widest text-primary hover:text-primary/80 transition"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
              {streams.map(stream => (
                <button
                  key={stream.id}
                  onClick={() => switchStream(stream.id)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all w-full ${
                    activeStreamId === stream.id
                      ? "bg-primary/10 border-primary/40"
                      : "bg-background-elevated/40 border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-base">{stream.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{stream.name}</p>
                    {stream.isOffline && <p className="text-[9px] text-muted-foreground">Offline · Procedural</p>}
                    {stream.isCustom && <p className="text-[9px] text-muted-foreground truncate">{stream.url}</p>}
                  </div>
                  {activeStreamId === stream.id && isPlaying && (
                    <div className="flex items-end gap-[2px] h-3.5">
                      {[0.4, 0.7, 1, 0.6].map((d, i) => (
                        <span key={i} className="w-[2px] rounded-full bg-primary animate-bounce" style={{ height: `${d * 100}%`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                  {stream.isCustom && (
                    <button
                      onClick={e => { e.stopPropagation(); removeStream(stream.id); }}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            {/* Add Custom Stream */}
            <AnimatePresence>
              {showAddStream && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                    <p className="text-xs font-semibold flex items-center gap-2">
                      <Music2 className="w-3.5 h-3.5 text-primary" /> Add Custom Stream
                    </p>
                    <input
                      type="text"
                      placeholder="Name (e.g. Binaural 432Hz)"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="url"
                      placeholder="Stream URL (mp3/ogg/aac)"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <button onClick={addCustomStream} className="flex-1 bg-gradient-cyber text-background text-xs font-bold py-2 rounded-lg hover:opacity-90 transition">
                        Add & Play
                      </button>
                      <button onClick={() => setShowAddStream(false)} className="px-3 py-2 text-xs text-muted-foreground border border-border rounded-lg hover:text-foreground transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
