import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
  display_order: number;
};

export const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    const data = await safeFetchAll<Skill>("skills", { order: "display_order", ascending: true });
    setSkills(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    const { success, error } = await dbDelete("skills", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setSkills(skills.filter(s => s.id !== id));
      toast.success("Skill deleted");
    }
  };

  const handleSave = async () => {
    if (!editingSkill?.name?.trim()) {
      toast.error("Skill name is required");
      return;
    }

    const payload = {
      ...editingSkill,
      category: editingSkill.category || "frontend",
      icon: editingSkill.icon || "code",
      proficiency: editingSkill.proficiency ?? 50,
      display_order: editingSkill.display_order ?? skills.length,
    };

    if (editingSkill.id) {
      const result = await mutateWithToast<Skill>(
        () => dbUpdate<Skill>("skills", editingSkill.id!, payload),
        "Skill updated"
      );
      if (result) await loadSkills();
    } else {
      const result = await mutateWithToast<Skill>(
        () => dbInsert<Skill>("skills", payload),
        "Skill created"
      );
      if (result) setSkills([...skills, result]);
    }

    setShowForm(false);
    setEditingSkill(null);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editingSkill?.id ? "Edit Skill" : "New Skill"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Name</label>
            <input
              type="text"
              value={editingSkill?.name || ""}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. React"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Category</label>
            <select
              value={editingSkill?.category || "frontend"}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="iot">IoT</option>
              <option value="devops">DevOps</option>
              <option value="design">Design</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Icon (Lucide name)</label>
            <input
              type="text"
              value={editingSkill?.icon || ""}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="e.g. code, server, cpu"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Proficiency (0-100)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={editingSkill?.proficiency ?? 50}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, proficiency: Math.min(100, Math.max(0, Number(e.target.value))) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Display Order</label>
            <input
              type="number"
              value={editingSkill?.display_order ?? 0}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, display_order: Number(e.target.value) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
        </div>

        {/* Proficiency Bar Preview */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Preview</label>
          <div className="h-3 bg-background-elevated rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
              style={{ width: `${editingSkill?.proficiency ?? 50}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Skill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Tech Stack</h3>
        <button 
          onClick={() => { setEditingSkill({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Skill
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Proficiency</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {skills.map((s) => (
              <tr key={s.id} className="hover:bg-background-elevated/30 transition">
                <td className="px-4 py-3 font-mono text-muted-foreground">{s.display_order}</td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] text-secondary capitalize">
                    {s.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-background-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.proficiency}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{s.proficiency}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => { setEditingSkill(s); setShowForm(true); }}
                    className="p-1.5 text-muted-foreground hover:text-primary transition mr-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No skills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
