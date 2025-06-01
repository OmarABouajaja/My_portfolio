import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/providers/language';

const ScrollNav = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('');

  const sections = [
    { id: 'hero', label: t('home') },
    { id: 'about', label: t('about') },
    { id: 'projects', label: t('projects') },
    { id: 'contact', label: t('contact') },
  ];

  const validSections = sections.filter(({ id }) => document.getElementById(id));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    validSections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [validSections]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
    >
      <ul className="space-y-3">
        {validSections.map(({ id, label }) => (
          <motion.li
            key={id}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            <button
              onClick={() => handleClick(id)}
              className="p-1.5 focus:outline-none"
              aria-label={`Scroll to ${label}`}
            >
              <motion.span
                className={cn(
                  "block w-2 h-2 rounded-full transition-all duration-200",
                  "border border-primary/50",
                  activeSection === id
                    ? "bg-primary scale-125"
                    : "bg-transparent hover:bg-primary/30"
                )}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </button>
            <motion.span
              className={cn(
                "absolute left-0 transform -translate-x-full -translate-y-1/2 top-1/2",
                "px-2 py-1 rounded-md text-xs font-medium",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "pointer-events-none whitespace-nowrap",
                "bg-primary/5 dark:bg-primary/10",
                "border border-primary/10"
              )}
              initial={{ x: 10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {label}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default ScrollNav; 