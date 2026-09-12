import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Plus, X, Music2, Waves } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

interface Stream {
  id: string;
  name: string;
  emoji: string;
  url: string;
  isCustom?: boolean;
}

const DEFAULT_STREAMS: Stream[] = [
  { id: "lofi", name: "Lofi Hip-Hop", emoji: "🎵", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { id: "rain", name: "Rain & Thunder", emoji: "🌧️", url: "https://stream.zeno.fm/yn65m50fmk0uv" },
  { id: "deepwork", name: "Deep Work Beats", emoji: "⚡", url: "https://stream.zeno.fm/oxnfd4vr0t8uv" },
  { id: "whitenoise", name: "White Noise", emoji: "🌊", url: "https://stream.zeno.fm/2y5xvxkq7t8uv" },
  { id: "jazz", name: "Focus Jazz", emoji: "🎷", url: "https://stream.zeno.fm/wrb1h5s5f5zuv" },
];

const BAR_COUNT = 20;

export const FocusMusic = () => {
  const [streams, setStreams] = useLocalStorage<Stream[]>("bo3_focus_streams", DEFAULT_STREAMS);
  const [activeId, setActiveId] = useLocalStorage<string>("bo3_focus_active_stream", "lofi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useLocalStorage<number>("bo3_focus_volume", 0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(4));
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const activeStream = streams.find((s) => s.id === activeId) ?? streams[0];

  // ── Setup Web Audio API ──────────────────────────────────────────────────
  const setupAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 64;
    }
    if (!sourceRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(ctx.destination);
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

  // ── Playback control ────────────────────────────────────────────────────
  const play = useCallback(async () => {
    if (!audioRef.current) return;
    setError(null);
    try {
      setupAnalyser();
      if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
      await audioRef.current.play();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(animateBars);
    } catch {
      setError("Stream unavailable — try another or add a custom URL.");
      setIsPlaying(false);
    }
  }, [setupAnalyser, animateBars]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
    setBars(Array(BAR_COUNT).fill(4));
  }, []);

  const toggle = useCallback(() => { isPlaying ? pause() : play(); }, [isPlaying, pause, play]);

  // Switch stream
  const switchStream = useCallback((id: string) => {
    pause();
    setActiveId(id);
    setError(null);
  }, [pause, setActiveId]);

  // When activeId changes, reload audio element src
  useEffect(() => {
    if (!audioRef.current || !activeStream) return;
    const wasPlaying = isPlaying;
    audioRef.current.src = activeStream.url;
    audioRef.current.load();
    if (wasPlaying) { setTimeout(() => play(), 200); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Cleanup
  useEffect(() => () => { cancelAnimationFrame(animFrameRef.current); }, []);

  const addCustomStream = () => {
    if (!customUrl.trim()) return;
    const id = `custom_${Date.now()}`;
    const newStream: Stream = {
      id,
      name: customName.trim() || "My Stream",
      emoji: "📻",
      url: customUrl.trim(),
      isCustom: true,
    };
    setStreams([...streams, newStream]);
    setCustomUrl("");
    setCustomName("");
    setShowAddForm(false);
    switchStream(id);
  };

  const removeStream = (id: string) => {
    setStreams(streams.filter((s) => s.id !== id));
    if (activeId === id) switchStream("lofi");
  };

  return (
    <div className="space-y-6">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="none" />

      {/* Visualizer */}
      <div className="glass-panel rounded-xl border border-border p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        {/* Now Playing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl shrink-0 ${isPlaying ? "animate-pulse" : ""}`}>
              {activeStream?.emoji ?? "🎵"}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground leading-tight">
                {activeStream?.name ?? "Select a stream"}
              </p>
              <p className="text-[10px] uppercase tracking-widest terminal-text text-muted-foreground mt-0.5">
                {isPlaying ? "▶ Streaming live" : "Paused"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-background-elevated hover:text-foreground transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggle}
              className="w-12 h-12 rounded-full bg-gradient-cyber flex items-center justify-center shadow-glow-primary transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-background" /> : <Play className="w-5 h-5 text-background ml-0.5" />}
            </motion.button>
          </div>
        </div>

        {/* Frequency Bars */}
        <div className="flex items-end justify-center gap-[3px] h-14 mb-4">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.08, ease: "linear" }}
              className="w-full rounded-full"
              style={{
                background: isPlaying
                  ? `hsl(${215 + (i / BAR_COUNT) * 105} 100% 60%)`
                  : "hsl(var(--muted))",
                opacity: isPlaying ? 0.8 : 0.3,
                minHeight: 4,
              }}
            />
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <Waves className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => { setIsMuted(false); setVolume(Number(e.target.value)); }}
            className="w-full h-1.5 rounded-full accent-primary cursor-pointer"
          />
          <span className="text-[10px] terminal-text text-muted-foreground w-7 shrink-0">
            {Math.round((isMuted ? 0 : volume) * 100)}
          </span>
        </div>

        {error && (
          <p className="mt-3 text-[11px] text-destructive text-center">{error}</p>
        )}
      </div>

      {/* Stream Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" /> Streams
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-[10px] terminal-text uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {streams.map((stream) => (
            <motion.button
              key={stream.id}
              onClick={() => { switchStream(stream.id); }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                activeId === stream.id
                  ? "bg-primary/10 border-primary/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]"
                  : "bg-background-elevated/40 border-border hover:border-primary/30"
              }`}
            >
              <span className="text-lg">{stream.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{stream.name}</p>
                {stream.isCustom && (
                  <p className="text-[9px] terminal-text text-muted-foreground truncate">{stream.url}</p>
                )}
              </div>
              {activeId === stream.id && isPlaying && (
                <div className="flex items-end gap-[2px] h-4">
                  {[0.4, 0.7, 1, 0.6].map((d, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-primary animate-bounce"
                      style={{ height: `${d * 100}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
              {stream.isCustom && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeStream(stream.id); }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.button>
          ))}
        </div>

        {/* Add Custom Stream Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <p className="text-xs font-semibold flex items-center gap-2 text-foreground">
                  <Music2 className="w-3.5 h-3.5 text-primary" /> Add Custom Stream
                </p>
                <input
                  type="text"
                  placeholder="Name (e.g. Binaural 432Hz)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50"
                />
                <input
                  type="url"
                  placeholder="Stream URL (mp3 / ogg / aac)"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addCustomStream}
                    className="flex-1 bg-gradient-cyber text-background text-xs font-bold py-2 rounded-lg transition-opacity hover:opacity-90"
                  >
                    Add & Play
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
