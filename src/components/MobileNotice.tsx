import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const detectMobileEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const MobileNotice = () => {
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);

  useEffect(() => {
    const isMobile = detectMobileEnvironment();
    const hasBeenDismissed = sessionStorage.getItem("mobile_notice_dismissed");

    if (isMobile && !hasBeenDismissed) {
      const renderTimeout = setTimeout(() => setIsNoticeVisible(true), 3000);
      return () => clearTimeout(renderTimeout);
    }
  }, []);

  const dismissNotice = () => {
    setIsNoticeVisible(false);
    sessionStorage.setItem("mobile_notice_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isNoticeVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-warning/30 bg-background/95 backdrop-blur-xl p-4 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Hardware Constraints Detected</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                To experience the full WebGL rendering capabilities and prevent memory exhaustion, it is highly recommended to view this application on a desktop environment.
              </p>
            </div>
            <button
              onClick={dismissNotice}
              className="shrink-0 p-1 rounded-md text-muted-foreground hover:bg-warning/10 hover:text-warning transition-colors"
              aria-label="Dismiss hardware constraint notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
