import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { useNotifications } from "@/hooks/useNotifications";
import { Download, X, PackageCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ApkUpdateBanner = () => {
  const { notifications, markAsRead } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{ id: string, link: string | null } | null>(null);

  useEffect(() => {
    // Only run this logic if we are actually inside the native Android App or standalone PWA
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      Capacitor.isNativePlatform();
      
    if (!standalone) return;

    // Look for unread SYSTEM_UPDATE notifications
    const updateNotification = notifications.find(
      (n) => n.type === "SYSTEM_UPDATE" && !n.read_status
    );

    if (updateNotification) {
      setUpdateInfo({
        id: updateNotification.id,
        link: updateNotification.link,
      });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [notifications]);

  const handleUpdate = () => {
    if (updateInfo?.link) {
      window.open(updateInfo.link, "_blank");
    } else {
      // Fallback if no link provided
      window.open("https://github.com/Omar-ABouajaja/My_portfolio/releases", "_blank");
    }
    
    // Mark as read so we don't bother them again for this update
    if (updateInfo) {
      markAsRead(updateInfo.id);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    if (updateInfo) {
      markAsRead(updateInfo.id);
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-md border-b border-white/10 p-3 sm:p-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
              <PackageCheck className="h-5 w-5 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">App Update Available</h4>
              <p className="text-xs text-white/80 mt-0.5 truncate">
                A new version of the Android App is ready. Tap to install the latest features.
              </p>
            </div>
            
            <button
              onClick={handleUpdate}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-background shadow-lg transition hover:bg-white/90 touch-target"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Update Now</span>
              <span className="sm:hidden">Update</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="shrink-0 p-2 rounded-lg text-white/70 hover:bg-white/20 hover:text-white transition-colors touch-target"
              aria-label="Dismiss update"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
