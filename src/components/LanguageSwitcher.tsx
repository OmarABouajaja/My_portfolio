import { useLanguage } from '@/providers/language';
import { Language } from '@/data/translations';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Map of language codes to their full names
const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  de: 'Deutsch'
};

// Map of language codes to their display codes
const languageCodes: Record<Language, string> = {
  en: 'EN',
  fr: 'FR',
  ar: 'عر',
  de: 'DE'
};

/**
 * LanguageSwitcher component that allows users to switch between different languages
 * @param {string} [className] - Optional CSS class name for styling
 */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  // Get current language, language setter, and RTL status from language context
  const { language, setLanguage, isRTL } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`lang-switcher relative overflow-hidden group px-2 min-w-[48px] flex items-center gap-1 ${className}`}
          aria-label="Select Language"
          aria-expanded="false"
          aria-haspopup="true"
        >
          {/* Animate language code transition */}
          <AnimatePresence mode="wait">
            <motion.span
              key={language}
              className={`font-extrabold text-base sm:text-lg transition-colors duration-200 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              aria-label={languageNames[language]}
            >
              {languageCodes[language]}
            </motion.span>
          </AnimatePresence>
          {/* Dropdown arrow with RTL support */}
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180 ${
              isRTL ? 'rotate-180' : ''
            }`} 
          />
          {/* Hover effect with gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-md"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Active state ring effect */}
          <motion.div
            className="absolute inset-0 rounded-md ring-2 ring-primary/10 dark:ring-primary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </Button>
      </DropdownMenuTrigger>
      {/* Dropdown menu with language options */}
      <DropdownMenuContent 
        align={isRTL ? "start" : "end"} 
        className="min-w-[120px]"
        sideOffset={5}
      >
        {/* Map through available languages to create menu items */}
        {(Object.keys(languageNames) as Language[]).map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={`${
              language === code ? 'bg-primary/10 text-primary' : ''
            } ${code === 'ar' ? 'font-arabic text-right' : ''}`}
            aria-selected={language === code}
          >
            <span className="flex items-center gap-2">
              <span className="font-bold">{languageCodes[code]}</span>
              <span>{languageNames[code]}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 