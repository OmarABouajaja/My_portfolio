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
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Define navigation items with translated labels
  const navItems = [
    { href: '/', label: t('home') as string },
    { href: '/projects', label: t('projects') as string },
    { href: '/contact', label: t('contact') as string },
  ];

  // Helper function to check if a navigation item is active
  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background effect */}
      <AnimatedBackground />
      
      {/* Sticky header with navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-md transition-shadow">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and brand name */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.95, rotate: -3 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white font-bold text-base tracking-widest">OB</span>
              </motion.div>
              <motion.span 
                className="text-lg font-extrabold bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent tracking-wide group-hover:tracking-wider transition-all duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                OMAR ABOUAJAJA
              </motion.span>
            </Link>

            {/* Desktop navigation menu */}
            <div className="hidden sm:flex items-center gap-2">
              <nav className="flex items-center gap-1">
                {navItems.map(({ href, label }) => (
                  <Button
                    key={href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "nav-item relative px-4 py-2 font-medium text-base flex items-center gap-2 transition-all duration-200",
                      isActive(href) && "text-primary"
                    )}
                    aria-current={isActive(href) ? 'page' : undefined}
                  >
                    <Link to={href} tabIndex={0}>
                      <span>{label}</span>
                      {/* Active page indicator */}
                      {isActive(href) && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute left-2 right-2 -bottom-1 h-1 rounded-full bg-gradient-to-r from-primary via-violet-500 to-primary"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </Button>
                ))}
              </nav>
              {/* Language and theme controls */}
              <div className="flex items-center gap-2 ml-4">
                <LanguageSwitcher className="font-bold" />
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile navigation controls */}
            <div className="sm:hidden flex items-center gap-2">
              <LanguageSwitcher className="font-bold" />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="ml-1"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile navigation drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 w-full h-full z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center pt-24 gap-6 shadow-2xl"
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
      </header>

      {/* Main content area with page transitions */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with copyright and social links */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Omar Abouajaja. {t('allRightsReserved') as string}</p>
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
    </div>
  );
};

export default Layout; 