import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase } from "@/integrations/supabase/safeFetch";

interface ImageUploaderProps {
  bucket?: string;
  folder?: string;
  value: string | null;
  onChange: (url: string) => void;
  className?: string;
}

export const ImageUploader = ({ 
  bucket = "public_assets", 
  folder = "uploads", 
  value, 
  onChange, 
  className = "" 
}: ImageUploaderProps) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlPreviewError, setUrlPreviewError] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const resetInputLock = () => {
    if (hiddenInputRef.current) hiddenInputRef.current.value = "";
  };

  const transmitFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid format: File must be an image type.");
      resetInputLock();
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("Constraint violation: Image size must not exceed 5MB.");
      resetInputLock();
      return;
    }

    if (!hasSupabase) {
      const syntheticUrl = URL.createObjectURL(file);
      onChange(syntheticUrl);
      toast.info("Development Mode: Generated synthetic object URL.");
      resetInputLock();
      return;
    }

    setIsTransmitting(true);
    try {
      const rawExt = file.name.split(".").pop();
      const fileExt = rawExt && rawExt !== file.name ? rawExt : "bin";
      const cryptoName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from(bucket)
        .upload(cryptoName, file, { cacheControl: "3600", upsert: false });

      if (storageError) throw storageError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(cryptoName);
      onChange(data.publicUrl);
      toast.success("Asset transmission successful.");
    } catch (err: any) {
      toast.error(`Transmission failed: ${err.message}`);
    } finally {
      setIsTransmitting(false);
      resetInputLock();
    }
  }, [bucket, folder, onChange]);

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    
    try {
      new URL(trimmed);
    } catch {
      toast.error("Invalid URL format.");
      return;
    }

    onChange(trimmed);
    setUrlInput("");
    setUrlPreviewError(false);
    toast.success("Image URL applied.");
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length) {
      transmitFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      transmitFile(e.target.files[0]);
    }
  };

  const clearAsset = () => {
    onChange("");
    setUrlInput("");
    setUrlPreviewError(false);
    resetInputLock();
  };

  // Active preview state
  if (value) {
    return (
      <div className={`relative group rounded-xl border border-border overflow-hidden bg-background-elevated ${className}`}>
        <img src={value} alt="Preview of staged asset" className="w-full h-full object-cover max-h-[200px]" />
        
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => { clearAsset(); setMode("upload"); }}
            className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/40 transition-colors"
            aria-label="Replace asset"
          >
            <UploadCloud className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={clearAsset}
            className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/40 transition-colors"
            aria-label="Remove asset"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <input type="file" ref={hiddenInputRef} onChange={onFileSelect} accept="image/*" className="hidden" tabIndex={-1} />
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex p-0.5 rounded-lg bg-background-elevated/50 border border-border/30 w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
            mode === "upload" ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
            mode === "url" ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Paste URL
        </button>
      </div>

      {mode === "upload" ? (
        /* Drag-and-drop upload zone */
        <div
          onDragOver={onDragOver}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={onDrop}
          onClick={() => hiddenInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && hiddenInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center
            ${isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50 hover:bg-background-elevated"}
          `}
        >
          <input type="file" ref={hiddenInputRef} onChange={onFileSelect} accept="image/*" className="hidden" tabIndex={-1} />
          
          {isTransmitting ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          ) : (
            <ImageIcon className={`w-8 h-8 mb-3 ${isDragActive ? "text-primary animate-bounce" : "text-muted-foreground"}`} />
          )}
          
          <p className="text-sm font-medium text-foreground">
            {isTransmitting ? "Transmitting asset to core..." : "Drag & drop an asset, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest terminal-text">
            PNG, JPG, WebP — MAX 5MB
          </p>
        </div>
      ) : (
        /* URL paste mode */
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlPreviewError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              placeholder="https://example.com/image.png"
              className="flex-1 rounded-lg border border-border bg-background-elevated/60 px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/50"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-4 py-2.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          
          {/* Live URL preview */}
          {urlInput.trim() && !urlPreviewError && (
            <div className="rounded-lg border border-border/50 overflow-hidden bg-background-elevated h-32 flex items-center justify-center">
              <img
                src={urlInput.trim()}
                alt="URL preview"
                className="max-h-full max-w-full object-contain"
                onError={() => setUrlPreviewError(true)}
              />
            </div>
          )}
          {urlPreviewError && (
            <p className="text-xs text-destructive">Could not load preview — the URL may be invalid or blocked by CORS.</p>
          )}
        </div>
      )}
    </div>
  );
};
