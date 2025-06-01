import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '@/data/translations';
import type { TranslationContent } from '@/types/translations';

type Language = 'en' | 'fr' | 'ar' | 'de';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: <T extends keyof TranslationContent>(key: T) => TranslationContent[T];
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const useLanguage = () => useContext(LanguageContext);

const isRTLLanguage = (lang: Language) => lang === 'ar';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  // Try to get from localStorage
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && ['en', 'fr', 'ar', 'de'].includes(savedLanguage)) {
    return savedLanguage;
  }

  // Try to get from browser
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'fr', 'ar', 'de'].includes(browserLang)) {
    return browserLang as Language;
  }

  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const isRTL = isRTLLanguage(currentLanguage);

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('language', currentLanguage);
    
    // Update document attributes
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Update body classes
    document.body.classList.toggle('rtl', isRTL);
    document.body.classList.toggle('ltr', !isRTL);
    document.body.classList.toggle('font-arabic', isRTL);
    
    // Update meta tags
    const metaLang = document.querySelector('meta[name="language"]');
    if (metaLang) {
      metaLang.setAttribute('content', currentLanguage);
    }
  }, [currentLanguage, isRTL]);

  const setLanguage = (lang: Language) => {
    if (['en', 'fr', 'ar', 'de'].includes(lang)) {
      setCurrentLanguage(lang);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => {
      const languages: Language[] = ['en', 'fr', 'ar', 'de'];
      const currentIndex = languages.indexOf(prev);
      return languages[(currentIndex + 1) % languages.length];
    });
  };

  const t = <T extends keyof TranslationContent>(key: T): TranslationContent[T] => {
    return translations[currentLanguage][key];
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, toggleLanguage, isRTL }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLanguage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`${isRTL ? 'font-arabic' : ''} ${isRTL ? 'rtl' : 'ltr'}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}; 