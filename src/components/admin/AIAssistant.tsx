import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, X, Send, Mic, MicOff, Volume2, VolumeX,
  Trash2, Sparkles, ChevronDown, Zap, Compass,
  Palette, HelpCircle, Languages, MessageSquarePlus,
  MessageSquare, Menu
} from "lucide-react";
import { useAIAssistant, ChatMessage, ChatSession } from "@/hooks/useAIAssistant";
import { useVoiceCommands, speak, VoiceLang, VOICE_LANG_LABELS } from "@/hooks/useVoiceCommands";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { toast } from "sonner";

interface AIAssistantProps {
  setActiveTab: (tab: string) => void;
}

// ---- Quick Action Chips ----
const QUICK_ACTIONS = [
  { icon: Compass, label: "Navigate", prompt: "What tabs are available?" },
  { icon: Palette, label: "Themes", prompt: "What themes can I use?" },
  { icon: HelpCircle, label: "Help", prompt: "help" },
  { icon: Zap, label: "Dashboard", prompt: "go to dashboard" },
];

// ---- Waveform Visualizer ----
const VoiceWaveform = () => (
  <div className="flex items-center gap-[3px] h-5">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] bg-primary rounded-full"
        animate={{
          height: [8, 20, 12, 18, 8],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// ---- Typing Indicator ----
const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3">
    <div className="flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary/60"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
    <span className="text-[10px] terminal-text text-primary/60 uppercase tracking-widest">NEXUS processing...</span>
  </div>
);

// ---- Message Bubble ----
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary/20 text-foreground border border-primary/30 rounded-br-sm"
            : "bg-background-elevated/80 text-foreground border border-border/30 rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] terminal-text text-primary uppercase tracking-widest">NEXUS</span>
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span className="block text-[9px] text-muted-foreground/50 mt-1 text-right font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
};

// ---- Main Component ----
export const AIAssistant = ({ setActiveTab }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [input, setInput] = useState("");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    sessions, activeSessionId, activeSession, messages, isLoading, language, setLanguage,
    ttsEnabled, setTtsEnabled, createNewSession, switchSession, deleteSession, sendMessage,
  } = useAIAssistant();

  const { applyTheme } = useThemeEngine();

  // Action handler — executes nav/theme actions from AI responses
  const handleAction = useCallback((action: { type: string; value: string }) => {
    if (action.type === "nav") {
      setActiveTab(action.value);
      toast.success(`⚡ Navigated to ${action.value}`);
    } else if (action.type === "theme") {
      applyTheme(action.value);
      toast.success(`🎨 Theme switched to ${action.value}`);
    }
  }, [setActiveTab, applyTheme]);

  // Voice commands for quick nav
  const voiceCommands = useMemo(() => [], []);

  const onVoiceTranscript = useCallback((text: string) => {
    setInput(text);
    handleSend(text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isListening, supported: voiceSupported, startListening, stopListening } =
    useVoiceCommands(voiceCommands, {
      lang: language,
      onTranscript: onVoiceTranscript,
    });

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !showSidebar && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, showSidebar]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");

    const response = await sendMessage(msg, handleAction);

    // TTS: speak the AI response
    if (ttsEnabled && response) {
      speak(response, language);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ═══ FLOATING ACTION BUTTON ═══ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-background flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:shadow-[0_0_50px_rgba(var(--primary),0.7)] transition-shadow"
            title="Open AI Assistant"
          >
            <Bot className="w-6 h-6" />
            <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ CHAT PANEL ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-[100] w-[400px] max-w-[calc(100vw-32px)] h-[650px] max-h-[calc(100vh-100px)] rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.6),0_0_30px_rgba(var(--primary),0.15)] flex overflow-hidden"
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
              style={{
                backgroundImage: `linear-gradient(rgba(var(--primary), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary), 0.5) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* ── Sidebar (History) ── */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative z-20 h-full border-r border-border/40 bg-background-elevated/80 flex flex-col shrink-0"
                >
                  <div className="p-3 border-b border-border/40">
                    <button
                      onClick={() => {
                        createNewSession();
                        setShowSidebar(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors border border-primary/30"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      <span className="text-sm font-medium">New Chat</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 hide-scrollbar">
                    {sessions.map(session => (
                      <div
                        key={session.id}
                        className={`group flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                          session.id === activeSessionId
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-background-elevated border border-transparent"
                        }`}
                        onClick={() => {
                          switchSession(session.id);
                          setShowSidebar(false);
                        }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                          <span className="text-xs truncate text-foreground">{session.topic}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Main Chat Area ── */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background-elevated/40 shrink-0">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-1.5 -ml-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background-elevated transition-colors"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-background" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="terminal-text text-xs uppercase tracking-widest text-primary">NEXUS</h3>
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider truncate w-24 sm:w-32">
                      {activeSession?.topic || "Online"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowLangPicker(!showLangPicker)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background-elevated transition-colors"
                  >
                    <Languages className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTtsEnabled(!ttsEnabled)}
                    className={`p-1.5 rounded-lg transition-colors ${ttsEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-background-elevated"}`}
                  >
                    {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background-elevated transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Language Picker Dropdown */}
              <AnimatePresence>
                {showLangPicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border/30 bg-background-elevated/30 overflow-hidden shrink-0"
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-2.5">
                      {(Object.entries(VOICE_LANG_LABELS) as [VoiceLang, { flag: string; label: string }][]).map(([code, { flag, label }]) => (
                        <button
                          key={code}
                          onClick={() => { setLanguage(code); setShowLangPicker(false); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            language === code
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-background-elevated border border-transparent"
                          }`}
                        >
                          <span className="text-base">{flag}</span>
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1 hide-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center"
                    >
                      <Bot className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="terminal-text text-sm text-primary uppercase tracking-widest mb-1">NEXUS Ready</h4>
                      <p className="text-xs text-muted-foreground/70 max-w-[240px]">
                        Start a new conversation. Try commands like navigation or theme changing.
                      </p>
                    </div>
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 w-full max-w-[280px] mt-2">
                      {QUICK_ACTIONS.map((qa) => (
                        <button
                          key={qa.label}
                          onClick={() => handleSend(qa.prompt)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 bg-background-elevated/30 text-xs text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95"
                        >
                          <qa.icon className="w-3.5 h-3.5" />
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-border/40 bg-background-elevated/30 px-3 py-3 shrink-0">
                <div className="flex items-center gap-2">
                  {voiceSupported && (
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isListening
                          ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                          : "bg-background-elevated/60 text-muted-foreground border border-border/30 hover:text-primary hover:border-primary/30"
                      }`}
                    >
                      {isListening ? <VoiceWaveform /> : <Mic className="w-4 h-4" />}
                      {isListening && (
                        <span className="absolute inset-0 rounded-xl border border-primary/30 animate-ping opacity-30" />
                      )}
                    </button>
                  )}

                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isListening
                          ? "Listening..."
                          : language.startsWith("fr") ? "Tapez un message..."
                          : language.startsWith("es") ? "Escribe un mensaje..."
                          : language.startsWith("ar") ? "اكتب رسالة..."
                          : "Type a message..."
                      }
                      className="w-full bg-background/80 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(var(--primary),0.1)] transition-all"
                      dir={language.startsWith("ar") ? "rtl" : "ltr"}
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="shrink-0 w-10 h-10 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center hover:bg-primary/30 hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
