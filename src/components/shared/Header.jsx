import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/providers/theme';
import { HomeIcon, RocketIcon, GraduationIcon, DocumentIcon, EmailIcon } from '@/components/ui/custom-icons';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '#home', icon: HomeIcon },
    { key: 'projects', href: '#projects', icon: RocketIcon },
    { key: 'resume', href: '#resume', icon: DocumentIcon },
    { key: 'contact', href: '#contact', icon: EmailIcon }
  ];

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : ''}`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
        {/* Logo */}
          <a href="#home" className="text-xl font-bold">
            OB
          </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ key, href, icon: Icon }) => (
            <Button
                key={key}
              variant="ghost"
                onClick={() => handleNavClick(href)}
                className="nav-item"
            >
                <Icon className="w-4 h-4 mr-2" />
                {t(key)}
            </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
          <div className="md:hidden py-4">
            {navItems.map(({ key, href, icon: Icon }) => (
              <Button
                key={key}
                variant="ghost"
                onClick={() => handleNavClick(href)}
                className="w-full justify-start mb-2"
              >
                <Icon className="w-4 h-4 mr-2" />
                {t(key)}
              </Button>
            ))}
        </div>
      )}
      </nav>
    </header>
  );
};

export default Header;
