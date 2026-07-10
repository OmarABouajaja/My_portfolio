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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

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
    { id: "certifications", label: t("nav.certifications") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto mt-3 sm:mt-4 flex max-w-6xl items-center justify-between gap-4 rounded-full border border-primary/20 bg-background-elevated/40 px-3 py-1.5 backdrop-blur-2xl shadow-glow-primary/50 sm:px-6 sm:py-2">
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
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full text-foreground hover:bg-primary/10 transition-colors touch-target"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Premium Full-Screen Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-xl z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col items-center justify-center gap-2 px-8 md:hidden"
            >
              {items.map((it, idx) => (
                <motion.a
                  key={it.id}
                  href={`#${it.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  className={`w-full max-w-sm text-center rounded-2xl px-6 py-4 text-base font-semibold uppercase tracking-[0.15em] transition-all touch-target ${
                    activeSection === it.id
                      ? "text-primary bg-primary/10 border border-primary/30 shadow-glow-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {it.label}
                </motion.a>
              ))}

              {/* Utilities Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: items.length * 0.06 + 0.1, duration: 0.3 }}
                className="mt-6 flex items-center justify-center gap-4 rounded-2xl border border-border/30 bg-background-elevated/40 px-6 py-3"
              >
                <LanguageSwitcher />
                <div className="h-6 w-px bg-border/40" />
                <ThemeSwitcher />
              </motion.div>

              {/* Brand footer in mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: items.length * 0.06 + 0.2, duration: 0.4 }}
                className="mt-8 flex flex-col items-center gap-1"
              >
                <span className="terminal-text text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                  {SITE.brandHandle}
                </span>
                <span className="h-px w-12 bg-primary/20" />
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
