import { useState, useEffect, useCallback } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import {
  dbInsert,
  dbUpdate,
  dbDelete,
  mutateWithToast,
} from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Award,
  ExternalLink,
  X,
  Save,
} from "lucide-react";

type Certification = {
  id: string;
  title_en: string;
  title_es: string | null;
  title_fr: string | null;
  title_ar: string | null;
  issuer: string;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  display_order: number;
};

export const CertificationsManager = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Partial<Certification> | null>(null);

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await safeFetchAll<Certification>("certifications", {
        order: "display_order",
        ascending: true,
      });
      setCerts(data);
    } catch {
      toast.error("Failed to load certifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCerts();
  }, [fetchCerts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this certification?")) return;
    const { success, error } = await dbDelete("certifications", id);
    if (error) return toast.error(`Delete failed: ${error}`);
    if (success) {
      setCerts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Certification removed.");
    }
  };

  const handleSave = async () => {
    if (!draft?.title_en?.trim()) return toast.error("Title (EN) is required.");
    if (!draft?.issuer?.trim()) return toast.error("Issuer is required.");

    const payload = {
      ...draft,
      display_order: draft.display_order ?? certs.length,
    };

    if (draft.id) {
      const success = await mutateWithToast<Certification>(
        () => dbUpdate<Certification>("certifications", draft.id!, payload),
        "Certification updated."
      );
      if (success) await fetchCerts();
    } else {
      const newCert = await mutateWithToast<Certification>(
        () => dbInsert<Certification>("certifications", payload),
        "Certification added."
      );
      if (newCert) setCerts((prev) => [...prev, newCert]);
    }

    setDraft(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary h-6 w-6" />
      </div>
    );
  }

  // ── Edit / Create Form ──
  if (draft) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-semibold">
            {draft.id ? "Edit Certification" : "New Certification"}
          </h3>
          <button
            onClick={() => setDraft(null)}
            className="p-2 rounded-md hover:bg-background-elevated text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title EN */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Title (English) *
            </label>
            <input
              value={draft.title_en || ""}
              onChange={(e) =>
                setDraft({ ...draft, title_en: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
              placeholder="e.g. AWS Cloud Practitioner"
            />
          </div>

          {/* Title FR */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Title (French)
            </label>
            <input
              value={draft.title_fr || ""}
              onChange={(e) =>
                setDraft({ ...draft, title_fr: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
            />
          </div>

          {/* Title ES */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Title (Spanish)
            </label>
            <input
              value={draft.title_es || ""}
              onChange={(e) =>
                setDraft({ ...draft, title_es: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
            />
          </div>

          {/* Title AR */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Title (Arabic)
            </label>
            <input
              value={draft.title_ar || ""}
              onChange={(e) =>
                setDraft({ ...draft, title_ar: e.target.value })
              }
              dir="rtl"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition text-right"
            />
          </div>

          {/* Issuer */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Issuer *
            </label>
            <input
              value={draft.issuer || ""}
              onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
              placeholder="e.g. Amazon Web Services"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Issue Date
            </label>
            <input
              type="date"
              value={draft.issue_date || ""}
              onChange={(e) =>
                setDraft({ ...draft, issue_date: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
            />
          </div>

          {/* Credential ID */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Credential ID
            </label>
            <input
              value={draft.credential_id || ""}
              onChange={(e) =>
                setDraft({ ...draft, credential_id: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
              placeholder="e.g. ABC-123-XYZ"
            />
          </div>

          {/* Credential URL */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Credential URL
            </label>
            <input
              value={draft.credential_url || ""}
              onChange={(e) =>
                setDraft({ ...draft, credential_url: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
              placeholder="https://verify.example.com/..."
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Badge / Logo URL
            </label>
            <input
              value={draft.image_url || ""}
              onChange={(e) =>
                setDraft({ ...draft, image_url: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
              placeholder="https://..."
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
              Display Order
            </label>
            <input
              type="number"
              value={draft.display_order ?? 0}
              onChange={(e) =>
                setDraft({ ...draft, display_order: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            <Save className="h-4 w-4" />
            {draft.id ? "Update" : "Create"}
          </button>
          <button
            onClick={() => setDraft(null)}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-background-elevated transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">
          Certifications Registry
        </h3>
        <button
          onClick={() => setDraft({ issuer: "" })}
          className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Certification
        </button>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Award className="mx-auto h-10 w-10 mb-3 opacity-30" />
          <p>No certifications yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-background-elevated transition group"
            >
              {cert.image_url ? (
                <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-background border border-border/50 flex items-center justify-center p-1">
                  <img
                    src={cert.image_url}
                    alt={cert.issuer}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {cert.title_en}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {cert.issuer}
                  {cert.issue_date &&
                    ` · ${new Date(cert.issue_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`}
                </p>
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <button
                onClick={() => setDraft(cert)}
                className="p-2 text-muted-foreground hover:text-foreground transition"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDelete(cert.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
