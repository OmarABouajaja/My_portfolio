import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Play, Square, Trash2, Settings2 } from "lucide-react";
import { toast } from "sonner";

export const WebSerialTerminal = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const [logs, setLogs] = useState<string>("");
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const terminalRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const connect = async () => {
    if (!("serial" in navigator)) {
      toast.error("Web Serial API not supported in this browser. Use Chrome/Edge desktop.");
      return;
    }

    try {
      // Prompt user to select an Arduino/ESP32 COM port
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate });
      portRef.current = port;
      setIsConnected(true);
      toast.success("Connected to hardware node");
      readLoop();
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to connect: " + e.message);
    }
  };

  const disconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
      }
      if (portRef.current) {
        await portRef.current.close();
      }
      setIsConnected(false);
      portRef.current = null;
      toast.info("Disconnected from hardware node");
    } catch (e: any) {
      console.error(e);
    }
  };

  const readLoop = async () => {
    if (!portRef.current) return;
    
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = portRef.current.readable.pipeTo(textDecoder.writable);
    readerRef.current = textDecoder.readable.getReader();

    try {
      while (true) {
        const { value, done } = await readerRef.current.read();
        if (done) {
          readerRef.current.releaseLock();
          break;
        }
        if (value) {
          setLogs((prev) => prev + value);
        }
      }
    } catch (error) {
      console.error("Read error", error);
    }
  };

  const clearLogs = () => setLogs("");

  return (
    <div className="glass-panel rounded-xl border border-border flex flex-col overflow-hidden h-[400px]">
      {/* Header bar */}
      <div className="bg-background-elevated/80 border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm tracking-wider uppercase">Live Serial Terminal</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <select 
              value={baudRate} 
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={isConnected}
              className="bg-background border border-border rounded px-2 py-1 text-xs outline-none focus:border-primary disabled:opacity-50"
            >
              <option value={9600}>9600</option>
              <option value={115200}>115200</option>
            </select>
          </div>

          {!isConnected ? (
            <button 
              onClick={connect}
              className="flex items-center gap-2 bg-success/20 text-success hover:bg-success/30 px-3 py-1.5 rounded-md text-xs font-medium transition"
            >
              <Play className="w-3 h-3" /> Connect
            </button>
          ) : (
            <button 
              onClick={disconnect}
              className="flex items-center gap-2 bg-destructive/20 text-destructive hover:bg-destructive/30 px-3 py-1.5 rounded-md text-xs font-medium transition"
            >
              <Square className="w-3 h-3" /> Disconnect
            </button>
          )}

          <button 
            onClick={clearLogs}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded transition"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <textarea
        ref={terminalRef}
        readOnly
        value={logs}
        placeholder={isConnected ? "Waiting for incoming serial data..." : "Click Connect and select a USB device to read live serial output from an ESP32 or Arduino."}
        className="flex-1 w-full bg-black/60 p-4 text-green-400 font-mono text-xs resize-none outline-none"
      />
    </div>
  );
};
