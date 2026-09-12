import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { DEFAULT_NAV, NavItemDef } from "@/pages/Admin";

interface Props {
  slotIndex: number; // 0–3
  dockItemKeys: string[];
  setDockItemKeys: (keys: string[]) => void;
  onClose: () => void;
}

export const DockCustomizer = ({ slotIndex, dockItemKeys, setDockItemKeys, onClose }: Props) => {
  const [query, setQuery] = useState("");

  const filtered = DEFAULT_NAV.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((value: string) => {
    const newKeys = [...dockItemKeys];
    newKeys[slotIndex] = value;
    setDockItemKeys(newKeys);
    if (typeof navigator.vibrate === "function") navigator.vibrate(10);
    onClose();
  }, [dockItemKeys, slotIndex, setDockItemKeys, onClose]);

  const slotLabels = ["Slot 1", "Slot 2", "Slot 4", "Slot 5"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          className="relative w-full max-w-lg bg-background/95 backdrop-blur-3xl border-t border-border/30 rounded-t-3xl shadow-2xl z-10 flex flex-col max-h-[80vh]"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
        >
          {/* Handle */}
          <div className="pt-3 pb-4 px-5 border-b border-border/20 shrink-0">
            <div className="w-10 h-1.5 bg-muted rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base">Customize Dock</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Assigning <span className="text-primary font-semibold">{slotLabels[slotIndex]}</span> — tap to select
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:bg-background-elevated hover:text-foreground transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Search */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tabs…"
                className="w-full bg-background-elevated border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((item: NavItemDef) => {
                const Icon = item.icon;
                const isCurrent = dockItemKeys[slotIndex] === item.value;
                return (
                  <motion.button
                    key={item.value}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelect(item.value)}
                    className={`relative flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isCurrent
                        ? "bg-primary/15 border-primary/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]"
                        : "bg-background-elevated/50 border-border/50 hover:border-primary/30 hover:bg-background-elevated"
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isCurrent ? "bg-primary/20" : "bg-background-elevated"}`}>
                      <Icon className={`w-4 h-4 ${item.colorClass ?? "text-primary"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground terminal-text uppercase tracking-wider">{item.group}</p>
                    </div>
                    {isCurrent && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
