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
import { cn } from '@/lib/utils';

// Map of language codes to their full names
const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  de: 'Deutsch',
  es: 'Español'
};

// Map of language codes to their display codes
const languageCodes: Record<Language, string> = {
  en: 'EN',
  fr: 'FR',
  ar: 'عر',
  de: 'DE',
  es: 'ES'
};

// Enhanced Inline SVG components for flags
const flagStyle = {
  style: { border: '1px solid #e5e7eb', borderRadius: '0.375rem', background: '#fff' },
  width: '1.5em',
  height: '1.125em', // 4:3 aspect ratio
  role: 'img' as const
};
const FlagDE = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 4 3" aria-label="German flag" {...flagStyle} {...props}>
    <rect width="4" height="1" y="0" fill="#000" />
    <rect width="4" height="1" y="1" fill="#d00" />
    <rect width="4" height="1" y="2" fill="#ffce00" />
  </svg>
);
const FlagES = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 4 3" aria-label="Spanish flag" {...flagStyle} {...props}>
    {/* Red band (top) */}
    <rect width="4" height="0.75" y="0" fill="#AA151B" />
    {/* Yellow band (middle) */}
    <rect width="4" height="1.5" y="0.75" fill="#F1BF00" />
    {/* Red band (bottom) */}
    <rect width="4" height="0.75" y="2.25" fill="#AA151B" />
    {/* Ultra-detailed coat of arms */}
    <g transform="translate(0.7,1.5) scale(0.18)">
      {/* Shield */}
      <ellipse rx="0.7" ry="1" fill="#fff" stroke="#AA151B" strokeWidth="0.12" />
      <rect x="-0.35" y="-0.7" width="0.7" height="1.4" fill="#F1BF00" stroke="#AA151B" strokeWidth="0.08" />
      {/* Blue left part */}
      <rect x="-0.35" y="-0.7" width="0.18" height="1.4" fill="#003399" />
      {/* Red right part */}
      <rect x="0.17" y="-0.7" width="0.18" height="1.4" fill="#AA151B" />
      {/* Columns with banners */}
      <rect x="-0.6" y="-0.7" width="0.08" height="1.4" fill="#fff" stroke="#AA151B" strokeWidth="0.03" />
      <rect x="0.52" y="-0.7" width="0.08" height="1.4" fill="#fff" stroke="#AA151B" strokeWidth="0.03" />
      <path d="M-0.56,-0.5 Q-0.5,-0.3 -0.56,-0.1" stroke="#AA151B" strokeWidth="0.05" fill="none" />
      <path d="M0.6,-0.5 Q0.66,-0.3 0.6,-0.1" stroke="#AA151B" strokeWidth="0.05" fill="none" />
      {/* Crown */}
      <ellipse cy="-0.9" rx="0.18" ry="0.12" fill="#F1BF00" stroke="#AA151B" strokeWidth="0.04" />
      <rect x="-0.07" y="-1.05" width="0.14" height="0.08" fill="#F1BF00" stroke="#AA151B" strokeWidth="0.02" />
    </g>
  </svg>
);
const FlagFR = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 4 3" aria-label="French flag" {...flagStyle} {...props}>
    <rect width="4" height="3" fill="#fff" />
    <rect width="1.33" height="3" x="0" fill="#00267f" />
    <rect width="1.33" height="3" x="2.67" fill="#f31830" />
  </svg>
);
const FlagGB = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 4 3" aria-label="UK flag" {...flagStyle} {...props}>
    <rect width="4" height="3" fill="#012169" />
    <path d="M0,0 L4,3 M4,0 L0,3" stroke="#fff" strokeWidth="0.5" />
    <path d="M0,0 L4,3 M4,0 L0,3" stroke="#c8102e" strokeWidth="0.3" />
    <rect x="1.7" width="0.6" height="3" fill="#fff" />
    <rect y="1.2" width="4" height="0.6" fill="#fff" />
    <rect x="1.85" width="0.3" height="3" fill="#c8102e" />
    <rect y="1.35" width="4" height="0.3" fill="#c8102e" />
  </svg>
);
const FlagTN = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 4 3" aria-label="Tunisian flag" {...flagStyle} {...props}>
    <rect width="4" height="3" fill="#E70013" />
    {/* White circle (60% of height) */}
    <circle cx="2" cy="1.5" r="0.9" fill="#fff" />
    {/* Crescent made of two arcs */}
    <path d="M2.6 1.5a0.6 0.6 0 1 1-1.2 0 0.48 0.48 0 1 0 1.2 0z" fill="#E70013" />
    <path d="M2.45 1.5a0.45 0.45 0 1 1-0.9 0 0.33 0.33 0 1 0 0.9 0z" fill="#fff" />
    {/* Five-pointed star, one point facing right */}
    <g transform="translate(2.25,1.5) rotate(18) scale(0.22)">
      <polygon points="0,-1 0.224,0.309 0.951,0.309 0.363,0.5 0.587,0.809 0,0.618 -0.587,0.809 -0.363,0.5 -0.951,0.309 -0.224,0.309" fill="#E70013" />
    </g>
  </svg>
);

// Map of language codes to their flag SVG components
const languageFlags: Record<Language, JSX.Element> = {
  en: <FlagGB />,
  fr: <FlagFR />,
  ar: <FlagTN />,
  de: <FlagDE />,
  es: <FlagES />
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
          className={cn(
            "lang-switcher relative overflow-hidden group px-2 min-w-[48px] flex items-center gap-1",
            isRTL && "font-arabic",
            className
          )}
          aria-label="Select Language"
          aria-expanded="false"
          aria-haspopup="true"
        >
          {/* Animate language code transition */}
          <AnimatePresence mode="wait">
            <motion.span
              key={language}
              className={cn(
                "font-extrabold text-base sm:text-lg transition-colors duration-200",
                language === 'ar' && "font-arabic"
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              aria-label={languageNames[language]}
            >
              <span className="mr-1 inline-block align-middle">{languageFlags[language]}</span>{languageCodes[language]}
            </motion.span>
          </AnimatePresence>
          {/* Dropdown arrow with RTL support */}
          <ChevronDown 
            className={cn(
              "w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180",
              isRTL && "rotate-180"
            )} 
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
            className={cn(
              language === code ? 'bg-primary/10 text-primary' : '',
              code === 'ar' ? 'font-arabic text-right' : '',
              isRTL && 'font-arabic'
            )}
            aria-selected={language === code}
          >
            <span className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <span className="mr-1 inline-block align-middle">{languageFlags[code]}</span>
              <span className="font-bold">{languageCodes[code]}</span>
              <span>{languageNames[code]}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 