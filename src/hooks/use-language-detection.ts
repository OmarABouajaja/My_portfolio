import { useEffect } from "react";
import { useLanguage } from "@/providers/language";

export function useLanguageDetection() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const detectedLanguage = navigator.language.split("-")[0];
    const supportedLanguages = ["en", "fr", "de", "ar"];

    if (supportedLanguages.includes(detectedLanguage)) {
      setLanguage(detectedLanguage);
    }
  }, [setLanguage]);
} 