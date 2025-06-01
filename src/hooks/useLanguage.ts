import { useContext } from 'react';
import { useLanguage as useLanguageContext } from '@/providers/language';

/**
 * Custom hook for accessing the language context
 * Provides access to language state and functions
 * @throws {Error} If used outside of a LanguageProvider
 * @returns {LanguageContextType} The language context value
 */
export const useLanguage = () => {
  return useLanguageContext();
}; 