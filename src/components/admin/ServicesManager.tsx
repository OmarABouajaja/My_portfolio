import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { MultiLangInput } from "./MultiLangInput";

type Service = {
  id: string;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  icon: string;
  price_tier: string | null;
  display_order: number;
};

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await safeFetchAll<Service>("services", { order: "display_order", ascending: true });
    setServices(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { success, error } = await dbDelete("services", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setServices(services.filter(s => s.id !== id));
      toast.success("Service deleted");
    }
  };

  const handleSave = async () => {
    if (!editingService?.title_en?.trim()) {
      toast.error("Service title (EN) is required");
      return;
    }

    const payload = {
      ...editingService,
      icon: editingService.icon || "Layers",
      display_order: editingService.display_order ?? services.length,
    };

    if (editingService.id) {
      const result = await mutateWithToast<Service>(
        () => dbUpdate<Service>("services", editingService.id!, payload),
        "Service updated"
      );
      if (result) await loadServices();
    } else {
      const result = await mutateWithToast<Service>(
        () => dbInsert<Service>("services", payload),
        "Service created"
      );
      if (result) setServices([...services, result]);
    }

    setShowForm(false);
    setEditingService(null);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editingService?.id ? "Edit Service" : "New Service"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Service Title"
            initialValues={{
              en: editingService?.title_en || "",
              fr: editingService?.title_fr || "",
              es: editingService?.title_es || "",
              ar: editingService?.title_ar || ""
            }}
            onChange={(vals) => setEditingService(prev => ({
              ...prev,
              title_en: vals.en,
              title_fr: vals.fr,
              title_es: vals.es,
              title_ar: vals.ar
            }))}
          />
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Description"
            initialValues={{
              en: editingService?.description_en || "",
              fr: editingService?.description_fr || "",
              es: editingService?.description_es || "",
              ar: editingService?.description_ar || ""
            }}
            onChange={(vals) => setEditingService(prev => ({
              ...prev,
              description_en: vals.en,
              description_fr: vals.fr,
              description_es: vals.es,
              description_ar: vals.ar
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Icon (Lucide name)</label>
            <input 
              type="text" 
              value={editingService?.icon || ""}
              onChange={e => setEditingService(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="e.g. Cpu, Server, Terminal"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Price Tier</label>
            <input 
              type="text" 
              value={editingService?.price_tier || ""}
              onChange={e => setEditingService(prev => ({ ...prev, price_tier: e.target.value }))}
              placeholder="e.g. From $1,000"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Core Services</h3>
        <button 
          onClick={() => { setEditingService({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Service
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-elevated text-xs uppercase text-muted-foreground whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title (EN)</th>
                <th className="px-4 py-3 font-medium">Price Tier</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-background-elevated/30 transition">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{s.display_order}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{s.title_en}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{s.price_tier || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingService(s); setShowForm(true); }}
                        className="rounded p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No services configured.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
