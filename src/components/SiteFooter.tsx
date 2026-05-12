import { useTranslation } from "react-i18next";
import { SITE } from "@/config/siteConfig";

export const SiteFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 mt-12">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 terminal-text text-xs uppercase tracking-widest text-muted-foreground">
        <div>© {new Date().getFullYear()} {SITE.ownerName}</div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};
