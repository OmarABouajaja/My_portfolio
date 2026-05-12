import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Star, X, Save } from "lucide-react";
import { MultiLangInput } from "./MultiLangInput";

type Testimonial = {
  id: string;
  client_name: string;
  client_role: string;
  content_en: string; content_es: string | null; content_fr: string | null; content_ar: string | null;
  rating: number;
  featured: boolean;
  display_order: number;
};

export const TestimonialsManager = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await safeFetchAll<Testimonial>("testimonials", { order: "display_order", ascending: true });
    setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { success, error } = await dbDelete("testimonials", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setItems(items.filter(i => i.id !== id));
      toast.success("Testimonial deleted");
    }
  };

  const handleSave = async () => {
    if (!editingItem?.client_name?.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (!editingItem?.content_en?.trim()) {
      toast.error("Testimonial content (EN) is required");
      return;
    }

    const payload = {
      ...editingItem,
      client_role: editingItem.client_role || "",
      rating: editingItem.rating ?? 5,
      featured: editingItem.featured ?? true,
      display_order: editingItem.display_order ?? items.length,
    };

    if (editingItem.id) {
      const result = await mutateWithToast<Testimonial>(
        () => dbUpdate<Testimonial>("testimonials", editingItem.id!, payload),
        "Testimonial updated"
      );
      if (result) await loadItems();
    } else {
      const result = await mutateWithToast<Testimonial>(
        () => dbInsert<Testimonial>("testimonials", payload),
        "Testimonial created"
      );
      if (result) setItems([...items, result]);
    }

    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editingItem?.id ? "Edit Testimonial" : "New Testimonial"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Client Name</label>
            <input
              type="text"
              value={editingItem?.client_name || ""}
              onChange={(e) => setEditingItem(prev => ({ ...prev, client_name: e.target.value }))}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Client Role</label>
            <input
              type="text"
              value={editingItem?.client_role || ""}
              onChange={(e) => setEditingItem(prev => ({ ...prev, client_role: e.target.value }))}
              placeholder="e.g. CTO"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Testimonial Quote"
            initialValues={{
              en: editingItem?.content_en || "",
              fr: editingItem?.content_fr || "",
              es: editingItem?.content_es || "",
              ar: editingItem?.content_ar || ""
            }}
            onChange={(vals) => setEditingItem(prev => ({
              ...prev,
              content_en: vals.en,
              content_fr: vals.fr,
              content_es: vals.es,
              content_ar: vals.ar
            }))}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Rating (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={editingItem?.rating ?? 5}
              onChange={(e) => setEditingItem(prev => ({ ...prev, rating: Math.min(5, Math.max(1, Number(e.target.value))) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Order</label>
            <input
              type="number"
              value={editingItem?.display_order ?? 0}
              onChange={(e) => setEditingItem(prev => ({ ...prev, display_order: Number(e.target.value) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={editingItem?.featured ?? true}
                onChange={(e) => setEditingItem(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Testimonial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Testimonials</h3>
        <button 
          onClick={() => { setEditingItem({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Testimonial
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-background-elevated/30 transition">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.client_name}</div>
                  <div className="text-xs text-muted-foreground">{item.client_role}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex text-primary">
                    {Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-primary" />)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.featured ? <span className="text-success text-xs">Yes</span> : <span className="text-muted-foreground text-xs">No</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                    className="p-1.5 text-muted-foreground hover:text-primary transition mr-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
