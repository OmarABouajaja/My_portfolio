import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { MultiLangInput } from "./MultiLangInput";
import { ImageUploader } from "@/components/ui/ImageUploader";

type Project = {
  id: string;
  slug: string;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  description_en: string; description_es: string | null; description_fr: string | null; description_ar: string | null;
  category: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  display_order: number;
};

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await safeFetchAll<Project>("projects", { order: "display_order", ascending: true });
    setProjects(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { success, error } = await dbDelete("projects", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setProjects(projects.filter(p => p.id !== id));
      toast.success("Project deleted");
    }
  };

  const handleSave = async () => {
    if (!editingProject?.title_en?.trim()) {
      toast.error("Project title (EN) is required");
      return;
    }
    if (!editingProject?.description_en?.trim()) {
      toast.error("Project description (EN) is required");
      return;
    }

    const slug = editingProject.slug || slugify(editingProject.title_en);
    const payload = {
      ...editingProject,
      slug,
      category: editingProject.category || "Full-Stack",
      tech_stack: editingProject.tech_stack || [],
      featured: editingProject.featured ?? false,
      display_order: editingProject.display_order ?? projects.length,
    };

    if (editingProject.id) {
      // Update existing
      const result = await mutateWithToast<Project>(
        () => dbUpdate<Project>("projects", editingProject.id!, payload),
        "Project updated",
        "Failed to update project"
      );
      if (result) await loadProjects();
    } else {
      // Create new
      const result = await mutateWithToast<Project>(
        () => dbInsert<Project>("projects", payload),
        "Project created",
        "Failed to create project"
      );
      if (result) {
        setProjects([...projects, result]);
      }
    }

    setShowForm(false);
    setEditingProject(null);
  };

  const addTechTag = () => {
    if (!techInput.trim()) return;
    setEditingProject(prev => ({
      ...prev,
      tech_stack: [...(prev?.tech_stack || []), techInput.trim()],
    }));
    setTechInput("");
  };

  const removeTechTag = (idx: number) => {
    setEditingProject(prev => ({
      ...prev,
      tech_stack: (prev?.tech_stack || []).filter((_, i) => i !== idx),
    }));
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editingProject?.id ? "Edit Project" : "New Project"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Project Title"
            initialValues={{
              en: editingProject?.title_en || "",
              fr: editingProject?.title_fr || "",
              es: editingProject?.title_es || "",
              ar: editingProject?.title_ar || ""
            }}
            onChange={(vals) => setEditingProject(prev => ({
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
            label="Project Description"
            initialValues={{
              en: editingProject?.description_en || "",
              fr: editingProject?.description_fr || "",
              es: editingProject?.description_es || "",
              ar: editingProject?.description_ar || ""
            }}
            onChange={(vals) => setEditingProject(prev => ({
              ...prev,
              description_en: vals.en,
              description_fr: vals.fr,
              description_es: vals.es,
              description_ar: vals.ar
            }))}
          />
        </div>

        {/* Category, URLs, Featured, Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Category</label>
            <select
              value={editingProject?.category || "Full-Stack"}
              onChange={(e) => setEditingProject(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            >
              <option value="Full-Stack">Full-Stack</option>
              <option value="Enterprise">Enterprise</option>
              <option value="IoT">IoT</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Display Order</label>
            <input
              type="number"
              value={editingProject?.display_order ?? 0}
              onChange={(e) => setEditingProject(prev => ({ ...prev, display_order: Number(e.target.value) }))}
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Live URL</label>
            <input
              type="url"
              value={editingProject?.live_url || ""}
              onChange={(e) => setEditingProject(prev => ({ ...prev, live_url: e.target.value || null }))}
              placeholder="https://..."
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">GitHub URL</label>
            <input
              type="url"
              value={editingProject?.github_url || ""}
              onChange={(e) => setEditingProject(prev => ({ ...prev, github_url: e.target.value || null }))}
              placeholder="https://github.com/..."
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Tech Stack</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(editingProject?.tech_stack || []).map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                {tag}
                <button onClick={() => removeTechTag(i)} className="hover:text-destructive transition"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechTag())}
              placeholder="Add technology..."
              className="flex-1 rounded-md border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary transition outline-none"
            />
            <button type="button" onClick={addTechTag} className="px-3 py-2 rounded-md bg-primary/10 text-primary text-sm hover:bg-primary/20 transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={editingProject?.featured ?? false}
            onChange={(e) => setEditingProject(prev => ({ ...prev, featured: e.target.checked }))}
            className="rounded border-border"
          />
          <span className="text-sm font-medium">Featured Project</span>
        </label>

        <div className="pt-2">
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Project Image (Drag & Drop)</label>
          <ImageUploader 
            value={editingProject?.image_url || null}
            onChange={(url) => setEditingProject(prev => ({ ...prev, image_url: url }))}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">All Projects</h3>
        <button 
          onClick={() => { setEditingProject({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Project
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-elevated text-xs uppercase text-muted-foreground whitespace-nowrap">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Title (EN)</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-background-elevated/30 transition">
                <td className="px-4 py-3 font-mono text-muted-foreground">{p.display_order}</td>
                <td className="px-4 py-3 font-medium">{p.title_en}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.featured ? (
                    <span className="text-success text-xs">Yes</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditingProject(p); setShowForm(true); }} className="p-1.5 text-muted-foreground hover:text-primary transition mr-1">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
