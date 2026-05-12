import { useState, useRef, useEffect, useCallback } from "react";
import {
  Smartphone, Monitor, Wifi, Play, Square, Maximize2, Minimize2,
  Volume2, VolumeX, Trash2, RefreshCw, ChevronDown, ChevronUp,
  Cpu, Radio, Eye, Loader2, Bell, BellRing, X, MessageSquare, Phone, Mail, Image,
  HelpCircle, Send, Zap, KeyRound, ArrowRight, Cast
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/* ─── Types ─── */
type DeviceNotification = {
  id: number;
  app: string;
  title: string;
  body: string;
  time: string;
  icon: "message" | "call" | "mail" | "photo" | "system";
  read: boolean;
};

type CastRole = "idle" | "caster" | "receiver";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ─── Component ─── */
export const DeviceMatrix = () => {
  // Notification Monitor
  const [notifications, setNotifications] = useLocalStorage<DeviceNotification[]>("bo3_device_notifs", []);

  // WebRTC State
  const [role, setRole] = useState<CastRole>("idle");
  const [pairingCode, setPairingCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [connState, setConnState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Listen to live notifications via Supabase Realtime
  useEffect(() => {
    const channel = supabase.channel('device-notifications')
      .on('broadcast', { event: 'new-notification' }, ({ payload }) => {
        setNotifications(prev => [{
          id: Date.now(),
          app: payload.app || 'System',
          title: payload.title || 'Notification',
          body: payload.body || '',
          time: 'Just now',
          icon: payload.icon || 'system',
          read: false
        }, ...prev]);
        toast.info(`New notification from ${payload.app || 'System'}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      cleanupWebRTC();
    };
  }, [setNotifications]);

  const testPushNotification = () => {
    const apps = ["WhatsApp", "Phone", "Gmail", "System"];
    const randomApp = apps[Math.floor(Math.random() * apps.length)];
    supabase.channel('device-notifications').send({
      type: 'broadcast',
      event: 'new-notification',
      payload: {
        app: randomApp,
        title: "Test Live Push",
        body: "This is a real-time broadcast message received over Supabase!",
        icon: randomApp === "WhatsApp" ? "message" : randomApp === "Phone" ? "call" : randomApp === "Gmail" ? "mail" : "system"
      }
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotifIcon = (icon: DeviceNotification["icon"]) => {
    switch (icon) {
      case "message": return <MessageSquare className="w-4 h-4" />;
      case "call": return <Phone className="w-4 h-4" />;
      case "mail": return <Mail className="w-4 h-4" />;
      case "photo": return <Image className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  /* ─── WebRTC Logic ─── */
  const cleanupWebRTC = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setRole("idle");
    setConnState("disconnected");
    setPairingCode("");
    setInputCode("");
    setIsFullscreen(false);
  };

  const createPC = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setConnState("connected");
        toast.success("Stream Connected!");
      } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        setConnState("disconnected");
        toast.error("Stream connection lost");
        cleanupWebRTC();
      }
    };
    return pc;
  }, []);

  // Caster (Phone)
  const startCasting = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Screen casting requires a secure HTTPS connection or localhost. Please deploy the site or use a secure tunnel.");
      }

      // Prompt user to share screen
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).catch(err => {
        if (err.name === 'NotAllowedError') throw new Error('Screen sharing permission denied.');
        throw new Error('Your mobile browser may not support direct screen casting. See Fast Control Setup below.');
      });
      
      localStreamRef.current = stream;
      
      setRole("caster");
      setConnState("connecting");
      const code = generateCode();
      setPairingCode(code);

      const pc = createPC();
      pcRef.current = pc;
      
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const channel = supabase.channel(`device-cast-${code}`);
      channelRef.current = channel;

      channel
        .on("broadcast", { event: "receiver-joined" }, async () => {
          toast.info("Receiver joined. Negotiating video stream...");
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          
          // Wait for ICE
          await new Promise<void>((resolve) => {
            if (pc.iceGatheringState === "complete") resolve();
            else pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") resolve(); };
          });

          channel.send({ type: "broadcast", event: "sdp-offer", payload: { sdp: pc.localDescription } });
        })
        .on("broadcast", { event: "sdp-answer" }, async ({ payload }) => {
          await pc.setRemoteDescription(payload.sdp);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            toast.success("Ready. Enter the code on your PC to view the stream.");
          }
        });
        
    } catch (err: any) {
      toast.error(err.message || "Failed to start casting");
      cleanupWebRTC();
    }
  };

  // Receiver (PC)
  const receiveCast = async () => {
    if (inputCode.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }

    setRole("receiver");
    setConnState("connecting");

    const pc = createPC();
    pcRef.current = pc;
    
    // When stream arrives, attach it to video element
    pc.ontrack = (event) => {
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    const channel = supabase.channel(`device-cast-${inputCode}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "sdp-offer" }, async ({ payload }) => {
        await pc.setRemoteDescription(payload.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Wait for ICE
        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === "complete") resolve();
          else pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") resolve(); };
        });

        channel.send({ type: "broadcast", event: "sdp-answer", payload: { sdp: pc.localDescription } });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({ type: "broadcast", event: "receiver-joined" });
          toast.info("Joined room. Waiting for video stream...");
        }
      });
  };

  const toggleFullscreen = () => {
    const el = document.getElementById("mirror-container");
    if (!el) return;
    if (!isFullscreen) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div className="space-y-6">
      {/* Help Popover */}
      {showHelp && (
        <div className="fixed top-24 right-8 z-50 w-80 glass-panel rounded-xl p-4 shadow-2xl border border-primary/30 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-primary flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Device Matrix Guide</h4>
            <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4"/></button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">The Device Matrix provides secure wireless device management:</p>
          <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
            <li><strong>Browser Casting:</strong> Cast your phone's screen directly from the mobile browser to the PC browser instantly via WebRTC. (View only).</li>
            <li><strong>Full ADB Control:</strong> See the "Fast Control Setup" section below to enable ultra-low latency mouse/keyboard control natively on your PC.</li>
            <li><strong>Notification Monitor:</strong> Powered by Supabase Realtime, letting you push live alerts to this dashboard securely from any script.</li>
          </ol>
        </div>
      )}

      <div className="flex justify-end mb-2">
        <button onClick={() => setShowHelp(!showHelp)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition bg-background-elevated px-3 py-1.5 rounded-full border border-border">
          <HelpCircle className="w-3 h-3" /> How to Use
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── WebRTC Viewport & Controls ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div
            id="mirror-container"
            className={`glass-panel rounded-xl border border-border overflow-hidden flex flex-col ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none bg-black" : "min-h-[450px]"
            }`}
          >
            {/* Viewport Header */}
            <div className="bg-background-elevated/80 border-b border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-accent" />
                <span className="font-semibold text-sm tracking-wider uppercase">
                  {role === "receiver" && connState === "connected" ? "Live Stream Receiver" : "Mirror Viewport"}
                </span>
                {connState === "connected" && (
                  <span className="ml-2 flex items-center gap-1 text-[9px] bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Live
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {role === "receiver" && connState === "connected" && (
                  <>
                    <button
                      onClick={() => { 
                        if (videoRef.current) {
                          videoRef.current.muted = !audioEnabled;
                          setAudioEnabled(!audioEnabled);
                          toast.info(audioEnabled ? "Audio muted" : "Audio enabled");
                        }
                      }}
                      className={`p-1.5 rounded-md transition ${audioEnabled ? "bg-accent/20 text-accent" : "bg-background text-muted-foreground"}`}
                      title="Toggle Audio"
                    >
                      {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-md bg-background-elevated text-muted-foreground hover:text-foreground transition"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </>
                )}
                {role !== "idle" && (
                  <button
                    onClick={cleanupWebRTC}
                    className="flex items-center gap-1 bg-destructive/20 text-destructive px-2.5 py-1.5 rounded-md hover:bg-destructive/30 transition text-xs font-medium"
                  >
                    <Square className="w-3 h-3" /> Stop
                  </button>
                )}
              </div>
            </div>

            {/* Viewport Content */}
            <div className="flex-1 bg-black/60 flex items-center justify-center relative">
              {role === "idle" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 w-full max-w-2xl">
                  <button
                    onClick={startCasting}
                    className="group glass-panel rounded-xl p-8 border border-primary/20 hover:border-primary/50 transition text-center flex flex-col items-center"
                  >
                    <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <Cast className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-1">Cast Screen</h4>
                    <p className="text-xs text-muted-foreground">Click here on your Phone to broadcast your screen securely over Wi-Fi.</p>
                  </button>
                  <div className="glass-panel rounded-xl p-8 border border-secondary/20 transition text-center flex flex-col items-center">
                    <div className="p-4 bg-secondary/10 rounded-full mb-4">
                      <Monitor className="w-8 h-8 text-secondary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-3">Receive Stream</h4>
                    <input
                      type="text"
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-background border border-border rounded-lg p-2 text-center text-xl font-display font-bold tracking-[0.2em] text-secondary focus:outline-none focus:border-secondary/50 transition mb-3"
                      placeholder="000000"
                    />
                    <button
                      onClick={receiveCast}
                      disabled={inputCode.length !== 6}
                      className="w-full flex items-center justify-center gap-2 bg-secondary/20 text-secondary py-2 rounded-lg hover:bg-secondary/30 transition font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      View Screen
                    </button>
                  </div>
                </div>
              ) : role === "caster" && connState !== "connected" ? (
                <div className="text-center">
                  <KeyRound className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                  <div className="text-4xl font-display font-bold tracking-[0.2em] text-primary mb-2">{pairingCode}</div>
                  <p className="text-sm text-muted-foreground">Enter this code on your PC to start the stream.</p>
                </div>
              ) : role === "caster" && connState === "connected" ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                    <span className="w-4 h-4 bg-success rounded-full animate-ping" />
                  </div>
                  <h3 className="text-lg font-bold text-success">Live Screen Broadcasting Active</h3>
                  <p className="text-sm text-muted-foreground mt-2">Your screen is currently being mirrored to the PC.</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={!audioEnabled}
                  className={`w-full h-full object-contain ${connState !== "connected" ? "hidden" : ""}`}
                />
              )}
              
              {role === "receiver" && connState === "connecting" && (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">Connecting to video stream...</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Fast Control Setup Fallback ── */}
          <div className="glass-panel rounded-xl p-6 border border-border">
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-warning" /> Need Full Touch Control? (Native Windows Setup)
              </h3>
              {showSetupGuide ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {showSetupGuide && (
              <div className="mt-4 space-y-4 animate-in fade-in">
                <p className="text-sm text-muted-foreground">
                  Because web browsers cannot magically click on your phone screen, the WebRTC viewer above is "View Only". If you want <strong>zero-latency mirroring with full mouse and keyboard control</strong>, use the native Windows tool <code>scrcpy</code>.
                </p>
                <div className="p-4 rounded-lg bg-background-elevated/50 border border-success/20">
                  <ol className="text-xs text-muted-foreground space-y-3 pl-4 list-decimal">
                    <li>
                      <strong>Install scrcpy (One time):</strong> Open PowerShell and run:
                      <div className="mt-1 bg-black/60 rounded p-2 border border-border/50"><code className="text-primary font-mono select-all">winget install Genymobile.scrcpy</code></div>
                      <em>(Close and reopen PowerShell after installing!)</em>
                    </li>
                    <li>
                      <strong>Pair Wirelessly (One time):</strong> Enable "Wireless Debugging" on your phone. Tap "Pair device with pairing code" to get the pairing port.
                      <div className="mt-1 bg-black/60 rounded p-2 border border-border/50"><code className="text-accent font-mono">adb pair [PHONE_IP]:[PAIRING_PORT]</code></div>
                    </li>
                    <li>
                      <strong>Connect:</strong> Look at the <em>main</em> Wireless Debugging screen to get the standard port, and connect:
                      <div className="mt-1 bg-black/60 rounded p-2 border border-border/50"><code className="text-success font-mono">adb connect [PHONE_IP]:[STANDARD_PORT]</code></div>
                    </li>
                    <li>
                      <strong>Launch:</strong> Run the tool with optimal Wi-Fi settings for zero lag!
                      <div className="mt-1 bg-black/60 rounded p-2 border border-border/50"><code className="text-warning font-mono select-all">scrcpy --video-bit-rate 2M --max-size 1024</code></div>
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Notification Monitor ── */}
        <div className="glass-panel rounded-xl p-6 border border-border h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
              {unreadCount > 0 ? <BellRing className="w-4 h-4 text-secondary animate-pulse" /> : <Bell className="w-4 h-4 text-muted-foreground" />}
              Notification Monitor
              {unreadCount > 0 && (
                <span className="ml-1 text-[9px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={testPushNotification}
                className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition uppercase tracking-wider font-bold"
                title="Broadcast a test notification via Supabase Realtime"
              >
                <Send className="w-3 h-3" /> Test Push
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-muted-foreground hover:text-primary transition uppercase tracking-wider"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setNotifications([])}
                className="text-[10px] text-muted-foreground hover:text-destructive transition uppercase tracking-wider"
              >
                Clear
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Bell className="w-10 h-10 opacity-20 mb-3" />
              <p className="text-sm">No notifications</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Notifications from connected devices will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`group flex items-start gap-3 p-3 rounded-lg border transition ${
                    notif.read
                      ? "bg-background-elevated/30 border-border/30 opacity-60 hover:opacity-100"
                      : "bg-secondary/5 border-secondary/20 shadow-[0_0_10px_rgba(200,0,200,0.05)]"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    notif.read ? "bg-muted text-muted-foreground" : "bg-secondary/15 text-secondary"
                  }`}>
                    {getNotifIcon(notif.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {notif.app}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
                    </div>
                    <div className="text-sm font-medium truncate">{notif.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{notif.body}</div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-[10px] text-muted-foreground text-center">
            <strong>Live Webhook Active:</strong> Listening to <code className="text-secondary">device-notifications</code> on Supabase Realtime. Send JSON payloads to this channel to trigger live alerts.
          </div>
        </div>
      </div>
    </div>
  );
};
