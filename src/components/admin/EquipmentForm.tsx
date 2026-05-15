import { X, Save } from "lucide-react";
import { MultiLangInput } from "./MultiLangInput";
import { ImageUploader } from "@/components/ui/ImageUploader";

export type HardwareNode = {
  id: string;
  name: string;
  category: "hardware" | "software" | "iot" | "audio";
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
} & Record<string, unknown>;

interface EquipmentFormProps {
  draftNode: Partial<HardwareNode>;
  onChange: (node: Partial<HardwareNode> | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EquipmentForm = ({ draftNode, onChange, onSave, onCancel }: EquipmentFormProps) => {
  return (
    <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
          {draftNode?.id ? "Reconfigure Node" : "Register Node"}
        </h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Node Designation</label>
          <input 
            type="text" 
            value={draftNode?.name || ""}
            onChange={e => onChange({ ...draftNode, name: e.target.value })}
            placeholder="e.g. MacBook Pro M3 Max"
            className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Classification</label>
          <select 
            value={draftNode?.category || "hardware"}
            onChange={e => onChange({ ...draftNode, category: e.target.value as any })}
            className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
          >
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="iot">IoT / Edge</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <MultiLangInput 
          label="Technical Specs (Description)"
          initialValues={{
            en: draftNode?.description_en || "",
            fr: draftNode?.description_fr || "",
            es: draftNode?.description_es || "",
            ar: draftNode?.description_ar || ""
          }}
          onChange={(vals) => onChange({
            ...draftNode,
            description_en: vals.en,
            description_fr: vals.fr,
            description_es: vals.es,
            description_ar: vals.ar
          })}
        />
      </div>

      <div className="pt-2">
        <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Vendor Link (Optional)</label>
        <input 
          type="url" 
          value={draftNode?.link_url || ""}
          onChange={e => onChange({ ...draftNode, link_url: e.target.value })}
          placeholder="https://..."
          className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
        />
      </div>

      <div className="pt-2">
        <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Visual Asset</label>
        <ImageUploader 
          bucket="equipment-images"
          value={draftNode?.image_url || null}
          onChange={(url) => onChange({ ...draftNode, image_url: url })}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Abort
        </button>
        <button onClick={onSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary hover:scale-[1.02] transition-transform">
          <Save className="w-4 h-4" /> Save Node
        </button>
      </div>
    </div>
  );
};
