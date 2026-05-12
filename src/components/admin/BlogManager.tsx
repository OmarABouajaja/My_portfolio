import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbInsert, dbUpdate, dbDelete, mutateWithToast } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Calendar, FileText, X, Save } from "lucide-react";
import { MultiLangInput } from "./MultiLangInput";
import { ImageUploader } from "@/components/ui/ImageUploader";

type BlogPost = {
  id: string;
  slug: string;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  summary_en: string; summary_es: string | null; summary_fr: string | null; summary_ar: string | null;
  content_en: string; content_es: string | null; content_fr: string | null; content_ar: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string;
};

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await safeFetchAll<BlogPost>("blog_posts", { order: "published_at", ascending: false });
    setPosts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { success, error } = await dbDelete("blog_posts", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setPosts(posts.filter(p => p.id !== id));
      toast.success("Post deleted");
    }
  };

  const handleSave = async () => {
    if (!editingPost?.title_en?.trim()) {
      toast.error("Post title (EN) is required");
      return;
    }
    if (!editingPost?.content_en?.trim()) {
      toast.error("Post content (EN) is required");
      return;
    }

    const slug = editingPost.slug || slugify(editingPost.title_en);
    const payload = {
      ...editingPost,
      slug,
      summary_en: editingPost.summary_en || editingPost.content_en.substring(0, 160),
      published: editingPost.published ?? false,
      published_at: editingPost.published_at || new Date().toISOString(),
    };

    if (editingPost.id) {
      const result = await mutateWithToast<BlogPost>(
        () => dbUpdate<BlogPost>("blog_posts", editingPost.id!, payload),
        "Post updated",
        "Failed to update post"
      );
      if (result) await loadPosts();
    } else {
      const result = await mutateWithToast<BlogPost>(
        () => dbInsert<BlogPost>("blog_posts", payload),
        "Post created",
        "Failed to create post"
      );
      if (result) setPosts([result, ...posts]);
    }

    setShowForm(false);
    setEditingPost(null);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  if (showForm) {
    return (
      <div className="glass-panel rounded-xl border border-border p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <h3 className="terminal-text text-sm uppercase tracking-widest text-primary">
            {editingPost?.id ? "Edit Post" : "New Post"}
          </h3>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Post Title"
            initialValues={{
              en: editingPost?.title_en || "",
              fr: editingPost?.title_fr || "",
              es: editingPost?.title_es || "",
              ar: editingPost?.title_ar || ""
            }}
            onChange={(vals) => setEditingPost(prev => ({
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
            label="Summary"
            initialValues={{
              en: editingPost?.summary_en || "",
              fr: editingPost?.summary_fr || "",
              es: editingPost?.summary_es || "",
              ar: editingPost?.summary_ar || ""
            }}
            onChange={(vals) => setEditingPost(prev => ({
              ...prev,
              summary_en: vals.en,
              summary_fr: vals.fr,
              summary_es: vals.es,
              summary_ar: vals.ar
            }))}
          />
        </div>

        <div className="pt-2">
          <MultiLangInput 
            label="Post Content (Markdown)"
            initialValues={{
              en: editingPost?.content_en || "",
              fr: editingPost?.content_fr || "",
              es: editingPost?.content_es || "",
              ar: editingPost?.content_ar || ""
            }}
            onChange={(vals) => setEditingPost(prev => ({
              ...prev,
              content_en: vals.en,
              content_fr: vals.fr,
              content_es: vals.es,
              content_ar: vals.ar
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={editingPost?.published ?? false}
              onChange={(e) => setEditingPost(prev => ({ ...prev, published: e.target.checked, published_at: e.target.checked ? new Date().toISOString() : prev?.published_at }))}
              className="rounded border-border"
            />
            <span className="text-sm font-medium">Published</span>
          </label>
        </div>

        <div className="pt-2">
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground terminal-text">Cover Image (Drag & Drop)</label>
          <ImageUploader 
            value={editingPost?.image_url || null}
            onChange={(url) => setEditingPost(prev => ({ ...prev, image_url: url }))}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-primary">
            <Save className="w-4 h-4" /> Save Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Articles</h3>
        <button 
          onClick={() => { setEditingPost({}); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
        >
          <Plus className="h-3.5 w-3.5" /> New Post
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-background-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-background-elevated/30 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{post.title_en}</div>
                  <div className="text-[10px] text-muted-foreground terminal-text mt-0.5">/{post.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.published_at || new Date()).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">Published</span>
                  ) : (
                    <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] text-warning">Draft</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => { setEditingPost(post); setShowForm(true); }}
                    className="p-1.5 text-muted-foreground hover:text-primary transition mr-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground border border-dashed border-border m-4 rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                    <p>No articles found. Start writing!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
