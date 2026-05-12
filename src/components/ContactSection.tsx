import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Mail, Link as LinkIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SectionHeader } from "@/components/BentoSection";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabase, safeFetchAll, safeFetchOne } from "@/integrations/supabase/safeFetch";
import { SITE } from "@/config/siteConfig";

type SocialLink = {
  id: string; platform: string; label: string; url: string;
  icon: string; display_order: number; visible: boolean;
};

export const ContactSection = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [channels, setChannels] = useState<SocialLink[]>([]);
  const [fallbackEmail, setFallbackEmail] = useState(SITE.email);

  useEffect(() => {
    safeFetchAll<SocialLink>("social_links", { order: "display_order", ascending: true })
      .then(rows => setChannels(rows.filter(r => r.visible)));
    safeFetchOne<{ contact_email: string | null }>("site_metadata")
      .then(meta => { if (meta?.contact_email) setFallbackEmail(meta.contact_email); });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Capture values before any state reset
    const { name, email, message } = form;
    let persisted = false;

    if (hasSupabase) {
      try {
        const { error } = await supabase
          .from("contact_submissions" as any)
          .insert([{ name, email, message }] as any);

        if (!error) {
          persisted = true;
          toast.success(t("contact.success", "Message received ✨"));
          setForm({ name: "", email: "", message: "" });

          // Best-effort notification — fire and forget
          supabase.functions.invoke("notify-contact", { body: { name, email, message } }).catch(() => {});
        }
      } catch {
        // falls through to mailto
      }
    }

    if (!persisted) {
      const body = `From: ${name} <${email}>%0D%0A%0D%0A${encodeURIComponent(message)}`;
      window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${body}`;
      toast.success(t("contact.fallback", "Opening mail client…"));
      setForm({ name: "", email: "", message: "" });
    }

    setSubmitting(false);
  };

  const resolveIcon = (name: string) => {
    const Ic = (Icons as any)[name] || LinkIcon;
    return <Ic className="h-5 w-5" />;
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader eyebrow="// 05_uplink" title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-xl p-6 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label={t("contact.name")}>
              <input required value={form.name} onChange={update("name")}
                className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary focus:shadow-glow-primary" />
            </FormField>
            <FormField label={t("contact.email")}>
              <input required type="email" value={form.email} onChange={update("email")}
                className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary focus:shadow-glow-primary" />
            </FormField>
          </div>
          <FormField label={t("contact.message")}>
            <textarea required rows={5} value={form.message} onChange={update("message")}
              className="w-full rounded-md border border-border bg-background-elevated/60 px-3 py-2 text-sm outline-none focus:border-primary focus:shadow-glow-primary resize-none" />
          </FormField>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-cyber px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-primary transition hover:shadow-elevated disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {t("contact.send")}
          </button>
        </motion.form>

        <div className="space-y-4">
          {channels.map(ch => (
            <ChannelCard key={ch.id} icon={resolveIcon(ch.icon)} label={ch.platform} value={ch.label} href={ch.url} />
          ))}
          {channels.length === 0 && (
            <ChannelCard icon={<Mail className="h-5 w-5" />} label="Email" value={fallbackEmail} href={`mailto:${fallbackEmail}`} />
          )}
        </div>
      </div>
    </section>
  );
};

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const ChannelCard = ({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) => (
  <a href={href} target="_blank" rel="noreferrer"
    className="glass-panel flex items-center gap-4 rounded-xl p-4 transition hover:border-primary/60 hover:shadow-glow-primary">
    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</div>
    <div>
      <div className="terminal-text text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  </a>
);
