import { useState, useEffect, useRef } from "react";
import { Shield, Lock, Terminal, AlertTriangle, ArrowLeft, Cpu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase, isDemoMode } from "@/integrations/supabase/safeFetch";

const FALLBACK_TOKEN = "CLI-1234";

export const TokenLogin = ({ onAuth }: { onAuth: () => void }) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const trimmedToken = token.trim().toUpperCase();

    if (!hasSupabase || isDemoMode()) {
      // Mock mode: accept the fallback token
      setTimeout(() => {
        if (trimmedToken === FALLBACK_TOKEN) {
          sessionStorage.setItem("client_auth", "true");
          sessionStorage.setItem("nexus_client_token_id", "ct-1");
          onAuth();
        } else {
          setError(true);
          setLoading(false);
        }
      }, 800);
      return;
    }

    // Live mode: validate via Supabase RPC
    try {
      const { data, error: rpcError } = await supabase.rpc("validate_client_token", {
        p_token: trimmedToken,
      });

      if (rpcError || !data || data.length === 0) {
        setError(true);
        setLoading(false);
        return;
      }

      const tokenRow = data[0];
      sessionStorage.setItem("client_auth", "true");
      sessionStorage.setItem("nexus_client_token_id", tokenRow.token_id);
      sessionStorage.setItem("nexus_client_name", tokenRow.client_name || "Client");
      onAuth();
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-pulse-slow"
            style={{
              width: `${4 + i * 3}px`, height: `${4 + i * 3}px`,
              top: `${15 + i * 14}%`, left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Main Site
        </a>

        <div className="glass-panel rounded-2xl p-8 shadow-elevated relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-cyber opacity-[0.03]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary glow-ring">
                <Shield className="h-8 w-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                <Lock className="h-2.5 w-2.5 text-accent" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight">Client Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Enter your secure access token to view project status and communicate with Omar.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
              <div className="text-left">
                <label className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">
                  Access Token
                </label>
                <div className="mt-1.5 relative">
                  <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    value={token}
                    onChange={(e) => { setToken(e.target.value); setError(false); }}
                    placeholder="CLI-XXXX"
                    className={`w-full rounded-lg border ${error ? "border-destructive" : "border-border"} bg-background/60 pl-10 pr-4 py-3 text-sm terminal-text tracking-wider outline-none focus:border-primary focus:shadow-glow-primary transition placeholder:text-muted-foreground/40`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-xs text-destructive terminal-text flex items-center gap-1.5 animate-slide-in">
                    <AlertTriangle className="w-3 h-3" />
                    Invalid token. Access denied.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !token.trim()}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 hover:shadow-glow-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Cpu className="w-4 h-4 animate-spin" /> Authenticating…</>
                ) : (
                  <><Lock className="w-4 h-4" /> Authenticate</>
                )}
              </button>
            </form>

            <p className="mt-6 text-[11px] text-muted-foreground/60 terminal-text">
              Tokens are issued per-project. Contact Omar for access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
