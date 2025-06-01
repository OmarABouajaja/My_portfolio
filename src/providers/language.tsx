import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import translations, { TranslationContent } from '@/data/translations';

export interface LanguageContextType {
  language: keyof typeof translations;
  setLanguage: (lang: keyof typeof translations) => void;
  t: (key: keyof TranslationContent) => string | Record<string, any>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<keyof typeof translations>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as keyof typeof translations;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: keyof TranslationContent): string | Record<string, any> => {
    const translation = translations[language][key];
    return translation || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`${language === 'ar' ? 'font-arabic' : ''} ${language === 'ar' ? 'rtl' : 'ltr'}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 