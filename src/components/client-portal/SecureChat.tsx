import { useState, useEffect, useRef } from "react";
import { MessageSquare, Paperclip, Send, ShieldCheck, User, Wifi } from "lucide-react";
import { useClientChat } from "@/hooks/useClientChat";
import { toast } from "sonner";

const formatTime = (ts: number | string | undefined) => {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ── Typing indicator ───────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-3 px-2">
    <div className="w-8 h-8 rounded-full bg-background-elevated border border-border flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-background-elevated border border-border/50">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
    </div>
    <span className="text-[10px] text-muted-foreground terminal-text">Omar is typing…</span>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
    <div className="relative">
      <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
        <ShieldCheck className="w-7 h-7 text-primary/40" />
      </div>
      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
      </span>
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">Secure Channel Ready</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        This is a private, end-to-end encrypted channel between you and Omar. Send your first message to get started.
      </p>
    </div>
    <div className="flex items-center gap-1.5 px-3 py-1 bg-background-elevated/40 border border-border/30 rounded-full terminal-text text-[9px] uppercase tracking-widest text-primary">
      <Lock className="w-3 h-3" /> Private Secure Channel
    </div>
  </div>
);

export const SecureChat = () => {
  const { messages, sendMessage, markAllAsRead } = useClientChat("client");
  const [draft, setDraft] = useState("");
  const [omarTyping, setOmarTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    markAllAsRead();

    // Show toast and simulate typing when new message arrives from Omar
    if (messages.length > prevLengthRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.sender === "omar" && !lastMsg.read) {
        toast.message("New secure message from Omar", {
          description: lastMsg.text.substring(0, 60) + (lastMsg.text.length > 60 ? "…" : ""),
        });
        setOmarTyping(false);
      }
    }
    prevLengthRef.current = messages.length;
  }, [messages, markAllAsRead]);

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
    inputRef.current?.focus();
    // Simulate Omar typing response after client sends (demo feel)
    setTimeout(() => setOmarTyping(true), 800);
    setTimeout(() => setOmarTyping(false), 3500);
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col h-[calc(100vh-250px)] sm:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3 shrink-0 bg-background-elevated/20">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Secure Channel</h3>
          <p className="text-[10px] text-muted-foreground terminal-text uppercase tracking-widest">End-to-End · Omar Abouajaja</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-success terminal-text uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Encrypted
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
        {messages.length === 0 && !omarTyping ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === "client" ? "justify-end" : "justify-start"} animate-slide-in`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.sender === "client" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className="shrink-0 mt-auto">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-md ${
                      msg.sender === "client"
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-background-elevated border-border text-foreground"
                    }`}>
                      {msg.sender === "client" ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Bubble */}
                  <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm relative backdrop-blur-sm ${
                    msg.sender === "client"
                      ? "bg-gradient-to-br from-primary/20 to-primary/5 text-foreground rounded-2xl rounded-br-sm border border-primary/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      : "bg-gradient-to-br from-background-elevated to-background text-foreground rounded-2xl rounded-bl-sm border border-border/50"
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`text-[9px] mt-1.5 terminal-text flex items-center gap-1.5 ${
                      msg.sender === "client" ? "justify-end text-primary/60" : "justify-start text-muted-foreground/60"
                    }`}>
                      {formatTime(msg.created_at || msg.timestamp)}
                      {msg.sender === "client" && msg.read && (
                        <span className="text-success text-[10px] leading-none">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {omarTyping && <TypingIndicator />}
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/40 shrink-0 bg-background-elevated/10">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a secure message…"
            className="flex-1 bg-background/50 border border-border/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition placeholder:text-muted-foreground/40"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow-primary"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
