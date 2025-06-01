import { PERSONAL_INFO } from "@/data/constants";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSONAL_INFO.name,
    url: PERSONAL_INFO.website,
    image: PERSONAL_INFO.avatar,
    sameAs: [
      PERSONAL_INFO.linkedin,
      PERSONAL_INFO.github,
    ],
    jobTitle: PERSONAL_INFO.title,
    worksFor: {
      "@type": "Organization",
      name: PERSONAL_INFO.company,
    },
    description: PERSONAL_INFO.bio,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 