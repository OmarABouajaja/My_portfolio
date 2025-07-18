import { useLanguage } from '@/providers/language'
import { Button } from '@/components/ui/button'
import type { Language } from '@/types/translations'

const languageCodes: Record<Language, string> = {
  en: 'EN',
  fr: 'FR',
  ar: 'عر',
  de: 'DE',
  es: 'ES'
};

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const languages: Language[] = ['en', 'fr', 'ar', 'de', 'es'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="w-9 px-0"
    >
      {languageCodes[language]}
    </Button>
  )
} 