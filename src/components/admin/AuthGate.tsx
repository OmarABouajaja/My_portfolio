import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase } from "@/integrations/supabase/safeFetch";
import {
  Cpu, Lock, Eye, EyeOff, ArrowRight, Loader2,
  KeyRound, ShieldCheck, Zap, AlertTriangle, CheckCircle2, Mail, Download, Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { SITE } from "@/config/siteConfig";

interface Props {
  children: React.ReactNode;
  isDemoRoute?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// Password Strength Indicator
// ──────────────────────────────────────────────────────────────────────────────
const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "6+ chars", ok: password.length >= 6 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Symbol", ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-destructive", "bg-warning", "bg-warning", "bg-success", "bg-success"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score] : "bg-muted/40"}`}
          />
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
        <span className={`text-[9px] terminal-text uppercase tracking-widest font-bold ${colors[score].replace("bg-", "text-")}`}>
          {labels[score]}
        </span>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Set New Password Form (used for both recovery & in-session change)
// ──────────────────────────────────────────────────────────────────────────────
const SetNewPasswordPage = ({ onDone }: { onDone: () => void }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirm) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
    toast.success("Password updated! Redirecting to admin…");
    setTimeout(onDone, 1800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-elevated relative overflow-hidden border border-border/50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-cyber opacity-5" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {done ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success border border-success/20 mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Password Updated</h1>
              <p className="mt-2 text-sm text-muted-foreground">Redirecting to your command center…</p>
              <div className="mt-4 w-8 h-1 rounded-full bg-success/40 animate-pulse" />
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow-primary mb-6">
                <Lock className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Set New Password</h1>
              <p className="mt-2 text-sm text-muted-foreground">Choose a strong password for your admin account.</p>

              <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4 text-left">
                <div>
                  <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">New Password</label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition"
                      placeholder="Min 6 characters"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={newPassword} />
                </div>

                <div>
                  <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Confirm Password</label>
                  <div className="relative mt-1.5">
                    <input
                      type="password"
                      required
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className={`w-full rounded-lg border bg-background/50 px-4 py-2.5 text-sm outline-none transition ${
                        confirm && confirm !== newPassword ? "border-destructive" : "border-border focus:border-primary focus:shadow-glow-primary"
                      }`}
                      placeholder="Re-enter password"
                    />
                  </div>
                  {confirm && confirm !== newPassword && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving || !newPassword || newPassword !== confirm}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Update Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Magic Link Authenticating Screen
// ──────────────────────────────────────────────────────────────────────────────
const MagicLinkScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
    </div>
    <div className="glass-panel w-full max-w-sm rounded-2xl p-10 shadow-elevated border border-primary/30 flex flex-col items-center text-center gap-5">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow-primary">
          <Zap className="h-10 w-10" />
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/10" style={{ animationDuration: "1.5s" }} />
      </div>
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">Verifying Magic Link</h1>
        <p className="mt-2 text-sm text-muted-foreground">Authenticating your secure link…</p>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 w-8 rounded-full bg-primary/30 animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-[10px] terminal-text uppercase tracking-widest text-muted-foreground/60">
        {SITE.brandHandle} · Secure Auth
      </p>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// Main AuthGate
// ──────────────────────────────────────────────────────────────────────────────
export const AuthGate = ({ children, isDemoRoute }: Props) => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Form mode ──
  const [formMode, setFormMode] = useState<"login" | "forgot" | "magic">("login");
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // ── URL hash flags ──
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);  // type=recovery hash
  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false); // type=magiclink hash

  useEffect(() => {
    // Detect Supabase auth hash fragments
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecoveryMode(true);
    } else if (hash.includes("type=magiclink") || hash.includes("access_token")) {
      // Supabase will auto-exchange the token via onAuthStateChange
      setIsMagicLinkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDemoRoute || sessionStorage.getItem("nexus_demo_mode") === "true") {
      sessionStorage.setItem("nexus_demo_mode", "true");
      setSession({ user: { email: "demo@recruiter.local", id: "demo-recruiter" } });
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    if (!hasSupabase) {
      setSession({ user: { email: "admin@mock.local" } });
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) verifyAdmin(s.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s);
      if (s) {
        setIsMagicLinkMode(false); // Auth confirmed — stop showing magic link screen
        verifyAdmin(s.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const verifyAdmin = async (uid: string) => {
    try {
      // Pass _user_id to match the remote database signature for has_role
      const { data, error } = await supabase.rpc("has_role", { _role: "admin", _user_id: uid } as any);
      if (error) throw error;
      setIsAdmin(data || false);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setSubmitting(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setResetSent(true);
    toast.success("Password reset email sent! Check your inbox.");
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setMagicSent(true);
    toast.success("Magic link sent! Check your email.");
  };

  // ── Priority screens ──────────────────────────────────────────────────────

  // 1. Recovery link from email → show password reset form
  if (isRecoveryMode && (!session || !isAdmin)) {
    return (
      <SetNewPasswordPage
        onDone={() => {
          setIsRecoveryMode(false);
          window.history.replaceState(null, "", window.location.pathname);
          window.location.reload();
        }}
      />
    );
  }

  // 2. Magic link clicked → show "Verifying…" screen while Supabase exchanges token
  if (isMagicLinkMode && !session) {
    return <MagicLinkScreen />;
  }

  // 3. Standard loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 w-12 h-12" />
            <Cpu className="h-8 w-8 text-primary relative z-10 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // 4. Not authenticated or not admin → show login
  if (!session || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5 py-8">
        {/* Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden border border-border/30">
          <div className="pointer-events-none absolute inset-0 bg-gradient-cyber opacity-5" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="relative mb-5">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-cyber text-background shadow-glow-primary">
                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight">{SITE.brandHandle}</h1>
            <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">Command Center</p>

            {!session ? (
              <div className="mt-8 w-full">

                {/* ── Login form ── */}
                {formMode === "login" && (
                  <>
                    <p className="text-sm text-muted-foreground mb-6">Enter your credentials to access the admin subsystem.</p>
                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                      <div>
                        <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <KeyRound className="w-3 h-3" /> Email
                        </label>
                        <input
                          type="email" required value={email} onChange={e => setEmail(e.target.value)}
                          autoComplete="email"
                          className="mt-1.5 w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition placeholder:text-muted-foreground/40"
                          placeholder="you@domain.com"
                        />
                      </div>
                      <div>
                        <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Lock className="w-3 h-3" /> Password
                        </label>
                        <div className="relative mt-1.5">
                          <input
                            type={showPassword ? "text" : "password"} required value={password}
                            onChange={e => setPassword(e.target.value)} autoComplete="current-password"
                            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition placeholder:text-muted-foreground/40"
                            placeholder="••••••••"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <button type="button" onClick={() => { setFormMode("magic"); setMagicEmail(email); }}
                          className="text-muted-foreground hover:text-accent transition flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Magic Link
                        </button>
                        <button type="button" onClick={() => { setFormMode("forgot"); setResetEmail(email); }}
                          className="text-muted-foreground hover:text-primary transition">
                          Forgot password?
                        </button>
                      </div>

                      <button type="submit" disabled={submitting}
                        className="w-full mt-1 flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-all active:scale-[0.97] hover:bg-foreground/90 disabled:opacity-50">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Authenticate <ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative mt-8">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background-elevated px-3 text-muted-foreground terminal-text tracking-widest">Or Sandbox</span>
                      </div>
                    </div>
                    <button type="button"
                      onClick={() => { sessionStorage.setItem("nexus_demo_mode", "true"); window.location.href = "/demo"; }}
                      className="w-full mt-6 rounded-xl border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-all active:scale-[0.97] hover:bg-accent/20">
                      Explore Demo (Recruiters)
                    </button>
                    <a
                      href="https://github.com/Omar-ABouajaja/My_portfolio/releases/latest/download/app-debug.apk"
                      download
                      className="w-full mt-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-medium text-primary transition-all active:scale-[0.97] hover:bg-primary/20 flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Get Android App
                    </a>
                  </>
                )}

                {/* ── Magic Link form ── */}
                {formMode === "magic" && (
                  <div className="w-full">
                    {magicSent ? (
                      <div className="text-center py-4 space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent mx-auto">
                          <Mail className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-medium">Magic Link Sent!</p>
                        <p className="text-xs text-muted-foreground">Check your inbox — click the link to log in instantly.</p>
                        <button onClick={() => { setFormMode("login"); setMagicSent(false); }}
                          className="mt-4 text-xs text-primary hover:underline">← Back to login</button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-6">We'll send a secure one-time login link to your email.</p>
                        <form onSubmit={handleMagicLink} className="space-y-4 text-left">
                          <div>
                            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <Mail className="w-3 h-3" /> Email
                            </label>
                            <input type="email" required value={magicEmail} onChange={e => setMagicEmail(e.target.value)}
                              className="mt-1.5 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:shadow-glow-accent transition placeholder:text-muted-foreground/40"
                              placeholder="you@domain.com" autoFocus />
                          </div>
                          <button type="submit" disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Send Magic Link</>}
                          </button>
                        </form>
                        <button onClick={() => setFormMode("login")}
                          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary transition">
                          ← Back to login
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* ── Forgot password form ── */}
                {formMode === "forgot" && (
                  <div className="w-full">
                    {resetSent ? (
                      <div className="text-center py-4 space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success mx-auto">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-medium">Reset Email Sent</p>
                        <p className="text-xs text-muted-foreground">Check your inbox for a link to reset your password.</p>
                        <button onClick={() => { setFormMode("login"); setResetSent(false); }}
                          className="mt-4 text-xs text-primary hover:underline">← Back to login</button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a password reset link.</p>
                        <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
                          <div>
                            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
                            <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                              className="mt-1.5 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition"
                              placeholder="you@domain.com" autoFocus />
                          </div>
                          <button type="submit" disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                          </button>
                        </form>
                        <button onClick={() => setFormMode("login")}
                          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary transition">
                          ← Back to login
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Logged in but not admin */
              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-destructive/80">Your account lacks administrative privileges.</p>
                <p className="text-xs text-muted-foreground">Logged in as: <span className="text-foreground">{session.user.email}</span></p>
                <button
                  onClick={() => { sessionStorage.removeItem("nexus_demo_mode"); supabase.auth.signOut(); window.location.href = "/admin"; }}
                  className="mt-4 rounded-lg border border-border px-5 py-2 text-sm text-foreground hover:bg-background-elevated transition">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
