import { Mic, MicOff } from "lucide-react";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { useThemeEngine, Theme } from "@/hooks/useThemeEngine";
import { toast } from "sonner";
import { useMemo } from "react";

interface VoiceMicProps {
  setActiveTab?: (tab: string) => void;
}

export const VoiceMic = ({ setActiveTab }: VoiceMicProps) => {
  const { applyTheme } = useThemeEngine();

  const commands = useMemo(() => [
    {
      phrase: "matrix theme",
      action: () => {
        applyTheme("matrix-green");
        toast.success("🟢 Matrix Green Theme Activated");
      },
    },
    {
      phrase: "cyan theme",
      action: () => {
        applyTheme("neon-cyan");
        toast.success("🔵 Neon Cyan Theme Activated");
      },
    },
    {
      phrase: "red theme",
      action: () => {
        applyTheme("cyber-red");
        toast.success("🔴 Cyber Red Theme Activated");
      },
    },
    {
      phrase: "neural flow",
      action: () => {
        setActiveTab?.("neuralflow");
        toast.success("🧠 Navigating to Neural Flow");
      },
    },
    {
      phrase: "task board",
      action: () => {
        setActiveTab?.("nexusboard");
        toast.success("🗺️ Navigating to Task Board");
      },
    },
    {
      phrase: "secret vault",
      action: () => {
        setActiveTab?.("encrypted_vault");
        toast.success("🔐 Navigating to Secret Vault");
      },
    },
    {
      phrase: "dashboard",
      action: () => {
        setActiveTab?.("overview");
        toast.success("📊 Navigating to Dashboard");
      },
    },
    {
      phrase: "finances",
      action: () => {
        setActiveTab?.("finance");
        toast.success("💰 Navigating to Finances");
      },
    },
  ], [applyTheme, setActiveTab]);

  const { isListening, transcript, supported, startListening, stopListening } = useVoiceCommands(commands);

  if (!supported) return null;

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`
          relative p-2.5 rounded-full border transition-all duration-300
          ${isListening
            ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse"
            : "border-border bg-background-elevated/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-glow-primary"
          }
        `}
        title={isListening ? "Listening..." : "Voice Command (click to speak)"}
      >
        {isListening ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
        
        {/* Pulsing ring when listening */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
            <span className="absolute -inset-1 rounded-full border border-primary/20 animate-pulse" />
          </>
        )}
      </button>

      {/* Transcript tooltip */}
      {isListening && transcript && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background-elevated border border-border rounded-md px-3 py-1.5 text-[10px] terminal-text text-primary shadow-lg z-50">
          "{transcript}"
        </div>
      )}
    </div>
  );
};
