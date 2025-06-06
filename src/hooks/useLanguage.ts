import { useLanguage as useLanguageProvider } from "@/providers/language";
import { LanguageContextType } from "@/providers/language";

/**
 * Custom hook for accessing the language context
 * Provides access to language state and functions
 * @throws {Error} If used outside of a LanguageProvider
 * @returns {LanguageContextType} The language context value
 */
export const useLanguage = (): LanguageContextType => {
  return useLanguageProvider();
}; 