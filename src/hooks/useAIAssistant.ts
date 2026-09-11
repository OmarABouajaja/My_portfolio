import { useState, useCallback, useRef, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { VoiceLang } from "@/hooks/useVoiceCommands";
import { supabase } from "@/integrations/supabase/client";
import { PRESET_THEMES } from "@/hooks/useThemeEngine";

/* ================================================================
   useAIAssistant — Manages multi-chat sessions, calls Gemini,
   and provides an offline command fallback when the API key is missing.
   ================================================================ */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  topic: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// Local nav items list to avoid circular dependency with Admin.tsx
const NAV_ITEMS = [
  { value: "overview", label: "Dashboard" }, { value: "timeline", label: "Timeline" },
  { value: "projects", label: "Projects" }, { value: "services", label: "Services" },
  { value: "skills", label: "Stack" }, { value: "equipment", label: "Equipment" },
  { value: "certifications", label: "Certifications" }, { value: "iot", label: "IoT Fleet" },
  { value: "devices", label: "Devices" }, { value: "localdrop", label: "LocalDrop" },
  { value: "client_messages", label: "Client Comms" }, { value: "finance", label: "Finances" },
  { value: "invoices", label: "Invoices" }, { value: "resume", label: "Resume Pro" },
  { value: "contact", label: "Inbox" }, { value: "testimonials", label: "Feedback" },
  { value: "social_links", label: "Social Links" }, { value: "lifeos", label: "Life OS" },
  { value: "neuralflow", label: "Neural Flow" }, { value: "nexusboard", label: "Task Board" },
  { value: "blog", label: "Blog" }, { value: "vault", label: "Cmd Vault" },
  { value: "encrypted_vault", label: "Secret Vault" }, { value: "datanexus", label: "Data Hub" },
  { value: "storage", label: "DB & Storage" }, { value: "cloud_infra", label: "Cloud Infra" },
  { value: "telemetry", label: "Telemetry" }, { value: "settings", label: "Settings" },
];

const NAV_ITEMS_CONTEXT = NAV_ITEMS.map(n => `${n.label} (tab: "${n.value}")`).join(", ");
const THEME_NAMES = Object.keys(PRESET_THEMES).join(", ");

const SYSTEM_PROMPT = `You are NEXUS, an AI assistant embedded in Omar Abouajaja's personal portfolio Command Center — a premium "Industrial Cyber OS" admin dashboard.

You speak in the language the user writes to you. You support English, French, Spanish, and Tunisian Arabic (Derja).

Your capabilities:
- NAVIGATION: You can navigate the admin panel. Available tabs: ${NAV_ITEMS_CONTEXT}
- THEMES: You can switch themes. Available themes: ${THEME_NAMES}
- PORTFOLIO INFO: Omar is a Tunisian Full-Stack Developer, IoT & Robotics Innovator, and Freelancer. Website: omarabouajaja.site

When the user asks to navigate, respond with the action AND a natural confirmation. Include [NAV:tabValue] in your response.
When the user asks to switch a theme, include [THEME:themeName] in your response.

Keep responses concise (2-3 sentences max). Be helpful, tech-savvy, and match the cyber aesthetic.`;

// ---- Offline Command Engine ----

interface CommandResult {
  response: string;
  action?: { type: "nav"; value: string } | { type: "theme"; value: string };
}

const OFFLINE_COMMANDS: Record<string, { patterns: RegExp[]; handler: (match: RegExpMatchArray) => CommandResult }[]> = {
  nav: [
    {
      patterns: [
        /(?:go to|navigate to|open|show|switch to)\s+(.+)/i,
        /(?:aller à|ouvrir|naviguer vers)\s+(.+)/i,
        /(?:ir a|abrir|navegar a)\s+(.+)/i,
        /(?:امشي|روح|فتح)\s+(.+)/i,
      ],
      handler: (match) => {
        const target = match[1].toLowerCase().trim();
        const navItem = NAV_ITEMS.find(n =>
          n.label.toLowerCase().includes(target) ||
          n.value.toLowerCase().includes(target)
        );
        if (navItem) {
          return {
            response: `Navigating to ${navItem.label} ⚡`,
            action: { type: "nav", value: navItem.value },
          };
        }
        return { response: `I couldn't find a tab matching "${target}". Available tabs: Dashboard, Projects, Settings, Life OS, Task Board, and more.` };
      },
    },
  ],
  theme: [
    {
      patterns: [
        /(?:switch|change|set|apply)\s+(?:to\s+)?(.+?)\s*theme/i,
        /(?:thème|theme)\s+(.+)/i,
        /(?:tema)\s+(.+)/i,
      ],
      handler: (match) => {
        const target = match[1].toLowerCase().trim();
        const themeKey = Object.keys(PRESET_THEMES).find(k => k.toLowerCase().includes(target));
        if (themeKey) {
          return {
            response: `Switching to ${themeKey} theme 🎨`,
            action: { type: "theme", value: themeKey },
          };
        }
        return { response: `Theme "${target}" not found. Available: ${THEME_NAMES}` };
      },
    },
  ],
  greetings: [
    {
      patterns: [/^(hello|hi|hey|bonjour|salut|hola|سلام|عسلامة|اهلا)/i],
      handler: () => ({
        response: "Hey! 👋 I'm NEXUS, your command center AI. I can navigate tabs, switch themes, or chat about anything. What do you need?",
      }),
    },
  ],
  help: [
    {
      patterns: [/^(help|aide|ayuda|مساعدة|عاوني)/i],
      handler: () => ({
        response: "I can: 🧭 Navigate tabs (\"go to settings\"), 🎨 Switch themes (\"matrix theme\"), 💬 Answer questions. Try saying something!",
      }),
    },
  ],
};

function processOfflineCommand(input: string): CommandResult | null {
  for (const category of Object.values(OFFLINE_COMMANDS)) {
    for (const cmd of category) {
      for (const pattern of cmd.patterns) {
        const match = input.match(pattern);
        if (match) return cmd.handler(match);
      }
    }
  }
  return null;
}

// ---- Hook ----

export const useAIAssistant = () => {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>("bo3_ai_sessions", []);
  const [activeSessionId, setActiveSessionId] = useLocalStorage<string | null>("bo3_ai_active_session", null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useLocalStorage<VoiceLang>("bo3_ai_lang", "en-US");
  const [ttsEnabled, setTtsEnabled] = useLocalStorage<boolean>("bo3_ai_tts", true);
  const abortRef = useRef<AbortController | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession?.messages || [];

  // Ensure there's always at least one session
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    } else if (!activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions.length, activeSessionId]);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      topic: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, [setSessions, setActiveSessionId]);

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, [setActiveSessionId]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      } else {
        setActiveSessionId(null); // will trigger useEffect to create new
      }
    }
  }, [sessions, activeSessionId, setSessions, setActiveSessionId]);

  const addMessage = useCallback((role: ChatMessage["role"], content: string): ChatMessage => {
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role,
      content,
      timestamp: Date.now(),
    };
    
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        // Auto-generate topic based on first user message if it's "New Chat"
        let topic = session.topic;
        if (role === "user" && session.messages.length === 0) {
          topic = content.slice(0, 30) + (content.length > 30 ? "..." : "");
        }
        return {
          ...session,
          topic,
          messages: [...session.messages, msg],
          updatedAt: Date.now(),
        };
      }
      return session;
    }));
    
    return msg;
  }, [activeSessionId, setSessions]);

  const sendMessage = useCallback(async (
    userInput: string,
    onAction?: (action: { type: string; value: string }) => void
  ): Promise<string> => {
    if (!userInput.trim()) return "";
    if (!activeSessionId) return "";

    addMessage("user", userInput.trim());
    setIsLoading(true);

    const aiConfigString = localStorage.getItem("ai_provider_config");
    const aiConfig = aiConfigString ? JSON.parse(aiConfigString) : null;
    const hasAiConfig = aiConfig && aiConfig.apiKey && aiConfig.baseUrl && aiConfig.model;

    try {
      // 1. Try offline command engine ONLY if AI config is missing
      if (!hasAiConfig) {
        const offlineResult = processOfflineCommand(userInput.trim());
        if (offlineResult) {
          addMessage("assistant", offlineResult.response);
          if (offlineResult.action && onAction) {
            onAction(offlineResult.action);
          }
          setIsLoading(false);
          return offlineResult.response;
        }
      }

      // 2. Try Custom AI Provider API directly
      abortRef.current = new AbortController();
      
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      conversationHistory.push({
        role: "user",
        content: userInput.trim(),
      });

      let aiResponse = "";

      if (hasAiConfig) {
        // Direct API call
        const res = await fetch(
          aiConfig.baseUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${aiConfig.apiKey}`
            },
            signal: abortRef.current.signal,
            body: JSON.stringify({
              model: aiConfig.model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...conversationHistory
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          }
        );
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`AI API ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        aiResponse = data.choices?.[0]?.message?.content || "";
      } else {
        // Fallback: If no API key is configured, respond with an offline message
        aiResponse = "I'm NEXUS... I'm currently running in offline mode because no AI API key is configured in the settings panel. I can still execute local commands like [NAV:projects] or [THEME:matrix-green].";
      }

      if (!aiResponse) throw new Error("Empty response");
      
      // Parse actions from AI response
      const navMatch = aiResponse.match(/\[NAV:(\w+)\]/);
      const themeMatch = aiResponse.match(/\[THEME:([\w-]+)\]/);
      
      // Clean the response (remove action tags)
      const cleanResponse = aiResponse.replace(/\[NAV:\w+\]/g, "").replace(/\[THEME:[\w-]+\]/g, "").trim();
      
      addMessage("assistant", cleanResponse);

      if (navMatch && onAction) onAction({ type: "nav", value: navMatch[1] });
      if (themeMatch && onAction) onAction({ type: "theme", value: themeMatch[1] });

      setIsLoading(false);
      return cleanResponse;

    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      // Let the user know the API failed rather than silently falling back
      const errorMessage = `Connection Error: ${err.message}. Please check your API key in .env or your network connection.`;
      addMessage("assistant", errorMessage);
      setIsLoading(false);
      return errorMessage;
    }
  }, [messages, language, addMessage, activeSessionId]);

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    isLoading,
    language,
    setLanguage,
    ttsEnabled,
    setTtsEnabled,
    createNewSession,
    switchSession,
    deleteSession,
    sendMessage,
    cancelRequest,
    addMessage,
  };
};

