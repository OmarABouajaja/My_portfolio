import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type Snapshot = {
  id: string;
  timestamp: number;
  data: Record<string, string | null>;
};

type TimeWarpContextType = {
  snapshots: Snapshot[];
  activeSnapshot: string | null; // ID of the snapshot we are currently viewing
  scrubToSnapshot: (id: string | null) => void;
  takeSnapshot: () => void;
};

const TimeWarpContext = createContext<TimeWarpContextType>({
  snapshots: [],
  activeSnapshot: null,
  scrubToSnapshot: () => {},
  takeSnapshot: () => {},
});

const TRACKED_KEYS = ["bo3_finance_tx", "bo3_finance_goal", "bo3_tasks"];
const MAX_SNAPSHOTS = 20;

export const TimeWarpProvider = ({ children }: { children: React.ReactNode }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [activeSnapshot, setActiveSnapshot] = useState<string | null>(null);

  // Load snapshots from local storage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('bo3_snapshots');
      if (stored) setSnapshots(JSON.parse(stored));
    } catch (e) {
      console.warn("Could not load snapshots", e);
    }
  }, []);

  const takeSnapshot = useCallback(() => {
    if (activeSnapshot) return; // Don't take snapshots while time-traveling

    const data: Record<string, string | null> = {};
    TRACKED_KEYS.forEach(key => {
      data[key] = window.localStorage.getItem(key);
    });

    const newSnapshot: Snapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      data
    };

    setSnapshots(prev => {
      // Don't save if state hasn't changed since last snapshot
      if (prev.length > 0) {
        const last = prev[0];
        const isIdentical = TRACKED_KEYS.every(key => last.data[key] === data[key]);
        if (isIdentical) return prev;
      }

      const next = [newSnapshot, ...prev].slice(0, MAX_SNAPSHOTS);
      try {
        window.localStorage.setItem('bo3_snapshots', JSON.stringify(next));
      } catch (e) {
        console.warn("Could not save snapshots", e);
      }
      return next;
    });
  }, [activeSnapshot]);

  // Debounced auto-snapshot when tracked keys change
  useEffect(() => {
    if (activeSnapshot) return;

    let timeout: NodeJS.Timeout;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && TRACKED_KEYS.includes(e.key)) {
        clearTimeout(timeout);
        timeout = setTimeout(takeSnapshot, 60000); // 1 minute debounce
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeout);
    };
  }, [activeSnapshot, takeSnapshot]);

  const scrubToSnapshot = (id: string | null) => {
    setActiveSnapshot(id);
    
    if (id === null) {
      // Restore present
      window.dispatchEvent(new Event('timewarp_reset'));
    } else {
      const snap = snapshots.find(s => s.id === id);
      if (snap) {
        // Dispatch custom event to notify hooks to use snapshot data
        window.dispatchEvent(new CustomEvent('timewarp_active', { detail: snap.data }));
      }
    }
  };

  return (
    <TimeWarpContext.Provider value={{ snapshots, activeSnapshot, scrubToSnapshot, takeSnapshot }}>
      {children}
    </TimeWarpContext.Provider>
  );
};

export const useTimeWarp = () => useContext(TimeWarpContext);
