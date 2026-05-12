import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import { SITE } from "@/config/siteConfig";

export const SiteNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  const items = [
    { id: "projects", label: t("nav.projects") },
    { id: "timeline", label: t("nav.timeline") },
    { id: "services", label: t("nav.services") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-4 rounded-full border border-primary/20 bg-background-elevated/40 px-4 py-2 backdrop-blur-2xl shadow-glow-primary/50 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Cpu className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 -z-10 blur-md bg-primary/40 group-hover:bg-primary/60 transition" />
          </div>
          <span 
            onDoubleClick={(e) => { e.preventDefault(); navigate('/admin'); }}
            className="terminal-text text-xs uppercase tracking-[0.25em] text-foreground cursor-default"
          >
            {SITE.brandHandle}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`relative rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-[inset_0_0_12px_rgba(34,211,238,0.15)] group ${
                activeSection === it.id ? "text-primary bg-primary/5" : "text-muted-foreground"
              }`}
            >
              {it.label}
              <span className={`absolute bottom-1 left-1/2 h-[1px] -translate-x-1/2 bg-primary transition-all duration-300 ${activeSection === it.id ? "w-1/2" : "w-0 group-hover:w-1/2"}`} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-4 right-4 top-20 rounded-2xl border border-primary/20 bg-background/95 p-4 backdrop-blur-3xl shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {items.map((it) => (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary hover:pl-6 ${
                    activeSection === it.id ? "text-primary bg-primary/5 pl-6 border-l-2 border-primary" : "text-foreground"
                  }`}
                >
                  {it.label}
                </a>
              ))}
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4 px-2 sm:hidden">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
