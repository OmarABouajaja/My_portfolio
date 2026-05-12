import { useEffect, useState } from 'react';
import { useTimeWarp } from '@/hooks/useTimeWarp';
import { Rewind, Save, AlertCircle } from 'lucide-react';

export const TimeWarpScrubber = () => {
  const { snapshots, activeSnapshot, scrubToSnapshot, takeSnapshot } = useTimeWarp();
  const [sliderIndex, setSliderIndex] = useState(0);

  // Auto-take a snapshot on mount if none exist
  useEffect(() => {
    if (snapshots.length === 0) {
      takeSnapshot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update slider index when snapshots change (assuming present is index 0)
  useEffect(() => {
    if (!activeSnapshot) {
      setSliderIndex(0);
    }
  }, [snapshots.length, activeSnapshot]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderIndex(val);

    if (val === 0) {
      // Back to present
      scrubToSnapshot(null);
      document.documentElement.classList.remove('timewarp-active');
    } else {
      // Time traveling
      const snap = snapshots[val];
      if (snap) {
        scrubToSnapshot(snap.id);
        document.documentElement.classList.add('timewarp-active');
      }
    }
  };

  if (snapshots.length <= 1 && !activeSnapshot) return null;

  const max = Math.max(0, snapshots.length - 1);
  const currentSnap = activeSnapshot ? snapshots.find(s => s.id === activeSnapshot) : snapshots[0];

  return (
    <div className={`fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md transition-all duration-500 ${activeSnapshot ? 'opacity-100 scale-100' : 'opacity-30 hover:opacity-100 scale-95 hover:scale-100'}`}>
      <div className={`glass-panel p-4 rounded-xl border flex flex-col gap-3 ${activeSnapshot ? 'border-warning/50 bg-warning/10 shadow-glow-warning' : 'border-border/50 bg-background/50'}`}>
        
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Rewind className={`w-4 h-4 ${activeSnapshot ? 'text-warning animate-pulse' : 'text-muted-foreground'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeSnapshot ? 'text-warning' : 'text-muted-foreground'}`}>
              {activeSnapshot ? 'Time-Warp Active' : 'OS Timeline'}
            </span>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground tabular-nums">
            {currentSnap ? new Date(currentSnap.timestamp).toLocaleString() : 'Present'}
          </div>
        </div>

        <input 
          type="range" 
          min="0" 
          max={max}
          step="1"
          value={sliderIndex}
          onChange={handleScrub}
          className="w-full h-2 bg-background-elevated rounded-full appearance-none cursor-pointer accent-warning [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-warning [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
        />

        {activeSnapshot && (
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5 text-warning text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Read-only memory state</span>
            </div>
            <button 
              onClick={() => { setSliderIndex(0); scrubToSnapshot(null); document.documentElement.classList.remove('timewarp-active'); }}
              className="text-xs bg-warning/20 text-warning px-2 py-1 rounded hover:bg-warning/30 transition"
            >
              Return to Present
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
