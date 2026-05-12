import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { MultiLangInput } from "./MultiLangInput";

type TimelineEvent = {
  id: string;
  year: number;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  icon: string;
  highlight: boolean;
  display_order: number;
};

export const TimelineManager = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent> | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await safeFetchAll<TimelineEvent>("timeline_events", { order: "display_order", ascending: true });
    setEvents(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { success, error } = await dbDelete("timeline_events", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setEvents(events.filter(e => e.id !== id));
      toast.success("Event deleted");
    }
  };

  const handleSave = async () => {
    if (!editingEvent?.title_en?.trim()) {
      toast.error("Event title (EN) is required");
      return;
    }
    if (!editingEvent?.year) {
      toast.error("Year is required");
      return;
    }

    const payload = {
      ...editingEvent,
      icon: editingEvent.icon || "circle",
      highlight: editingEvent.highlight ?? false,
      display_order: editingEvent.display_order ?? events.length,
    };

    if (editingEvent.id) {
      const result = await mutateWithToast<TimelineEvent>(
        () => dbUpdate<TimelineEvent>("timeline_events", editingEvent.id!, payload),
        "Event updated"
      );
      if (result) await loadEvents();
    } else {
      const result = await mutateWithToast<TimelineEvent>(
        () => dbInsert<TimelineEvent>("timeline_events", payload),
        "Event created"
      );
      if (result) setEvents([...events, result]);
    }

    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editingEvent?.id ? "Edit Event" : "New Event"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Event Title"
            initialValues={{
              en: editingEvent?.title_en || "",
              fr: editingEvent?.title_fr || "",
              es: editingEvent?.title_es || "",
              ar: editingEvent?.title_ar || ""
            }}
            onChange={(vals) => setEditingEvent(prev => ({
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
              en: editingEvent?.description_en || "",
              fr: editingEvent?.description_fr || "",
              es: editingEvent?.description_es || "",
              ar: editingEvent?.description_ar || ""
            }}
            onChange={(vals) => setEditingEvent(prev => ({
              ...prev,
              description_en: vals.en,
              description_fr: vals.fr,
              description_es: vals.es,
              description_ar: vals.ar
            }))}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Year</label>
            <input
              type="number"
              value={editingEvent?.year ?? new Date().getFullYear()}
              onChange={(e) => setEditingEvent(prev => ({ ...prev, year: Number(e.target.value) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Icon</label>
            <input
              type="text"
              value={editingEvent?.icon || ""}
              onChange={(e) => setEditingEvent(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="e.g. cpu, award, or /path/to/icon.png"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Order</label>
            <input
              type="number"
              value={editingEvent?.display_order ?? 0}
              onChange={(e) => setEditingEvent(prev => ({ ...prev, display_order: Number(e.target.value) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={editingEvent?.highlight ?? false}
                onChange={(e) => setEditingEvent(prev => ({ ...prev, highlight: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium">Highlight</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Timeline Events</h3>
        <button 
          onClick={() => { setEditingEvent({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Event
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Title (EN)</th>
              <th className="px-4 py-3 font-medium">Icon</th>
              <th className="px-4 py-3 font-medium">Highlight</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-background-elevated/30 transition">
                <td className="px-4 py-3 font-mono text-primary">{e.year}</td>
                <td className="px-4 py-3 font-medium">{e.title_en}</td>
                <td className="px-4 py-3 font-mono text-xs">{e.icon}</td>
                <td className="px-4 py-3">
                  {e.highlight ? (
                    <span className="text-secondary text-xs">Yes</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => { setEditingEvent(e); setShowForm(true); }}
                    className="p-1.5 text-muted-foreground hover:text-primary transition mr-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(e.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No timeline events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
