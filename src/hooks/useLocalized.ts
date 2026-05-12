import { useTranslation } from "react-i18next";
import type { LangCode } from "@/components/LanguageSwitcher";

/** Pick the right language field from a multilingual row, falling back to EN. */
export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = (i18n.language as LangCode) || "en";

  function pick<T extends Record<string, any>>(row: T, base: string): string {
    const key = `${base}_${lang}` as keyof T;
    const value = row[key] as string | null | undefined;
    if (value && value.trim().length > 0) return value;
    return (row[`${base}_en` as keyof T] as string) ?? "";
  }
  return { lang, pick };
}
