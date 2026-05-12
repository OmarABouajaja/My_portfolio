import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);
  const [isWarped, setIsWarped] = useState(false); // Are we time-traveling?

  // Hijack for TimeWarp
  useEffect(() => {
    const handleWarp = (e: CustomEvent<Record<string, string | null>>) => {
      const snapshotData = e.detail;
      if (snapshotData && snapshotData[key] !== undefined) {
        setIsWarped(true);
        if (snapshotData[key] === null) {
          setStoredValue(initialValue);
        } else {
          setStoredValue(JSON.parse(snapshotData[key] as string));
        }
      }
    };

    const handleReset = () => {
      setIsWarped(false);
      setStoredValue(readValue());
    };

    window.addEventListener('timewarp_active', handleWarp as EventListener);
    window.addEventListener('timewarp_reset', handleReset);

    return () => {
      window.removeEventListener('timewarp_active', handleWarp as EventListener);
      window.removeEventListener('timewarp_reset', handleReset);
    };
  }, [key, initialValue, readValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    if (isWarped) {
      console.warn("Cannot mutate state while Time-Warp is active!");
      return;
    }
    
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Manually dispatch storage event so useTimeWarp catches it if in same window
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
