import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Menu, X, Briefcase, Clock, Layers, Award, Mail } from "lucide-react";
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
    { id: "projects", label: t("nav.projects"), icon: Briefcase, colorClass: "text-primary hover:text-primary", bgClass: "bg-primary/5", borderClass: "border-primary/30", glowClass: "shadow-glow-primary" },
    { id: "timeline", label: t("nav.timeline"), icon: Clock, colorClass: "text-accent hover:text-accent", bgClass: "bg-accent/5", borderClass: "border-accent/30", glowClass: "shadow-[0_0_15px_rgba(var(--accent),0.3)]" },
    { id: "services", label: t("nav.services"), icon: Layers, colorClass: "text-warning hover:text-warning", bgClass: "bg-warning/5", borderClass: "border-warning/30", glowClass: "shadow-[0_0_15px_rgba(var(--warning),0.3)]" },
    { id: "certifications", label: t("nav.certifications"), icon: Award, colorClass: "text-success hover:text-success", bgClass: "bg-success/5", borderClass: "border-success/30", glowClass: "shadow-[0_0_15px_rgba(var(--success),0.3)]" },
    { id: "contact", label: t("nav.contact"), icon: Mail, colorClass: "text-destructive hover:text-destructive", bgClass: "bg-destructive/5", borderClass: "border-destructive/30", glowClass: "shadow-[0_0_15px_rgba(var(--destructive),0.3)]" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto mt-3 sm:mt-4 flex max-w-6xl items-center justify-between gap-4 rounded-full border border-border/50 bg-background-elevated/60 px-3 py-1.5 backdrop-blur-2xl shadow-lg shadow-black/20 sm:px-6 sm:py-2">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <span 
            onDoubleClick={(e) => { e.preventDefault(); navigate('/admin'); }}
            className="terminal-text text-xs uppercase tracking-[0.25em] text-foreground cursor-default"
          >
            {SITE.brandHandle}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = activeSection === it.id;
            return (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={(e) => handleNavClick(e, it.id)}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 group ${
                  isActive ? `${it.colorClass.split(' ')[0]} ${it.bgClass}` : `text-muted-foreground ${it.colorClass}`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {it.label}
                <span className={`absolute bottom-1 left-1/2 h-[1px] -translate-x-1/2 transition-all duration-300 ${it.colorClass.split(' ')[0].replace('text-', 'bg-')} ${isActive ? "w-1/2" : "w-0 group-hover:w-1/2"}`} />
              </a>
            );
          })}
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
              {items.map((it, idx) => {
                const Icon = it.icon;
                const isActive = activeSection === it.id;
                return (
                  <motion.a
                    key={it.id}
                    href={`#${it.id}`}
                    onClick={(e) => handleNavClick(e, it.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className={`w-full max-w-sm text-center flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-semibold uppercase tracking-[0.15em] transition-all touch-target ${
                      isActive
                        ? `${it.colorClass.split(' ')[0]} ${it.bgClass} border ${it.borderClass} ${it.glowClass}`
                        : `text-foreground/80 hover:${it.colorClass.split(' ')[0]} hover:${it.bgClass}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {it.label}
                  </motion.a>
                );
              })}

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
