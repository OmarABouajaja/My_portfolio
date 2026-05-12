import { useState } from "react";
import { Sparkles, Loader2, Languages, ArrowDown } from "lucide-react";

interface Translations {
  en: string;
  fr: string;
  es: string;
  ar: string;
}

interface MultiLangInputProps {
  label?: string;
  initialValues?: Translations;
  onChange?: (values: Translations) => void;
}

const autoTranslate = async (text: string, targetLang: string): Promise<string> => {
  if (!text.trim()) return "";
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join("");
  } catch (err) {
    console.error(`Translation to ${targetLang} failed:`, err);
    return "";
  }
};

export const MultiLangInput = ({
  label = "Content",
  initialValues = { en: "", fr: "", es: "", ar: "" },
  onChange,
}: MultiLangInputProps) => {
  const [values, setValues] = useState<Translations>(initialValues);
  const [isTranslating, setIsTranslating] = useState(false);

  const updateValue = (lang: keyof Translations, text: string) => {
    const newValues = { ...values, [lang]: text };
    setValues(newValues);
    onChange?.(newValues);
  };

  const handleTranslateAll = async () => {
    if (!values.en.trim()) return;
    setIsTranslating(true);

    try {
      const [fr, es, ar] = await Promise.all([
        autoTranslate(values.en, "fr"),
        autoTranslate(values.en, "es"),
        autoTranslate(values.en, "ar"),
      ]);

      const translatedValues = {
        en: values.en,
        fr: fr || values.fr,
        es: es || values.es,
        ar: ar || values.ar,
      };

      setValues(translatedValues);
      onChange?.(translatedValues);
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const renderTextarea = (lang: keyof Translations, title: string, badge: string, isRTL: boolean = false) => (
    <div className="relative group">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <span className="flex items-center justify-center rounded-[3px] bg-background-elevated border border-border px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground terminal-text transition-colors group-focus-within:border-primary/40 group-focus-within:text-primary">
          {badge}
        </span>
        <span className="text-xs font-medium text-muted-foreground group-focus-within:text-foreground transition-colors">
          {title}
        </span>
      </div>
      <textarea
        value={values[lang]}
        onChange={(e) => updateValue(lang, e.target.value)}
        dir={isRTL ? "rtl" : "ltr"}
        className={`w-full min-h-[100px] resize-y rounded-lg border border-border/60 bg-background/40 pt-10 pb-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/60 focus:bg-background/80 focus:shadow-glow-primary ${
          isRTL ? "pr-4 pl-4 text-right" : "pl-4 pr-4"
        }`}
        placeholder={`Enter ${title} content...`}
      />
    </div>
  );

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-semibold flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary" />
            {label}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Write in English, then auto-translate to all localized variants.
          </p>
        </div>

        <button
          onClick={handleTranslateAll}
          disabled={isTranslating || !values.en.trim()}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/10 border border-primary/30 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              ✨ Auto-Translate All
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {/* Master Input */}
        <div className="relative">
          <div className="absolute -left-[1px] top-4 bottom-4 w-1 bg-primary rounded-r-md" />
          {renderTextarea("en", "Master (English)", "US")}
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-background border border-border rounded-full p-1.5 text-muted-foreground">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Localized Inputs */}
        <div className="grid grid-cols-1 gap-4 pl-4 border-l border-border/40">
          {renderTextarea("fr", "French", "FR")}
          {renderTextarea("es", "Spanish", "ES")}
          {renderTextarea("ar", "Arabic", "TN", true)}
        </div>
      </div>
    </div>
  );
};
