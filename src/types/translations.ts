export type Language = 'en' | 'fr' | 'ar' | 'de' | 'es';

export interface Stats {
  title: string;
  projects: string;
  medal: string;
  olympiad: string;
  experience: string;
}

export interface Skills {
  title: string;
  design: {
    title: string;
    items: string[];
  };
  programming: {
    title: string;
    items: string[];
  };
  web: {
    title: string;
    items: string[];
  };
  embedded: {
    title: string;
    items: string[];
  };
  soft: {
    title: string;
    items: string[];
  };
}

export interface Community {
  title: string;
  description: string;
  activities: {
    robotics: {
      title: string;
      description: string;
    };
    injaz: {
      title: string;
      description: string;
    };
    jci: {
      title: string;
      description: string;
    };
    english: {
      title: string;
      description: string;
    };
  };
  conclusion: string;
}

export interface Motivation {
  title: string;
  description: string;
}

export interface Timeline {
  title: string;
  intro: string;
  entries: {
    [key: string]: {
      en: string;
      fr: string;
      ar: string;
      de: string;
      description: {
        en: string;
        fr: string;
        ar: string;
        de: string;
      };
    };
  };
}

export interface TranslationContent {
  // Navigation
  home: string;
  about: string;
  projects: string;
  journey: string;
  contact: string;
  certifications: string;
  resume: string;
  allRightsReserved: string;
  lightMode: string;
  darkMode: string;

  // Hero Section
  intro: string;
  heroTitle: string;
  heroSubtitle: string;
  shortPitch: string;
  exploreProjects: string;
  downloadCV: string;
  
  // Sections
  motivation: Motivation;
  skills: Skills;
  community: Community;
  stats: Stats;
  timeline: Timeline;

  // Bio Section
  bioTitle: string;
  bioSubtitle: string;
  bioSkills: string;
  technologies: string;
  iotDescription: string;
  roboticsDescription: string;
  embeddedDescription: string;
  uiuxDescription: string;
  webdevDescription: string;
  teachingDescription: string;

  // Contact Section
  contactTitle: string;
  contactDesc: string;
  contactMe: string;
  contactSuccess: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendMessage: string;

  // Projects Section
  projectsTitle: string;
  projectsSubtitle: string;
  viewGithub: string;
  viewDemo: string;
  smartHomeDesc: string;
  callboxDesc: string;
  rallyCarDesc: string;
  studioDesc: string;

  // Education Section
  educationTitle: string;
  bacInfo: string;
  bacScores: string;
  licenseIot: string;
  activities: string;

  // Resume Section
  resumeTitle: string;
  resumeSubtitle: string;
  downloadResume: string;
  education: string;
  experience: string;
  skillsSection: string;
  languages: string;

  // Certifications Section
  certificationsTitle: string;
  certificationsSubtitle: string;
  viewCertificate: string;
  roboticsCerts: string;
  educationCerts: string;
  softSkillsCerts: string;
  all: string;

  // Other sections
  viewAll: string;
  sourceCode: string;
  viewProject: string;
  viewMoreProjects: string;
  awardWinning: string;

  // NotFound page
  notFoundTitle: string;
  notFoundMessage: string;
  goHome: string;

  // Projects Page
  projectsPageTitle: string;
  projectsPageIntro: string;
  projectsPageGithub: string;
  projectsPageLinkedin: string;
  projectsPageContact: string;
  filterByCategory: string;
  selectCategory: string;
  searchProjects: string;
  searchProjectsPlaceholder: string;
  noProjectsFound: string;
}

export type Translations = {
  [key in Language]: TranslationContent;
}; 