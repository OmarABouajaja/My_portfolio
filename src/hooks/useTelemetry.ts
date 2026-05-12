import { useState, useEffect } from 'react';

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  module: string;
  message: string;
  level: LogLevel;
}

// In-memory store for the session. In a real app, this might sync to a backend or IndexedDB.
let globalLogStore: TelemetryEvent[] = [];
let listeners: ((logs: TelemetryEvent[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener(globalLogStore));
};

export const logEvent = (module: string, message: string, level: LogLevel = 'info') => {
  const newEvent: TelemetryEvent = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    module,
    message,
    level,
  };
  
  // Keep only the latest 200 logs to prevent memory leaks
  globalLogStore = [newEvent, ...globalLogStore].slice(0, 200);
  notifyListeners();
};

export const clearTelemetry = () => {
  globalLogStore = [];
  notifyListeners();
};

export const useTelemetry = () => {
  const [logs, setLogs] = useState<TelemetryEvent[]>(globalLogStore);

  useEffect(() => {
    setLogs(globalLogStore);
    listeners.push(setLogs);
    return () => {
      listeners = listeners.filter((l) => l !== setLogs);
    };
  }, []);

  return { logs, logEvent, clearTelemetry };
};
