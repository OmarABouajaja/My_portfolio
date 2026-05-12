import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowUpRight } from "lucide-react";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { useLocalized } from "@/hooks/useLocalized";
import { SectionHeader } from "@/components/BentoSection";

type BlogPost = {
  id: string;
  slug: string;
  title_en: string; title_es: string | null; title_fr: string | null; title_ar: string | null;
  summary_en: string; summary_es: string | null; summary_fr: string | null; summary_ar: string | null;
  content_en: string;
  image_url: string | null;
  published: boolean;
  published_at: string;
};

export const BlogSection = () => {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    safeFetchAll<BlogPost>("blog_posts", { order: "published_at", ascending: false }).then(
      (data) => setPosts(data.filter(p => p.published).slice(0, 3))
    );
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader eyebrow="// 06_data_streams" title={t("blog.title")} subtitle={t("blog.subtitle")} />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col glass-panel spotlight-container relative overflow-hidden rounded-xl transition hover:border-primary/50 hover:shadow-glow-primary"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-cyber opacity-0 transition group-hover:opacity-[0.03]" />
            
            {post.image_url && (
              <div className="h-40 overflow-hidden border-b border-border/50 bg-background-elevated/30">
                <img 
                  src={post.image_url} 
                  alt={pick(post, "title")} 
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                />
              </div>
            )}
            
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 terminal-text text-[10px] uppercase text-muted-foreground mb-3">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at || new Date()).toLocaleDateString()}
              </div>
              
              <h3 className="font-display text-xl font-semibold leading-tight group-hover:text-primary transition">
                {pick(post, "title")}
              </h3>
              
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {pick(post, "summary")}
              </p>
              
              <div className="mt-auto pt-6">
                <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 terminal-text text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition">
                  <BookOpen className="h-3 w-3" />
                  {t("blog.readMore")}
                  <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
