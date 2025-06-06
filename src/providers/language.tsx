import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import translations, { Language } from '@/data/translations';

export interface LanguageContextType {
  language: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && savedLanguage in translations) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): any => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        return key;
      }
    }
    
    return translation;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, currentLanguage: language, setLanguage, t, isRTL }}>
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