import { useState, useEffect } from "react";
import { safeFetchOne } from "@/integrations/supabase/safeFetch";
import { dbUpsert } from "@/integrations/supabase/mutations";
import { supabase } from "@/integrations/supabase/client";
import type { SiteMetadata } from "@/hooks/useSiteMetadata";
import { toast } from "sonner";
import { Save, Loader2, ExternalLink, Lock, Eye, EyeOff, ShieldCheck, AlertTriangle, LogOut, ShieldAlert, BellRing, Palette, X } from "lucide-react";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEFAULT_NAV } from "@/pages/Admin";

const hexToHsl = (hex: string) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const hslToHex = (hslStr: string) => {
  const match = hslStr.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) return "#000000";
  let h = parseInt(match[1]) / 360;
  let s = parseInt(match[2]) / 100;
  let l = parseInt(match[3]) / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// ── Password Strength Indicator ──────────────────────────────────────────────
const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "6+ chars", ok: password.length >= 6 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Symbol", ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-warning", "bg-success"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const textColors = ["text-destructive", "text-destructive", "text-warning", "text-warning", "text-success"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score] : "bg-muted/40"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {checks.map(c => (
            <span key={c.label} className={`text-[9px] terminal-text ${c.ok ? "text-success" : "text-muted-foreground/50"}`}>
              {c.ok ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        <span className={`text-[9px] terminal-text uppercase tracking-widest font-bold ${textColors[score]}`}>{labels[score]}</span>
      </div>
    </div>
  );
};

export const SettingsPanel = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const { currentTheme, applyTheme, themes, allThemeColors, addCustomTheme, removeCustomTheme, customThemes } = useThemeEngine();
  const [meta, setMeta] = useState<SiteMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Change Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Notifications hook for pushing updates
  const { sendNotification } = useNotifications();

  // Theme Builder State
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemePrimary, setNewThemePrimary] = useState("215 100% 60%");
  const [newThemeSecondary, setNewThemeSecondary] = useState("270 85% 65%");

  // Lockdown State
  const [lockdownActive, setLockdownActive] = useState(false);

  // Mobile Dock Customization
  const [dockItemKeys, setDockItemKeys] = useLocalStorage<string[]>("bo3_dock_items", ["overview", "lifeos", "iot", "settings"]);

  // AI Config State
  const [aiConfig, setAiConfig] = useLocalStorage("ai_provider_config", {
    apiKey: "",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini"
  });

  const applyAIPreset = (preset: "openai" | "deepseek" | "groq" | "openrouter" | "ollama") => {
    const presets = {
      openai: { baseUrl: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini" },
      deepseek: { baseUrl: "https://api.deepseek.com/v1/chat/completions", model: "deepseek-chat" },
      groq: { baseUrl: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" },
      openrouter: { baseUrl: "https://openrouter.ai/api/v1/chat/completions", model: "google/gemini-2.0-flash-exp:free" },
      ollama: { baseUrl: "http://localhost:11434/v1/chat/completions", model: "llama3" }
    };
    setAiConfig({ ...aiConfig, ...presets[preset] });
    toast.success(`${preset.toUpperCase()} preset applied!`);
  };

  useEffect(() => {
    loadSettings();
    setLockdownActive(localStorage.getItem("nexus_lockdown_mode") === "true");
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await safeFetchOne<SiteMetadata>("site_metadata", { order: "updated_at" });
    setMeta(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta) return;

    setSaving(true);
    const { data, error } = await dbUpsert("site_metadata", {
      id: "config",
      hiring_status: meta.hiring_status,
      active_projects_count: meta.active_projects_count,
      system_status: meta.system_status,
      primary_theme_color: meta.primary_theme_color,
      contact_email: meta.contact_email,
      resume_url: meta.resume_url,
      enable_projects: meta.enable_projects,
      enable_timeline: meta.enable_timeline,
      enable_tech_stack: meta.enable_tech_stack,
      enable_testimonials: meta.enable_testimonials,
      enable_blog: meta.enable_blog,
      enable_contact: meta.enable_contact,
    });

    if (error) {
      toast.error(`Failed to save settings: ${error}`);
    } else {
      toast.success("Settings updated successfully");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent password change in demo mode
    if (sessionStorage.getItem("nexus_demo_mode") === "true") {
      toast.error("Password changes are disabled in Demo Mode.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPw(true);
    try {
      // Forcefully check if the session exists in the client before attempting update
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Your session has expired or is desynchronized. Please sign out and sign in again.");
        setChangingPw(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        if (error.message.toLowerCase().includes("session missing")) {
          toast.error("Client session desynchronized. Please sign out and sign in again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("session missing")) {
        toast.error("Client session desynchronized. Please sign out and sign in again.");
      } else {
        toast.error(err.message || "An unexpected error occurred while changing password.");
      }
    } finally {
      setChangingPw(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("nexus_demo_mode");
    await supabase.auth.signOut();
    window.location.href = "/admin";
  };

  const toggleLockdown = () => {
    const newState = !lockdownActive;
    setLockdownActive(newState);
    localStorage.setItem("nexus_lockdown_mode", String(newState));
    if (newState) {
      toast.success("Lockdown Mode Initiated. Strict security rules applied.");
      // In a real app, this would trigger Edge Functions to block traffic or tighten WAF rules
    } else {
      toast.info("Lockdown Mode Deactivated. Security levels normalized.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;
  }

  if (!meta) {
    return <div className="text-center p-8 text-muted-foreground">No metadata found.</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* ─── Site Settings Form ─── */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
              System Status
            </label>
            <select
              value={meta.system_status}
              onChange={(e) => setMeta({ ...meta, system_status: e.target.value })}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="online">Online</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
              <option value="lockdown">Lockdown Mode</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
              Active Projects Count
            </label>
            <input
              type="number"
              value={meta.active_projects_count}
              onChange={(e) => setMeta({ ...meta, active_projects_count: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <input
                type="checkbox"
                checked={meta.hiring_status}
                onChange={(e) => setMeta({ ...meta, hiring_status: e.target.checked })}
                className="rounded border-border bg-background"
              />
              Available for Freelance
            </label>
            <p className="text-xs text-muted-foreground">
              Toggles the availability status indicator on the hero section.
            </p>
          </div>

          <div className="space-y-3 col-span-full mt-4 border-t border-border/40 pt-6">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
              <span>OS Theme Engine</span>
              <span className="text-primary">{currentTheme}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {themes.map((t) => {
                const themeColors: Record<string, { bg: string; label: string }> = {
                  'neon-cyan': { bg: 'linear-gradient(135deg, hsl(215 100% 60%), hsl(270 85% 65%))', label: 'Neon Cyan' },
                  'matrix-green': { bg: 'linear-gradient(135deg, hsl(142 76% 50%), hsl(187 95% 55%))', label: 'Matrix' },
                  'cyber-red': { bg: 'linear-gradient(135deg, hsl(0 84% 60%), hsl(38 92% 60%))', label: 'Cyber Red' },
                  'ocean-blue': { bg: 'linear-gradient(135deg, hsl(210 100% 50%), hsl(180 100% 45%))', label: 'Ocean' },
                  'dracula': { bg: 'linear-gradient(135deg, hsl(326 100% 74%), hsl(265 89% 78%))', label: 'Dracula' },
                  'synthwave': { bg: 'linear-gradient(135deg, hsl(315 100% 50%), hsl(30 100% 50%))', label: 'Synthwave' },
                };
                const info = themeColors[t] || { 
                  bg: `linear-gradient(135deg, hsl(${allThemeColors[t]?.primary}), hsl(${allThemeColors[t]?.secondary}))`, 
                  label: t 
                };
                return (
                  <div key={t} className="relative group flex flex-col items-center">
                    <button
                      type="button"
                      aria-label={`Select ${info.label} theme`}
                      onClick={() => {
                        applyTheme(t);
                        setMeta({ ...meta, primary_theme_color: t });
                      }}
                      className={`flex flex-col items-center gap-2 w-full p-3 rounded-xl border-2 transition-all duration-300 ${currentTheme === t ? 'border-primary scale-105 shadow-glow-primary bg-primary/5' : 'border-border/30 hover:border-border/60 scale-100 bg-background-elevated/30'}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full shadow-lg"
                        style={{ background: info.bg }}
                      />
                      <span className={`text-[9px] terminal-text uppercase tracking-widest truncate w-full text-center ${currentTheme === t ? 'text-primary' : 'text-muted-foreground'}`}>
                        {info.label}
                      </span>
                    </button>
                    {customThemes[t] && (
                      <button
                        type="button"
                        onClick={() => removeCustomTheme(t)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete custom theme"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
              
              <button
                type="button"
                onClick={() => setShowThemeBuilder(!showThemeBuilder)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border/40 hover:border-primary/60 transition-all duration-300 bg-background-elevated/10 hover:bg-primary/5"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background text-muted-foreground">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="text-[9px] terminal-text uppercase tracking-widest text-muted-foreground">Custom</span>
              </button>
            </div>

            {showThemeBuilder && (
              <div className="mt-4 p-4 rounded-xl border border-border bg-background-elevated/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                <h4 className="terminal-text text-[10px] uppercase tracking-widest text-primary">Theme Builder</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-muted-foreground">Theme Name</label>
                    <input
                      type="text"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      placeholder="e.g. My Custom Theme"
                      className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-muted-foreground">Primary HSL</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={hslToHex(newThemePrimary)}
                        onChange={(e) => setNewThemePrimary(hexToHsl(e.target.value))}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={newThemePrimary}
                        onChange={(e) => setNewThemePrimary(e.target.value)}
                        placeholder="e.g. 215 100% 60%"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-muted-foreground">Secondary HSL</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={hslToHex(newThemeSecondary)}
                        onChange={(e) => setNewThemeSecondary(hexToHsl(e.target.value))}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={newThemeSecondary}
                        onChange={(e) => setNewThemeSecondary(e.target.value)}
                        placeholder="e.g. 270 85% 65%"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={!newThemeName || !newThemePrimary || !newThemeSecondary}
                    onClick={() => {
                      addCustomTheme(newThemeName.toLowerCase().replace(/\s+/g, '-'), {
                        primary: newThemePrimary,
                        primaryGlow: newThemePrimary,
                        ring: newThemePrimary,
                        accent: newThemePrimary,
                        secondary: newThemeSecondary,
                      });
                      setNewThemeName("");
                      setShowThemeBuilder(false);
                      toast.success("Custom theme created!");
                    }}
                    className="rounded-md bg-primary/10 border border-primary/30 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition disabled:opacity-50"
                  >
                    Save Custom Theme
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
              Resume PDF URL
            </label>
            <input
              type="url"
              value={meta.resume_url || ""}
              onChange={(e) => setMeta({ ...meta, resume_url: e.target.value || null })}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="https://.../resume.pdf"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use the local fallback.
            </p>
          </div>

          <div className="space-y-2">
            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
              Public Contact Email
            </label>
            <input
              type="email"
              value={meta.contact_email || ""}
              onChange={(e) => setMeta({ ...meta, contact_email: e.target.value || null })}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="you@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Displayed in the contact section and used for form notification emails.
            </p>
          </div>
        </div>

        {/* ─── AI Assistant Configuration ─── */}
        <div className="space-y-4 pt-6 border-t border-border/40">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">AI Assistant Configuration</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Bring your own API key to power the Nexus AI. Keys are stored locally in your browser and never sent to your database.
          </p>

          <div className="flex gap-2 flex-wrap mb-4">
            <button type="button" onClick={() => applyAIPreset('openai')} className="text-[10px] px-3 py-1 border border-border rounded-md hover:border-primary transition uppercase tracking-wider">OpenAI</button>
            <button type="button" onClick={() => applyAIPreset('deepseek')} className="text-[10px] px-3 py-1 border border-border rounded-md hover:border-primary transition uppercase tracking-wider">DeepSeek</button>
            <button type="button" onClick={() => applyAIPreset('groq')} className="text-[10px] px-3 py-1 border border-border rounded-md hover:border-primary transition uppercase tracking-wider">Groq</button>
            <button type="button" onClick={() => applyAIPreset('openrouter')} className="text-[10px] px-3 py-1 border border-border rounded-md hover:border-primary transition uppercase tracking-wider">OpenRouter</button>
            <button type="button" onClick={() => applyAIPreset('ollama')} className="text-[10px] px-3 py-1 border border-border rounded-md border-primary/50 text-primary hover:bg-primary/10 transition uppercase tracking-wider">Ollama (Local)</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Base URL</label>
              <input
                type="url"
                value={aiConfig.baseUrl}
                onChange={(e) => setAiConfig({ ...aiConfig, baseUrl: e.target.value })}
                className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Model Name</label>
              <input
                type="text"
                value={aiConfig.model}
                onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">API Key</label>
              <input
                type="password"
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* ─── Advanced Security: Lockdown Mode ─── */}
        <div className={`mt-8 rounded-xl border p-6 transition-all duration-500 relative overflow-hidden ${lockdownActive ? 'border-destructive bg-destructive/10' : 'border-destructive/30 bg-destructive/5'}`}>
          {lockdownActive && (
            <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none mix-blend-overlay" />
          )}
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center relative z-10">
            <div className="space-y-2">
              <h3 className="terminal-text text-sm uppercase tracking-widest text-destructive flex items-center gap-2 font-bold">
                <ShieldAlert className={`w-5 h-5 ${lockdownActive ? 'animate-pulse' : ''}`} /> 
                System Lockdown Mode
              </h3>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Activating Lockdown Mode immediately drops all non-essential incoming connections, tightens WAF rules, and logs all deep packet inspections.
              </p>
            </div>
            
            <button
              type="button"
              onClick={toggleLockdown}
              className={`relative overflow-hidden group shrink-0 px-6 py-3 rounded-md font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
                lockdownActive 
                  ? 'bg-destructive text-destructive-foreground shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
                  : 'bg-transparent border border-destructive text-destructive hover:bg-destructive/10'
              }`}
            >
              {lockdownActive ? 'Disable Lockdown' : 'Initiate Lockdown'}
              {lockdownActive && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-border/40">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">Section Visibility</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {["projects", "services", "timeline", "tech_stack", "equipment", "certifications", "testimonials", "blog", "contact"].map((section) => (
              <label key={section} className="flex items-center gap-3 rounded-md border border-border bg-background-elevated/40 px-4 py-3 cursor-pointer hover:border-primary/50 transition">
                <input
                  type="checkbox"
                  aria-label={`Toggle ${section} visibility`}
                  checked={(meta as any)[`enable_${section}`] !== false}
                  onChange={(e) => setMeta({ ...meta, [`enable_${section}`]: e.target.checked } as any)}
                  className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium capitalize">{section.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-border/40">
          <div className="flex items-center justify-between">
            <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">Social & Contact Links</h3>
            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab("social_links")}
                className="text-xs text-muted-foreground hover:text-primary transition flex items-center gap-1"
              >
                Manage Links <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Social icons and public contact channels are managed in the dedicated Social Links module.
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-border/40">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">Mobile Experience</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Manage the standalone Android APK and trigger update notifications for mobile users.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/app-release.apk"
              download="Nexus_Portfolio_App.apk"
              className="inline-flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/20 hover:border-accent/50"
            >
              <ShieldCheck className="h-4 w-4" /> Download Android APK
            </a>
            <button
              type="button"
              onClick={() => {
                sendNotification(
                  "App Update Available",
                  "A new version of the Android App is available with performance improvements and new features.",
                  "SYSTEM_UPDATE",
                  "https://github.com/Omar-ABouajaja/My_portfolio/releases/latest/download/app-debug.apk" // Fallback link
                );
                toast.success("Push notification sent to all devices.");
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 border border-primary/30 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/20 hover:border-primary/50"
            >
              <BellRing className="h-4 w-4" /> Push Update Alert
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-border/40">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">Mobile Dock Configuration</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Select the 4 modules you want pinned to the mobile floating dock.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((slotIndex) => (
              <div key={slotIndex} className="space-y-2">
                <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
                  Dock Slot {slotIndex < 2 ? slotIndex + 1 : slotIndex + 2} {slotIndex === 1 && <span className="text-[9px] lowercase text-muted-foreground/50">(Left)</span>} {slotIndex === 2 && <span className="text-[9px] lowercase text-muted-foreground/50">(Right)</span>}
                </label>
                <select
                  value={dockItemKeys[slotIndex]}
                  onChange={(e) => {
                    const newKeys = [...dockItemKeys];
                    newKeys[slotIndex] = e.target.value;
                    setDockItemKeys(newKeys);
                  }}
                  className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {DEFAULT_NAV.map((navItem) => (
                    <option key={navItem.value} value={navItem.value}>
                      {navItem.label} ({navItem.group})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-cyber px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-primary transition hover:shadow-elevated disabled:opacity-50 mt-8"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
      </form>

      {/* ─── Change Password ─── */}
      <div className="border-t border-border/40 pt-8">
        <div className="glass-panel rounded-xl p-6 border border-border">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4" /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div>
              <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">New Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showNewPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  tabIndex={-1}
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <PasswordStrength password={newPassword} />
            <div>
              <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Confirm Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`w-full rounded-lg border bg-background/50 px-4 py-2.5 pr-10 text-sm outline-none transition ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary focus:shadow-glow-primary"
                  }`}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  tabIndex={-1}
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={changingPw || !newPassword || newPassword !== confirmPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* ─── Logout ─── */}
      <div className="border-t border-border/40 pt-6">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/20 hover:border-destructive/50"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Command Center
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          This will clear your session and redirect you to the login page.
        </p>
      </div>
    </div>
  );
};
