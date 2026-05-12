import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props { children: ReactNode; fallbackLabel?: string; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Intentional — surfaces stack in devtools for debugging
    console.error(`[Boundary:${this.props.fallbackLabel ?? "?"}]`, error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-warning/30 bg-warning/5 text-center min-h-[200px] gap-4">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="h-5 w-5" />
          <span className="terminal-text text-xs uppercase tracking-widest">
            Module Crash — {this.props.fallbackLabel || "Component"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          This module hit an error and was isolated. The rest of the app is unaffected.
        </p>
        <button
          onClick={this.handleReset}
          className="inline-flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-medium text-warning transition hover:bg-warning/20"
        >
          <RefreshCcw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }
}
