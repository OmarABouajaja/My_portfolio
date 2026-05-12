import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, Shield } from "lucide-react";
import { useClientChat } from "@/hooks/useClientChat";

export const ClientMessages = () => {
  const { messages, sendMessage, markAllAsRead } = useClientChat("omar");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    markAllAsRead();
  }, [messages, markAllAsRead]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const unreadCount = messages.filter(m => m.sender === "client" && !m.read).length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight">Client Comms</h2>
          <p className="text-sm text-muted-foreground mt-1">End-to-end encrypted channel with active clients.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold animate-pulse">
              {unreadCount} New
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl border border-border/50 flex flex-col overflow-hidden relative shadow-elevated">
        <div className="absolute inset-0 bg-gradient-cyber opacity-[0.02] pointer-events-none" />

        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-border/40 bg-background-elevated/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary relative">
              <Shield className="w-5 h-5" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-background" />
            </div>
            <div>
              <h3 className="font-semibold">Active Session</h3>
              <p className="text-[10px] terminal-text text-muted-foreground uppercase tracking-widest">Client: CLI-1234</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar relative z-10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "omar" ? "justify-end" : "justify-start"} animate-slide-in`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.sender === "omar"
                  ? "bg-primary/15 text-foreground rounded-br-md border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                  : "bg-background-elevated/80 text-foreground rounded-bl-md border border-border/50"
              }`}>
                <p>{msg.text}</p>
                <div className={`flex items-center gap-2 mt-2 ${msg.sender === "omar" ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] terminal-text text-muted-foreground/60">{formatTime(msg.timestamp)}</span>
                  {msg.sender === "omar" && (
                     <CheckCircle2 className={`w-3 h-3 ${msg.read ? "text-primary" : "text-muted-foreground/40"}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/40 bg-background-elevated/30 shrink-0 relative z-10">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message client (CLI-1234)..."
              className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:shadow-glow-primary transition placeholder:text-muted-foreground/40"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="px-5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