// ---- Fallback response when Edge Function is unavailable ----

function getFallbackResponse(input: string, lang: VoiceLang): string {
  const lower = input.toLowerCase();

  // Navigation intent
  for (const nav of NAV_ITEMS) {
    if (lower.includes(nav.label.toLowerCase()) || lower.includes(nav.value.toLowerCase())) {
      return lang.startsWith("fr")
        ? `Essayez de dire "aller à ${nav.label}" pour naviguer. Je suis en mode hors-ligne pour l'instant.`
        : lang.startsWith("es")
        ? `Intenta decir "ir a ${nav.label}" para navegar. Estoy en modo offline por ahora.`
        : lang.startsWith("ar")
        ? `جرّب قول "امشي ${nav.label}" باش تنقل. أنا في وضع غير متصل توّا.`
        : `Try saying "go to ${nav.label}" to navigate. I'm in offline mode right now.`;
    }
  }

  // Generic fallback by language
  const fallbacks: Record<string, string> = {
    "en": "I'm NEXUS, your command center AI. I'm running in offline mode — the AI backend isn't connected yet. I can still navigate tabs and switch themes! Try \"go to dashboard\" or \"matrix theme\".",
    "fr": "Je suis NEXUS, votre assistant IA. Je suis en mode hors-ligne — le backend IA n'est pas encore connecté. Je peux quand même naviguer et changer de thème ! Essayez « aller à dashboard » ou « thème matrix ».",
    "es": "Soy NEXUS, tu asistente IA. Estoy en modo offline — el backend IA aún no está conectado. ¡Puedo navegar y cambiar temas! Prueba \"ir a dashboard\" o \"tema matrix\".",
    "ar": "أنا NEXUS، المساعد الذكي متاعك. توّا أنا في وضع غير متصل — الذكاء الاصطناعي ماهوش متصل بعد. نجّم نتنقّل بين التابات و نبدّل الثيم! جرّب \"امشي داشبورد\" ولّا \"ثيم ماتريكس\".",
  };

  const langKey = lang.split("-")[0];
  return fallbacks[langKey] || fallbacks["en"];
}
