import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import ThemeToggle from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

/**
 * Main layout component that provides the application's structure and navigation
 * Includes responsive header, navigation, and footer
 */
const Layout = () => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Define navigation items with translated labels
  const navItems = [
    { href: '/', label: t('home') },
    { href: '/projects', label: t('projects') },
    { href: '/contact', label: t('contact') },
  ];

  // Helper function to check if a navigation item is active
  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="flex flex-1 items-center justify-between">
            <nav className={cn(
              "flex items-center space-x-6 text-sm font-medium",
              isRTL ? "space-x-reverse" : ""
            )}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    isActive(item.href) ? "text-foreground" : "text-foreground/60",
                    isRTL ? "font-arabic" : ""
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={cn(
              "flex items-center space-x-4",
              isRTL ? "space-x-reverse" : ""
            )}>
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <AnimatedBackground />
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Footer with copyright and social links */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Omar Abouajaja. {t('allRightsReserved')}</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/OmarABouajaja "
                target="_blank"
                rel="noopener noreferrer"
                className="icon-button"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/omar-abouajaja"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-button"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-full h-full z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center pt-24 gap-6 shadow-2xl bg-background"
          >
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "text-xl font-semibold flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary/10 focus:bg-primary/20 outline-none",
                  isActive(href) && "text-primary bg-primary/10"
                )}
                aria-current={isActive(href) ? 'page' : undefined}
                tabIndex={0}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout; 