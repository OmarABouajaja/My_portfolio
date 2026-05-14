import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send, CheckCircle2, Shield, Users, Clock, Search, Wifi } from "lucide-react";
import { useClientChat } from "@/hooks/useClientChat";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase } from "@/integrations/supabase/safeFetch";

// ── Types ──────────────────────────────────────────────────────────────────
interface ClientToken {
  id: string;
  token: string;
  client_name: string | null;
  created_at: string;
  is_active: boolean;
}

// ── Mock fallback when no Supabase ─────────────────────────────────────────
const MOCK_CLIENTS: ClientToken[] = [
  { id: "ct-1", token: "CLI-1234", client_name: "Demo Client", created_at: new Date().toISOString(), is_active: true },
];

// ── Typing Indicator ───────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-3 px-2">
    <div className="w-8 h-8 rounded-full bg-background-elevated border border-border flex items-center justify-center shrink-0">
      <Shield className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-background-elevated border border-border/50">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

// ── Chat thread for a selected client ─────────────────────────────────────
const ChatThread = ({ clientId, clientName }: { clientId: string; clientName: string }) => {
  const { messages, sendMessage, markAllAsRead } = useClientChat("omar", clientId);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTime = (ts: number | string | undefined) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    markAllAsRead();
  }, [messages, markAllAsRead]);

  // Simulate typing indicator when client sends a message
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.sender === "client") {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="px-5 py-4 border-b border-border/40 bg-background-elevated/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary relative">
            <Shield className="w-4 h-4" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-background" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{clientName}</h3>
            <p className="text-[10px] terminal-text text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
              Encrypted · {clientId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-success terminal-text uppercase tracking-widest">
          <Wifi className="w-3 h-3" />
          E2E
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-[11px] text-muted-foreground/60 terminal-text">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "omar" ? "justify-end" : "justify-start"} animate-slide-in`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.sender === "omar"
                  ? "bg-primary/15 text-foreground rounded-br-md border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                  : "bg-background-elevated/80 text-foreground rounded-bl-md border border-border/50"
              }`}>
                <p>{msg.text}</p>
                <div className={`flex items-center gap-2 mt-2 ${msg.sender === "omar" ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] terminal-text text-muted-foreground/60">{formatTime(msg.timestamp || msg.created_at)}</span>
                  {msg.sender === "omar" && (
                    <CheckCircle2 className={`w-3 h-3 ${msg.read ? "text-primary" : "text-muted-foreground/40"}`} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/40 bg-background-elevated/30 shrink-0">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${clientName}…`}
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
  );
};

// ── Main admin messages component ─────────────────────────────────────────
export const ClientMessages = () => {
  const [clients, setClients] = useState<ClientToken[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Use the admin-side chat for unread counts per client
  const { messages: allMessages } = useClientChat("omar", selectedId || "ct-1");

  const loadClients = useCallback(async () => {
    setLoadingClients(true);
    if (!hasSupabase) {
      setClients(MOCK_CLIENTS);
      setSelectedId(MOCK_CLIENTS[0]?.id || null);
      setLoadingClients(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("client_tokens")
        .select("id, token, client_name, created_at, is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setClients(data as ClientToken[]);
        if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
      }
    } catch {
      setClients(MOCK_CLIENTS);
      setSelectedId(MOCK_CLIENTS[0]?.id || null);
    }
    setLoadingClients(false);
  }, [selectedId]);

  useEffect(() => { loadClients(); }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.client_name || "").toLowerCase().includes(q) ||
      c.token.toLowerCase().includes(q)
    );
  });

  const selectedClient = clients.find((c) => c.id === selectedId);
  const unreadForClient = (id: string) =>
    allMessages.filter((m) => m.sender === "client" && !m.read).length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight">Client Comms</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {clients.length} active channel{clients.length !== 1 ? "s" : ""} · end-to-end encrypted
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] terminal-text uppercase tracking-widest text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Main layout: sidebar + chat */}
      <div className="flex-1 glass-panel rounded-xl border border-border/50 overflow-hidden shadow-elevated flex min-h-0">
        <div className="absolute inset-0 bg-gradient-cyber opacity-[0.02] pointer-events-none rounded-xl" />

        {/* Client list sidebar */}
        <div className="w-64 lg:w-72 border-r border-border/40 flex flex-col shrink-0 bg-background-elevated/20">
          <div className="p-3 border-b border-border/30 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search clients…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background/40 border border-border/40 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-primary/50 placeholder:text-muted-foreground/40 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {loadingClients ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg bg-background-elevated/50 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
                <Users className="w-5 h-5 opacity-40" />
                <p className="text-xs">No clients found</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filtered.map((client) => {
                  const unread = selectedId !== client.id ? unreadForClient(client.id) : 0;
                  const isSelected = selectedId === client.id;
                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedId(client.id)}
                      className={`w-full text-left rounded-lg px-3 py-2.5 transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-background-elevated/60 border border-transparent"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                          isSelected ? "bg-primary/20 border-primary/50 text-primary" : "bg-background-elevated border-border text-muted-foreground"
                        }`}>
                          {(client.client_name || client.token).charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {client.client_name || "Unknown Client"}
                        </p>
                        <p className="text-[10px] terminal-text text-muted-foreground/70 truncate">{client.token}</p>
                      </div>
                      {unread > 0 && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border/30 shrink-0">
            <p className="text-[9px] terminal-text uppercase tracking-widest text-muted-foreground/50 text-center">
              {clients.length} active token{clients.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {selectedClient ? (
            <ChatThread
              clientId={selectedClient.id}
              clientName={selectedClient.client_name || selectedClient.token}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Select a client</p>
                <p className="text-xs text-muted-foreground mt-1">Choose a client from the list to view their channel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
