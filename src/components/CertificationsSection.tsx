import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/hooks/useLocalized";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { Award, ExternalLink, Calendar, BadgeCheck } from "lucide-react";

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

export const CertificationsSection = () => {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    safeFetchAll<Certification>("certifications", {
      order: "display_order",
      ascending: true,
    }).then((data) => setCerts(data));
  }, []);

  if (certs.length === 0) return null;

  return (
    <section
      id="certifications"
      className="relative mx-auto max-w-6xl px-6 py-24 border-t border-border/40"
    >
      <div className="mb-12">
        <span className="terminal-text text-[10px] uppercase tracking-[0.2em] text-primary">
          // 05_credentials
        </span>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {t("certificationsSection.title")}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("certificationsSection.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert, i) => (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            key={cert.id}
            className="glass-panel group relative overflow-hidden rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-500"
          >
            {/* Hover glow */}
            <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

            {/* Header: Logo + Badge */}
            <div className="flex items-start justify-between mb-5">
              {cert.image_url ? (
                <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-background border border-border/50 flex items-center justify-center p-1.5 group-hover:border-primary/30 transition">
                  <img
                    src={cert.image_url}
                    alt={cert.issuer}
                    className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition duration-300">
                  <Award className="h-7 w-7" />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-success bg-success/10 rounded-full px-2.5 py-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {t("certificationsSection.verified")}
                </span>
              </div>
            </div>

            {/* Title & Issuer */}
            <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition">
              {pick(cert, "title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{cert.issuer}</p>

            {/* Meta */}
            <div className="space-y-2 mb-5">
              {cert.issue_date && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary/60" />
                  <span>
                    {new Date(cert.issue_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
              {cert.credential_id && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="terminal-text text-primary/60">#</span>
                  <span className="terminal-text truncate">
                    {cert.credential_id}
                  </span>
                </div>
              )}
            </div>

            {/* Action */}
            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-background-elevated px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition group-hover:bg-primary/10 group-hover:text-primary"
              >
                {t("certificationsSection.verify")}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
