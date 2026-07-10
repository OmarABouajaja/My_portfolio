import { useState, useEffect } from "react";
import { safeFetchOne } from "@/integrations/supabase/safeFetch";
import { dbUpsert } from "@/integrations/supabase/mutations";
import { supabase } from "@/integrations/supabase/client";
import type { SiteMetadata } from "@/hooks/useSiteMetadata";
import { toast } from "sonner";
import { Save, Loader2, ExternalLink, Lock, Eye, EyeOff, ShieldCheck, AlertTriangle, LogOut } from "lucide-react";
import { useThemeEngine } from "@/hooks/useThemeEngine";

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
  const { currentTheme, applyTheme, themes } = useThemeEngine();
  const [meta, setMeta] = useState<SiteMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Change Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    loadSettings();
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
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPw(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("nexus_demo_mode");
    await supabase.auth.signOut();
    window.location.href = "/admin";
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
            <div className="flex gap-4">
              {themes.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`Select ${t} theme`}
                  onClick={() => {
                    applyTheme(t);
                    setMeta({ ...meta, primary_theme_color: t });
                  }}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${currentTheme === t ? 'border-primary scale-110 shadow-glow-primary' : 'border-border/40 hover:border-border scale-100'}`}
                  style={{
                    background: t === 'neon-cyan' ? 'hsl(185 100% 55%)' :
                                t === 'matrix-green' ? 'hsl(142 76% 50%)' :
                                t === 'cyber-red' ? 'hsl(0 84% 60%)' :
                                'hsl(45 100% 50%)'
                  }}
                />
              ))}
            </div>
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

        <div className="space-y-4 pt-6 border-t border-border/40">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">Section Visibility</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {["projects", "timeline", "tech_stack", "testimonials", "blog", "contact"].map((section) => (
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
            Download the standalone Android APK (if generated) to test the native mobile experience.
          </p>
          <a
            href="/app-release.apk"
            download="Nexus_Portfolio_App.apk"
            className="inline-flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/20 hover:border-accent/50"
          >
            <ShieldCheck className="h-4 w-4" /> Download Android APK
          </a>
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
