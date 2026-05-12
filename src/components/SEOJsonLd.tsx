import { useEffect } from "react";
import { SITE } from "@/config/siteConfig";

/** Inject Person + Website JSON-LD for SEO. */
export const SEOJsonLd = () => {
  useEffect(() => {
    const data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "name": SITE.ownerName,
          "jobTitle": SITE.jobTitle,
          "url": typeof window !== "undefined" ? window.location.origin : SITE.url,
          "email": SITE.email,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": SITE.country
          },
          "knowsAbout": SITE.competencies,
          "nationality": SITE.nationality,
          "sameAs": [
            SITE.github,
            SITE.linkedin
          ],
        },
        {
          "@type": "WebSite",
          "name": `${SITE.ownerName} — Digital Portfolio`,
          "url": typeof window !== "undefined" ? window.location.origin : "",
          "inLanguage": [...SITE.locales],
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    script.id = "ld-omar";
    document.head.appendChild(script);
    return () => {
      document.getElementById("ld-omar")?.remove();
    };
  }, []);
  return null;
};
