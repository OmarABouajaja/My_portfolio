import { useState, useEffect, useCallback, useRef } from "react";

/* ================================================================
   useVoiceCommands — Web Speech API hook with multilingual support,
   text-to-speech output, and continuous listening mode.
   ================================================================ */

export type VoiceLang = "en-US" | "fr-FR" | "es-ES" | "ar-TN";

export const VOICE_LANG_MAP: Record<string, VoiceLang> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ar: "ar-TN",
};

export const VOICE_LANG_LABELS: Record<VoiceLang, { flag: string; label: string }> = {
  "en-US": { flag: "🇬🇧", label: "English" },
  "fr-FR": { flag: "🇫🇷", label: "Français" },
  "es-ES": { flag: "🇪🇸", label: "Español" },
  "ar-TN": { flag: "🇹🇳", label: "تونسي" },
};

type VoiceCommand = {
  phrase: string;
  action: () => void;
};

interface UseVoiceCommandsOptions {
  lang?: VoiceLang;
  continuous?: boolean;
  onTranscript?: (text: string) => void;
}

export const useVoiceCommands = (
  commands: VoiceCommand[],
  options: UseVoiceCommandsOptions = {}
) => {
  const { lang = "en-US", continuous = false, onTranscript } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const langRef = useRef(lang);
  const commandsRef = useRef(commands);
  const onTranscriptRef = useRef(onTranscript);

  // Keep refs current
  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { commandsRef.current = commands; }, [commands]);
  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);

  // Update lang on running recognition
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = langRef.current;

    recognition.onresult = (event: any) => {
      const lastIdx = event.results.length - 1;
      const spoken = event.results[lastIdx][0].transcript.toLowerCase().trim();
      setTranscript(spoken);

      // Fire onTranscript callback (for AI assistant)
      if (onTranscriptRef.current) {
        onTranscriptRef.current(spoken);
      }

      // Match against registered commands
      for (const cmd of commandsRef.current) {
        if (spoken.includes(cmd.phrase.toLowerCase())) {
          cmd.action();
          break;
        }
      }
    };

    recognition.onerror = (e: any) => {
      // Don't stop for "no-speech" in continuous mode
      if (continuous && e.error === "no-speech") return;
      setIsListening(false);
    };

    recognition.onend = () => {
      // Restart if continuous mode is still active
      if (continuous && isListening) {
        try { recognition.start(); } catch { /* already started */ }
        return;
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuous]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.lang = langRef.current;
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript("");
      } catch {
        // Already started
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, supported, startListening, stopListening };
};

/* ================================================================
   speak() — Text-to-Speech utility using the Web Speech API.
   Automatically selects the best available voice for the language.
   ================================================================ */

export const speak = (text: string, lang: VoiceLang = "en-US"): Promise<void> => {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split("-")[0];
    const match = voices.find(v => v.lang === lang) ||
                  voices.find(v => v.lang.startsWith(langPrefix));
    if (match) utterance.voice = match;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
};
