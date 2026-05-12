import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { CircuitBackground } from "@/components/CircuitBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // No-op — 404 route, nothing to log in production
  }, [location.pathname]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      <CircuitBackground />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="glass-panel rounded-2xl p-10 w-full">
          <div className="terminal-text text-[10px] uppercase tracking-[0.4em] text-warning flex items-center justify-center gap-2">
            <AlertTriangle className="h-3 w-3 animate-pulse" />
            kernel panic — segment not mapped
          </div>
          <h1 className="mt-6 font-display text-7xl sm:text-8xl font-bold text-gradient-cyber animate-flicker">
            0x404
          </h1>
          <p className="mt-4 terminal-text text-sm text-muted-foreground">
            <span className="text-primary">$</span> route <span className="text-foreground">{location.pathname}</span> not found in OS index
          </p>
          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-cyber px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow-primary transition hover:shadow-elevated"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            Reboot to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
