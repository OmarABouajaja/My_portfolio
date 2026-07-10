import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, X, Save, ExternalLink, Eye, EyeOff } from "lucide-react";
import * as LucideIcons from "lucide-react";

type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  display_order: number;
  visible: boolean;
};

const ICON_OPTIONS = [
  "Mail", "Github", "Linkedin", "Twitter", "Instagram", "Youtube",
  "Globe", "Phone", "MessageCircle", "Send", "Link", "Facebook",
  "Twitch", "Codepen", "Figma", "Dribbble", "Rss",
];

export const SocialLinksManager = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);

  useEffect(() => { loadLinks(); }, []);

  const loadLinks = async () => {
    setLoading(true);
    const data = await safeFetchAll<SocialLink>("social_links", { order: "display_order", ascending: true });
    setLinks(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    const { success, error } = await dbDelete("social_links", id);
    if (error) { toast.error(`Failed: ${error}`); return; }
    if (success) { setLinks(links.filter(l => l.id !== id)); toast.success("Link deleted"); }
  };

  const handleSave = async () => {
    if (!editing?.platform?.trim() || !editing?.url?.trim()) {
      toast.error("Platform and URL are required");
      return;
    }

    const payload = {
      ...editing,
      icon: editing.icon || "Link",
      label: editing.label || editing.platform || "",
      display_order: editing.display_order ?? links.length,
      visible: editing.visible ?? true,
    };

    if (editing.id) {
      const result = await mutateWithToast<SocialLink>(
        () => dbUpdate<SocialLink>("social_links", editing.id!, payload),
        "Link updated"
      );
      if (result) await loadLinks();
    } else {
      const result = await mutateWithToast<SocialLink>(
        () => dbInsert<SocialLink>("social_links", payload),
        "Link created"
      );
      if (result) setLinks([...links, result]);
    }

    setShowForm(false);
    setEditing(null);
  };

  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Link;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editing?.id ? "Edit Link" : "Add Social Link"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Platform</label>
            <input
              type="text"
              value={editing?.platform || ""}
              onChange={(e) => setEditing(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="e.g. github, linkedin, twitter"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Display Label</label>
            <input
              type="text"
              value={editing?.label || ""}
              onChange={(e) => setEditing(prev => ({ ...prev, label: e.target.value }))}
              placeholder="@username or display text"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">URL</label>
            <input
              type="text"
              value={editing?.url || ""}
              onChange={(e) => setEditing(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://... or mailto:..."
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Icon</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ICON_OPTIONS.map((iconName) => {
                const isSelected = editing?.icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setEditing(prev => ({ ...prev, icon: iconName }))}
                    className={`p-2 rounded-md border transition-all ${isSelected ? "border-primary bg-primary/10 text-primary scale-110" : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                    title={iconName}
                  >
                    {renderIcon(iconName)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Order</label>
              <input
                type="number"
                value={editing?.display_order ?? 0}
                onChange={(e) => setEditing(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={editing?.visible ?? true}
                onChange={(e) => setEditing(prev => ({ ...prev, visible: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium">Visible on public site</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Social & Contact Links</h3>
        <button
          onClick={() => { setEditing({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Link
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Icon</th>
              <th className="px-4 py-3 font-medium">Platform</th>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Visible</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-background-elevated/30 transition">
                <td className="px-4 py-3 text-primary">{renderIcon(link.icon)}</td>
                <td className="px-4 py-3 font-medium capitalize">{link.platform}</td>
                <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{link.label}</td>
                <td className="px-4 py-3">
                  {link.visible ? (
                    <Eye className="h-4 w-4 text-success" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground hover:text-primary transition mr-1 inline-block">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button onClick={() => { setEditing(link); setShowForm(true); }} className="p-1.5 text-muted-foreground hover:text-primary transition mr-1">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No social links configured. Add your first channel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
