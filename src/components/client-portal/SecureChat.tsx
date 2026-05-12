import { useState, useEffect, useRef } from "react";
import { MessageSquare, Paperclip, Send, ShieldCheck, User } from "lucide-react";
import { useClientChat } from "@/hooks/useClientChat";
import { toast } from "sonner";

const formatTime = (ts: number | string | undefined) => {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const SecureChat = () => {
  const { messages, sendMessage, markAllAsRead } = useClientChat("client");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    markAllAsRead();

    if (messages.length > prevMessagesLength.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "omar" && !lastMsg.read) {
        toast.message("New secure message", { description: lastMsg.text.substring(0, 50) + (lastMsg.text.length > 50 ? "..." : "") });
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, markAllAsRead]);

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col h-[calc(100vh-250px)] sm:h-[500px] lg:h-[600px] overflow-hidden">
      <div className="px-5 py-4 border-b border-border/40 flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Secure Channel</h3>
          <p className="text-[10px] text-muted-foreground terminal-text uppercase tracking-widest">End-to-End · Omar Abouajaja</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 text-[10px] text-success terminal-text uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Encrypted
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === "client" ? "justify-end" : "justify-start"} animate-slide-in`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === "client" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className="shrink-0 mt-auto">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-md ${msg.sender === "client" ? "bg-primary/20 border-primary/40 text-primary" : "bg-background-elevated border-border text-foreground"}`}>
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
                  {formatTime(msg.created_at)}
                  {msg.sender === "client" && msg.read && <span className="text-success text-[10px] leading-none">✓✓</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border/40 shrink-0">
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
