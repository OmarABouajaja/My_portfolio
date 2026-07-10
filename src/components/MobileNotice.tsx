import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Mobile-friendly PWA install prompt — replaces the old "go to desktop" warning.
 * Only shows on mobile devices when the app is NOT already installed as a PWA.
 */
export const MobileNotice = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasBeenDismissed = sessionStorage.getItem("pwa_install_dismissed");
    // Don't show if already installed or already dismissed
    if (hasBeenDismissed || window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after a delay so it doesn't compete with boot sequence
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-3 right-3 z-50 rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-xl p-4 shadow-2xl sm:left-4 sm:right-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground">Install App</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Add to your home screen for the full native experience — offline access, faster load, no browser bar.
              </p>
              <button
                onClick={handleInstall}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-cyber px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-glow-primary transition hover:shadow-elevated touch-target"
              >
                <Download className="h-3.5 w-3.5" />
                Install Now
              </button>
            </div>
            <button
              onClick={dismiss}
              className="shrink-0 p-2 rounded-lg text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors touch-target"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
