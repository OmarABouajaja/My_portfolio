import { useState, useEffect, useRef } from "react";
import { Play, Square, Volume2, VolumeX, Crosshair, Zap, BrainCircuit, Activity } from "lucide-react";
import { toast } from "sonner";

// Web Audio API generators for zero-dependency ambient noise
class AmbientAudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  noiseSources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  activeTheme: string = "none";

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;
    }
  }

  stop() {
    this.noiseSources.forEach(s => {
      try { s.stop(); s.disconnect(); } catch (e) {}
    });
    this.noiseSources = [];
    this.activeTheme = "none";
  }

  setVolume(val: number) {
    if (this.masterGain) this.masterGain.gain.value = val;
  }

  playBrownNoise() {
    this.init();
    this.stop();
    this.activeTheme = "brown";
    
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.noiseSources.push(noise);
  }

  playCyberDrone() {
    this.init();
    this.stop();
    this.activeTheme = "cyber";

    if (!this.ctx || !this.masterGain) return;
    
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 45; 
    
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 46; 

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; 
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.masterGain);
    
    osc1.start();
    osc2.start();
    lfo.start();
    this.noiseSources.push(osc1, osc2, lfo);
  }
}

const audioEngine = new AmbientAudioEngine();

export const NeuralFlow = () => {
  const [isActive, setIsActive] = useState(false);
  const [targetTask, setTargetTask] = useState("");
  const [duration, setDuration] = useState(25); // minutes
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [endTime, setEndTime] = useState<number | null>(null);
  
  const [volume, setVolume] = useState(0.5);
  const [audioTheme, setAudioTheme] = useState<"none" | "brown" | "cyber">("none");

  // Timer loop independent of tab throttling
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      if (isActive && endTime) {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(diff);

        if (diff === 0) {
          handleComplete();
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }
    };

    if (isActive && endTime) {
      frameId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isActive, endTime]);

  // Audio management
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (audioTheme === "none") audioEngine.stop();
    if (audioTheme === "brown") audioEngine.playBrownNoise();
    if (audioTheme === "cyber") audioEngine.playCyberDrone();
    
    return () => audioEngine.stop(); // Cleanup on unmount
  }, [audioTheme]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTask.trim()) {
      toast.error("You must define a Single Target Task.");
      return;
    }
    
    const ms = duration * 60 * 1000;
    setEndTime(Date.now() + ms);
    setTimeLeft(duration * 60);
    setIsActive(true);
    
    if (audioTheme === "none") setAudioTheme("brown"); // default to noise
    toast.success("Neural Flow State Initiated.");
    
    // Attempt to request fullscreen
    try { document.documentElement.requestFullscreen(); } catch(e) {}
  };

  const handleAbort = () => {
    setIsActive(false);
    setEndTime(null);
    setAudioTheme("none");
    toast.error("Flow State Aborted. Focus Broken.");
    try { document.exitFullscreen(); } catch(e) {}
  };

  const handleComplete = () => {
    setIsActive(false);
    setEndTime(null);
    setAudioTheme("none");
    toast.success("Flow State Completed! Target achieved.");
    // Play success chime
    try {
      audioEngine.init();
      const osc = audioEngine.ctx!.createOscillator();
      osc.frequency.setValueAtTime(440, audioEngine.ctx!.currentTime);
      osc.frequency.setValueAtTime(880, audioEngine.ctx!.currentTime + 0.1);
      osc.connect(audioEngine.ctx!.destination);
      osc.start();
      osc.stop(audioEngine.ctx!.currentTime + 0.3);
    } catch(e) {}
    try { document.exitFullscreen(); } catch(e) {}
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // -------------------------------------------------------------
  // ACTIVE STATE UI (Fullscreen Lockdown)
  // -------------------------------------------------------------
  if (isActive) {
    return (
      <div className="fixed inset-0 z-[200] bg-black text-primary flex flex-col items-center justify-center overflow-hidden font-mono">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50" />
        
        {/* Pulsing Background */}
        <div className="absolute inset-0 bg-primary/5 animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="relative z-10 flex flex-col items-center max-w-2xl w-full px-6 space-y-12">
          
          <div className="flex items-center gap-3 text-destructive animate-pulse">
            <BrainCircuit className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-[0.5em] uppercase">Neural Flow Active</h1>
          </div>

          <div className="text-[12rem] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/30 drop-shadow-[0_0_50px_rgba(34,211,238,0.5)]">
            {formatTime(timeLeft)}
          </div>

          <div className="text-center space-y-4 w-full">
            <div className="text-sm tracking-widest uppercase text-primary/50">Current Objective</div>
            <div className="text-2xl text-foreground font-display bg-background-elevated/50 py-6 px-8 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              {targetTask}
            </div>
          </div>

          <div className="flex items-center gap-8 bg-background-elevated/50 p-4 rounded-full border border-border backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div className="flex gap-2">
                <button 
                  onClick={() => setAudioTheme("brown")}
                  className={`px-3 py-1 text-xs rounded transition ${audioTheme === "brown" ? "bg-primary text-background" : "hover:bg-primary/20"}`}
                >
                  Brown Noise
                </button>
                <button 
                  onClick={() => setAudioTheme("cyber")}
                  className={`px-3 py-1 text-xs rounded transition ${audioTheme === "cyber" ? "bg-primary text-background" : "hover:bg-primary/20"}`}
                >
                  Cyber Drone
                </button>
                <button 
                  onClick={() => setAudioTheme("none")}
                  className={`px-3 py-1 text-xs rounded transition ${audioTheme === "none" ? "bg-destructive text-background" : "hover:bg-destructive/20 text-destructive"}`}
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="w-[1px] h-8 bg-border" />

            <button 
              onClick={handleAbort}
              className="flex items-center gap-2 text-destructive hover:text-white hover:bg-destructive px-4 py-2 rounded-full transition-all text-xs tracking-widest font-bold uppercase"
            >
              <Square className="w-4 h-4" /> Abort
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // INACTIVE STATE UI (Settings Dashboard)
  // -------------------------------------------------------------
  return (
    <div className="w-full h-full space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-primary flex items-center gap-2">
          <Activity className="w-5 h-5" /> Neural Flow State
        </h2>
        <p className="text-sm text-muted-foreground">ADHD-optimized Pomodoro focus engine with integrated synth-wave ambient noise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-border">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Focus Parameters</h3>
          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Single Target Task</label>
              <input 
                type="text" 
                placeholder="What is the ONE thing you will do?"
                value={targetTask}
                onChange={e => setTargetTask(e.target.value)}
                className="w-full bg-background-elevated border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Duration (Minutes)</label>
              <input 
                type="number" 
                min="1" max="120"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-background-elevated border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:shadow-glow-primary transition-all rounded-lg py-3 font-bold uppercase tracking-widest text-xs"
            >
              <Zap className="w-4 h-4" /> Initiate Lockdown
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-success/5 border border-success/20 p-4 rounded-xl flex gap-3">
            <Crosshair className="w-5 h-5 text-success shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-success">Why Neural Flow?</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Context-switching destroys productivity. Neural Flow locks your UI, blocks other tabs, and uses ambient audio to stimulate the brain—forcing absolute focus on a single objective until completion.
              </p>
            </div>
          </div>
          
          <div className="bg-background-elevated p-4 rounded-xl border border-border">
            <h4 className="text-sm font-bold mb-2">Ambient Audio Preview</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setAudioTheme(audioTheme === "brown" ? "none" : "brown")}
                className={`px-3 py-1.5 text-xs rounded transition border ${audioTheme === "brown" ? "bg-primary text-background border-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}
              >
                Brown Noise
              </button>
              <button 
                onClick={() => setAudioTheme(audioTheme === "cyber" ? "none" : "cyber")}
                className={`px-3 py-1.5 text-xs rounded transition border ${audioTheme === "cyber" ? "bg-primary text-background border-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}
              >
                Cyber Drone
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">Audio is synthetically generated via Web Audio API. No external dependencies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
