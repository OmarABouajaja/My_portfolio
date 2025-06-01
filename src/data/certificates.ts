interface Certificate {
  id: number;
  title: { en: string; fr: string };
  issuer: string;
  date: string;
  category: 'robotics' | 'education' | 'soft-skills' | 'skills';
  image: string;
  url?: string;
  year: number;
  filename: string;
  description: { en: string; fr: string };
}

export const certificates: Certificate[] = [
  {
    id: 1,
    title: {
      en: "Basic Robotics Training (AJSZ)",
      fr: "Formation de base en robotique (AJSZ)"
    },
    issuer: "AJSZ Robotics Club",
    date: "2019",
    category: "robotics",
    image: "/certificates/ajsz_formation_base.webp",
    url: "https://example.com/cert/robotics-base",
    year: 2019,
    filename: "ajsz_base.jpg",
    description: {
      en: "Foundational robotics training covering electronics, programming, and mechanical assembly",
      fr: "Formation fondamentale en robotique couvrant l'électronique, la programmation et l'assemblage mécanique"
    }
  },
  {
    id: 2,
    title: {
      en: "Gold Medal - National IoT Congress",
      fr: "Médaille d'or – Congrès national IoT"
    },
    issuer: "National IoT Congress",
    date: "2022",
    category: "robotics",
    image: "/certificates/iot_congress_gold.webp",
    url: "https://example.com/cert/iot-gold",
    year: 2022,
    filename: "iot_gold.jpg",
    description: {
      en: "First place award for Smart Home automation project at the National IoT Congress",
      fr: "Premier prix pour le projet de domotique Smart Home au Congrès national IoT"
    }
  },
  {
    id: 3,
    title: {
      en: "INJAZ Tunisia - Entrepreneurship Training",
      fr: "INJAZ Tunisia – Formation entrepreneuriale"
    },
    issuer: "Ministry of Education - Tunisia",
    date: "2023",
    category: "education",
    image: "/certificates/bac_info.webp",
    year: 2022,
    filename: "injaz.jpg",
    description: {
      en: "Comprehensive entrepreneurship training program focused on business planning and innovation",
      fr: "Programme complet de formation à l'entrepreneuriat axé sur la planification d'entreprise et l'innovation"
    }
  },
  {
    id: 4,
    title: {
      en: "JCI Zarzis - ESS Project",
      fr: "JCI Zarzis – Projet ESS"
    },
    issuer: "JCI Zarzis",
    date: "2022",
    category: "skills",
    image: "/certificates/jci.webp",
    year: 2022,
    filename: "jci.jpg",
    description: {
      en: "Social and solidarity economy project development and management training",
      fr: "Formation en développement et gestion de projets d'économie sociale et solidaire"
    }
  },
  {
    id: 5,
    title: {
      en: "English Club ZZ - Certificate",
      fr: "Club Anglais ZZ – Certificat"
    },
    issuer: "English Club ZZ",
    date: "2021",
    category: "skills",
    image: "/certificates/english.webp",
    year: 2021,
    filename: "english.jpg",
    description: {
      en: "Advanced English language proficiency and communication skills certification",
      fr: "Certification de compétences avancées en langue anglaise et en communication"
    }
  }
];

export const categories = [
  { value: "all", label: "All Certificates" },
  { value: "robotics", label: "Robotics" },
  { value: "education", label: "Education" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "skills", label: "Skills" }
]; 