import { useTelemetry } from "@/hooks/useTelemetry";
import { Terminal, Trash2, ShieldAlert, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export const TelemetryViewer = () => {
  const { logs, clearTelemetry } = useTelemetry();

  const getIconForLevel = (level: string) => {
    switch (level) {
      case 'error': return <ShieldAlert className="w-3.5 h-3.5 text-destructive" />;
      case 'warn': return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
      default: return <Info className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const getColorForLevel = (level: string) => {
    switch (level) {
      case 'error': return "text-destructive";
      case 'warn': return "text-warning";
      case 'success': return "text-success";
      default: return "text-primary/80";
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">System Telemetry</h3>
          <p className="text-sm text-muted-foreground">Real-time log viewer for OS events and module activities.</p>
        </div>
        <button 
          onClick={clearTelemetry}
          className="inline-flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear Logs
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-xl border border-border/50 bg-[#050505] overflow-hidden flex flex-col shadow-elevated">
        <div className="border-b border-border/40 bg-background-elevated/50 px-4 py-2.5 flex items-center gap-3 shrink-0">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="terminal-text text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            system_telemetry_stream
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="terminal-text text-[9px] text-success/80">LISTENING</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px] sm:text-xs">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Terminal className="w-8 h-8 mb-3" />
              <p className="terminal-text uppercase tracking-widest text-[10px]">No recent telemetry data</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-1.5 hover:bg-white/5 rounded px-2 transition-colors">
                <span className="text-muted-foreground/60 shrink-0 tabular-nums">
                  {new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}
                </span>
                <span className="flex items-center gap-1.5 shrink-0 w-[120px]">
                  {getIconForLevel(log.level)}
                  <span className={`uppercase tracking-wider ${getColorForLevel(log.level)}`}>[{log.module}]</span>
                </span>
                <span className="text-foreground/90 break-words">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
