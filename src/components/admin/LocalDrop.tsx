import { useState, useRef, useCallback, useEffect } from "react";
import {
  Share2, Upload, Download, Copy, CheckCircle2, Wifi, WifiOff,
  Zap, FileIcon, Trash2, ArrowRight, Loader2, KeyRound, Activity,
  HelpCircle, X
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/* ─── Types ─── */
type Role = "idle" | "sender" | "receiver";
type ConnectionState = "disconnected" | "connecting" | "connected";
type TransferEntry = {
  id: number;
  name: string;
  size: number;
  direction: "sent" | "received";
  timestamp: string;
};

const CHUNK_SIZE = 16384; // 16 KB

/* ─── Helpers ─── */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ─── Component ─── */
export const LocalDrop = () => {
  const [role, setRole] = useState<Role>("idle");
  const [connState, setConnState] = useState<ConnectionState>("disconnected");
  
  // Auto-signaling state
  const [pairingCode, setPairingCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const channelRef = useRef<any>(null);

  // File transfer state
  const [files, setFiles] = useState<File[]>([]);
  const [transferProgress, setTransferProgress] = useState<{ name: string; percent: number; speed: string } | null>(null);
  const [history, setHistory] = useLocalStorage<TransferEntry[]>("bo3_localdrop_history", []);

  // Receiving state
  const [incomingFile, setIncomingFile] = useState<{ name: string; size: number } | null>(null);
  const receivedChunksRef = useRef<ArrayBuffer[]>([]);
  const receivedSizeRef = useRef(0);

  // WebRTC refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showHelp, setShowHelp] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dcRef.current?.close();
      pcRef.current?.close();
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  /* ─── Create Peer Connection ─── */
  const createPC = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: [] }); // LAN only

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setConnState("connected");
        toast.success("Peer connected — ready to transfer");
      } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        setConnState("disconnected");
        toast.error("Connection lost");
      }
    };

    pcRef.current = pc;
    return pc;
  }, []);

  /* ─── Handle incoming data on receiver ─── */
  const setupDataChannelReceiver = useCallback((dc: RTCDataChannel) => {
    dcRef.current = dc;

    dc.onmessage = (e) => {
      if (typeof e.data === "string") {
        const msg = JSON.parse(e.data);
        if (msg.type === "file-meta") {
          setIncomingFile({ name: msg.name, size: msg.size });
          receivedChunksRef.current = [];
          receivedSizeRef.current = 0;
          setTransferProgress({ name: msg.name, percent: 0, speed: "0 KB/s" });
        } else if (msg.type === "file-complete") {
          const blob = new Blob(receivedChunksRef.current);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = msg.name;
          a.click();
          URL.revokeObjectURL(url);

          setHistory((prev) => [
            { id: Date.now(), name: msg.name, size: msg.size, direction: "received", timestamp: new Date().toLocaleString() },
            ...prev,
          ]);

          setTransferProgress(null);
          setIncomingFile(null);
          toast.success(`Received: ${msg.name}`);
        }
      } else {
        receivedChunksRef.current.push(e.data);
        receivedSizeRef.current += e.data.byteLength;
        if (incomingFile) {
          setTransferProgress((prev) => prev ? {
            ...prev,
            percent: Math.round((receivedSizeRef.current / (incomingFile?.size || 1)) * 100),
          } : null);
        }
      }
    };
  }, [incomingFile, setHistory]);

  /* ─── Auto-Signaling via Supabase Realtime ─── */
  
  // Sender: Start Hosting
  const startAsSender = async () => {
    setRole("sender");
    setConnState("connecting");
    const code = generateCode();
    setPairingCode(code);

    const pc = createPC();
    const dc = pc.createDataChannel("localdrop", { ordered: true });
    dcRef.current = dc;
    dc.onopen = () => setConnState("connected");

    const channel = supabase.channel(`localdrop-${code}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "receiver-joined" }, async () => {
        toast.info("Receiver joined. Negotiating connection...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        // Wait for ICE gathering
        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === "complete") resolve();
          else pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") resolve(); };
        });

        channel.send({ type: "broadcast", event: "sdp-offer", payload: { sdp: pc.localDescription } });
      })
      .on("broadcast", { event: "sdp-answer" }, async ({ payload }) => {
        await pc.setRemoteDescription(payload.sdp);
        toast.success("Connection established!");
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          toast.success("Ready. Waiting for receiver to enter code.");
        }
      });
  };

  // Receiver: Join Room
  const startAsReceiver = async () => {
    if (inputCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setRole("receiver");
    setConnState("connecting");

    const pc = createPC();
    pc.ondatachannel = (e) => setupDataChannelReceiver(e.channel);

    const channel = supabase.channel(`localdrop-${inputCode}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "sdp-offer" }, async ({ payload }) => {
        await pc.setRemoteDescription(payload.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Wait for ICE gathering
        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === "complete") resolve();
          else pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") resolve(); };
        });

        channel.send({ type: "broadcast", event: "sdp-answer", payload: { sdp: pc.localDescription } });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({ type: "broadcast", event: "receiver-joined" });
          toast.info("Joined room. Negotiating connection...");
        }
      });
  };


  /* ─── Send Files ─── */
  const sendFiles = async () => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open" || files.length === 0) {
      toast.error("No connection or no files selected");
      return;
    }

    for (const file of files) {
      dc.send(JSON.stringify({ type: "file-meta", name: file.name, size: file.size }));
      const buffer = await file.arrayBuffer();
      const totalChunks = Math.ceil(buffer.byteLength / CHUNK_SIZE);
      let sentBytes = 0;
      const startTime = performance.now();

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, buffer.byteLength);
        const chunk = buffer.slice(start, end);

        while (dc.bufferedAmount > 1024 * 1024) {
          await new Promise((r) => setTimeout(r, 50));
        }

        dc.send(chunk);
        sentBytes += chunk.byteLength;

        const elapsed = (performance.now() - startTime) / 1000;
        const speed = elapsed > 0 ? formatBytes(sentBytes / elapsed) + "/s" : "—";

        setTransferProgress({
          name: file.name,
          percent: Math.round((sentBytes / buffer.byteLength) * 100),
          speed,
        });
      }

      dc.send(JSON.stringify({ type: "file-complete", name: file.name, size: file.size }));

      setHistory((prev) => [
        { id: Date.now(), name: file.name, size: file.size, direction: "sent", timestamp: new Date().toLocaleString() },
        ...prev,
      ]);

      toast.success(`Sent: ${file.name}`);
    }

    setTransferProgress(null);
    setFiles([]);
  };

  /* ─── Drag and Drop ─── */
  const [isDragging, setIsDragging] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  /* ─── Disconnect ─── */
  const disconnect = () => {
    dcRef.current?.close();
    pcRef.current?.close();
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    pcRef.current = null;
    dcRef.current = null;
    channelRef.current = null;
    setRole("idle");
    setConnState("disconnected");
    setPairingCode("");
    setInputCode("");
    setFiles([]);
    setTransferProgress(null);
  };

  /* ─── Render ─── */
  return (
    <div className="space-y-6 relative">
      {/* Help Popover */}
      {showHelp && (
        <div className="absolute top-16 right-0 z-50 w-80 glass-panel rounded-xl p-4 shadow-2xl border border-primary/30 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-primary flex items-center gap-2"><HelpCircle className="w-4 h-4"/> How to use LocalDrop</h4>
            <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4"/></button>
          </div>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-4">
            <li>Click <strong>Send Files</strong> on Device A. A 6-digit code will appear.</li>
            <li>On Device B, click <strong>Receive Files</strong> and enter that 6-digit code.</li>
            <li>Supabase Realtime will auto-negotiate the WebRTC connection in the background.</li>
            <li>Once "Connected" appears, drag and drop files to securely transfer them peer-to-peer over your local network!</li>
          </ol>
        </div>
      )}

      {/* ── Status Bar ── */}
      <div className="glass-panel rounded-xl p-5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg transition-colors ${
            connState === "connected" ? "bg-success/20 text-success" :
            connState === "connecting" ? "bg-warning/20 text-warning animate-pulse" :
            "bg-muted text-muted-foreground"
          }`}>
            {connState === "connected" ? <Wifi className="w-6 h-6" /> :
             connState === "connecting" ? <Loader2 className="w-6 h-6 animate-spin" /> :
             <WifiOff className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-display font-bold">LocalDrop</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              {connState === "connected" ? "Peer Connected — Direct Wi-Fi Link Active" :
               connState === "connecting" ? "Establishing Peer Connection..." :
               "WebRTC P2P File Transfer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(!showHelp)} className="p-2 text-muted-foreground hover:text-primary transition rounded-full hover:bg-primary/10">
            <HelpCircle className="w-5 h-5" />
          </button>
          {connState !== "disconnected" && (
            <button
              onClick={disconnect}
              className="text-xs bg-destructive/20 text-destructive px-3 py-1.5 rounded-md hover:bg-destructive/30 transition"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* ── Role Selection (Idle State) ── */}
      {role === "idle" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={startAsSender}
            className="group glass-panel rounded-xl p-8 border border-primary/20 hover:border-primary/50 transition text-left flex flex-col items-center text-center"
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-1">Send Files</h4>
            <p className="text-sm text-muted-foreground">Generate a 6-digit code to host a secure transfer room</p>
          </button>

          <button
            onClick={() => { setRole("receiver"); setConnState("disconnected"); }}
            className="group glass-panel rounded-xl p-8 border border-secondary/20 hover:border-secondary/50 transition text-left flex flex-col items-center text-center"
          >
            <div className="p-4 bg-secondary/10 rounded-full mb-4 group-hover:bg-secondary/20 group-hover:scale-110 transition-all">
              <Download className="w-8 h-8 text-secondary" />
            </div>
            <h4 className="text-lg font-semibold mb-1">Receive Files</h4>
            <p className="text-sm text-muted-foreground">Enter a 6-digit code to join a transfer room</p>
          </button>
        </div>
      )}

      {/* ── Signaling Panel ── */}
      {role !== "idle" && connState !== "connected" && (
        <div className="flex justify-center">
          {role === "sender" ? (
            <div className="glass-panel rounded-xl p-8 border border-accent/20 text-center max-w-sm w-full">
              <KeyRound className="w-10 h-10 text-accent mx-auto mb-4" />
              <h4 className="font-semibold text-lg uppercase tracking-wider mb-2">Room Code</h4>
              <div className="bg-background-elevated rounded-lg p-4 mb-4 border border-border/50">
                <div className="text-4xl font-display font-bold tracking-[0.25em] text-accent">{pairingCode}</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter this 6-digit code on the receiving device to automatically pair via Supabase Realtime.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-8 border border-secondary/20 text-center max-w-sm w-full">
              <KeyRound className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-semibold text-lg uppercase tracking-wider mb-2">Enter Room Code</h4>
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-background-elevated border border-border rounded-lg p-4 text-center text-2xl font-display font-bold tracking-[0.2em] text-secondary focus:outline-none focus:border-secondary/50 transition mb-4"
                placeholder="000000"
              />
              <button
                onClick={startAsReceiver}
                disabled={inputCode.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-secondary/20 text-secondary py-3 rounded-lg hover:bg-secondary/30 transition font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" /> Join Room
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Connected: File Transfer Zone ── */}
      {connState === "connected" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drop Zone (Sender) */}
          {role === "sender" && (
            <div className="glass-panel rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" /> Files to Send
              </h4>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    : "border-border/50 hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                  }}
                />
                <Share2 className={`w-8 h-8 mb-2 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground">
                  {isDragging ? "Drop files here" : "Drag & drop files or click to browse"}
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background-elevated/50 border border-border/30">
                      <div className="flex items-center gap-3">
                        <FileIcon className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <div className="text-sm font-medium truncate max-w-[200px]">{file.name}</div>
                          <div className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, j) => j !== i))}
                        className="text-muted-foreground hover:text-destructive transition p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={sendFiles}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-success/20 text-success py-3 rounded-lg hover:bg-success/30 transition font-semibold text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Send {files.length} File{files.length > 1 ? "s" : ""}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transfer Progress */}
          <div className={`glass-panel rounded-xl p-6 border border-border ${role === "receiver" ? "lg:col-span-2" : ""}`}>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-warning" /> Transfer Monitor
            </h4>

            {transferProgress ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate max-w-[200px]">{transferProgress.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">{transferProgress.speed}</span>
                </div>
                <div className="h-3 bg-background-elevated rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-200"
                    style={{ width: `${transferProgress.percent}%` }}
                  />
                </div>
                <div className="text-center text-xs text-muted-foreground font-mono">{transferProgress.percent}%</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Activity className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">{role === "receiver" ? "Waiting for incoming files..." : "Select files and hit Send"}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Transfer History ── */}
      {history.length > 0 && (
        <div className="glass-panel rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <FileIcon className="w-4 h-4 text-muted-foreground" /> Transfer History
            </h4>
            <button
              onClick={() => setHistory([])}
              className="text-[10px] text-muted-foreground hover:text-destructive transition uppercase tracking-wider"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-background-elevated/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${entry.direction === "sent" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                    {entry.direction === "sent" ? <ArrowRight className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{entry.name}</div>
                    <div className="text-[10px] text-muted-foreground">{entry.timestamp} · {formatBytes(entry.size)}</div>
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${entry.direction === "sent" ? "text-primary" : "text-success"}`}>
                  {entry.direction}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
