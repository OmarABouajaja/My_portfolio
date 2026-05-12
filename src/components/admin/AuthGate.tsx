import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase } from "@/integrations/supabase/safeFetch";
import { Cpu, Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { SITE } from "@/config/siteConfig";

interface Props {
  children: React.ReactNode;
  isDemoRoute?: boolean;
}

export const AuthGate = ({ children, isDemoRoute }: Props) => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

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
      if (s) verifyAdmin(s.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const verifyAdmin = async (uid: string) => {
    try {
      const { data, error } = await supabase.rpc("has_role", { _role: "admin", _user_id: uid });
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      setResetSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    }
  };

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

  if (!session || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        {/* Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-elevated relative overflow-hidden border border-border/50">
          <div className="pointer-events-none absolute inset-0 bg-gradient-cyber opacity-5" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="relative mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight">{SITE.brandHandle}</h1>
            <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">Command Center</p>
            
            {!session ? (
              <div className="mt-8 w-full">
                {!showResetForm ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-6">
                      Enter your credentials to access the admin subsystem.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                      <div>
                        <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <KeyRound className="w-3 h-3" /> Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          className="mt-1.5 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition placeholder:text-muted-foreground/40"
                          placeholder="you@domain.com"
                        />
                      </div>
                      <div>
                        <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Lock className="w-3 h-3" /> Password
                        </label>
                        <div className="relative mt-1.5">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition placeholder:text-muted-foreground/40"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => { setShowResetForm(true); setResetEmail(email); }}
                          className="text-[11px] text-muted-foreground hover:text-primary transition"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-1 flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>Authenticate <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>

                    <div className="relative mt-8">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/60" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background-elevated px-3 text-muted-foreground terminal-text tracking-widest">
                          Or Sandbox
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem("nexus_demo_mode", "true");
                        window.location.href = "/demo";
                      }}
                      className="w-full mt-6 rounded-lg border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/20 hover:shadow-glow-accent"
                    >
                      Explore Demo (Recruiters)
                    </button>
                  </>
                ) : (
                  /* Password Reset Form */
                  <div className="mt-2 w-full">
                    {resetSent ? (
                      <div className="text-center py-4 space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success mx-auto">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                        <p className="text-sm text-foreground font-medium">Password Reset Email Sent</p>
                        <p className="text-xs text-muted-foreground">Check your inbox for a link to reset your password.</p>
                        <button
                          onClick={() => { setShowResetForm(false); setResetSent(false); }}
                          className="mt-4 text-xs text-primary hover:underline"
                        >
                          ← Back to login
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-6">
                          Enter your email to receive a password reset link.
                        </p>
                        <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                          <div>
                            <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
                            <input
                              type="email"
                              required
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              className="mt-1.5 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:shadow-glow-primary transition"
                              placeholder="you@domain.com"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50"
                          >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                          </button>
                        </form>
                        <button
                          onClick={() => setShowResetForm(false)}
                          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary transition"
                        >
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
                  onClick={() => {
                    sessionStorage.removeItem("nexus_demo_mode");
                    supabase.auth.signOut();
                    window.location.href = "/admin";
                  }}
                  className="mt-4 rounded-lg border border-border px-5 py-2 text-sm text-foreground hover:bg-background-elevated transition"
                >
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
