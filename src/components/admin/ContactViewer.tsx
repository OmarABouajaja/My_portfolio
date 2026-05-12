import { useState, useEffect } from "react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { dbUpdate, dbDelete } from "@/integrations/supabase/mutations";
import { toast } from "sonner";
import { Loader2, Trash2, CheckCircle, Mail, Clock } from "lucide-react";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

export const ContactViewer = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await safeFetchAll<ContactSubmission>("contact_submissions", { order: "created_at", ascending: false });
    setMessages(data);
    setLoading(false);
  };

  const handleMarkRead = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "new" ? "read" : "new";
    const { error } = await dbUpdate("contact_submissions", id, { status: newStatus });
    if (error) {
      toast.error(`Failed to update status: ${error}`);
      return;
    }
    setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
    toast.success("Status updated");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const { success, error } = await dbDelete("contact_submissions", id);
    if (error) {
      toast.error(`Failed to delete: ${error}`);
      return;
    }
    if (success) {
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Message deleted");
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-6 w-6" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="terminal-text text-xs uppercase tracking-widest text-muted-foreground">Inbox</h3>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`glass-panel rounded-xl p-5 border-l-4 transition ${m.status === "new" ? "border-l-primary shadow-glow-primary bg-primary/5" : "border-l-border"}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  {m.name}
                  {m.status === "new" && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary uppercase tracking-widest">New</span>}
                </h4>
                <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                  <a href={`mailto:${m.email}`} className="hover:text-primary transition flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {m.email}
                  </a>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleMarkRead(m.id, m.status)} 
                  className="p-1.5 rounded-md hover:bg-background-elevated text-muted-foreground transition"
                  title={m.status === "new" ? "Mark as Read" : "Mark as Unread"}
                >
                  <CheckCircle className={`h-4 w-4 ${m.status === "read" ? "text-success" : ""}`} />
                </button>
                <button 
                  onClick={() => handleDelete(m.id)} 
                  className="p-1.5 rounded-md hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-foreground/80 bg-background-elevated/40 p-3 rounded-lg border border-border/50 whitespace-pre-wrap">
              {m.message}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            No messages in inbox.
          </div>
        )}
      </div>
    </div>
  );
};
