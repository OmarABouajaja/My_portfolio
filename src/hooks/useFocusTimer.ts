import { useState, useEffect, useRef } from "react";

export const useFocusTimer = (initialMinutes = 25) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [brownNoiseEnabled, setBrownNoiseEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const startBrownNoise = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    if (noiseSourceRef.current) return; // Already playing

    const bufferSize = ctx.sampleRate * 5; // 5 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.1; // Low volume background rumble

    noiseSource.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start();
    noiseSourceRef.current = noiseSource;
  };

  const stopBrownNoise = () => {
    if (noiseSourceRef.current) {
      noiseSourceRef.current.stop();
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      if (brownNoiseEnabled) startBrownNoise();
    } else {
      stopBrownNoise();
      if (timeLeft === 0 && isActive) {
        setIsActive(false);
        // Play Audio Notification (Polyvalent real feature)
        try {
          const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.start();
          setTimeout(() => oscillator.stop(), 500); // Beep for 500ms
        } catch (e) {
          console.error("Audio API not supported or blocked");
        }
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, timeLeft, brownNoiseEnabled]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { 
    setIsActive(false); 
    setTimeLeft(initialMinutes * 60); 
    stopBrownNoise(); 
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  return {
    mins,
    secs,
    isActive,
    brownNoiseEnabled,
    setBrownNoiseEnabled,
    toggleTimer,
    resetTimer
  };
};
