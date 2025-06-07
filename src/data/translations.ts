export interface TranslationContent {
  home: string
  about: string
  projects: string
  journey: string
  contact: string
  certifications: string
  allRightsReserved: string
  lightMode: string
  darkMode: string
  intro: string
  name: string
  email: string
  message: string
  responseTime: string
  sending: string
  send: string
  messageSent: string
  messageError: string
  tryAgainLater: string
  tooManyAttempts: string
  timelineTitle: string
  journeyTitle: string
  timeline2018: string
  timeline2019: string
  timeline2020: string
  timeline2021: string
  timeline2022: string
  timeline2023: string
  timeline2024: string
  projectsPageContact: string
  bioTitle: string
  bioSubtitle: string
  bioSkills: string
  technologies: string
  iotDescription: string
  roboticsDescription: string
  embeddedDescription: string
  uiuxDescription: string
  webdevDescription: string
  teachingDescription: string
  educationTitle: string
  bacInfo: string
  bacScores: string
  licenseIot: string
  heroTitle: string
  heroSubtitle: string
  shortPitch: string
  exploreProjects: string
  downloadCV: string
  motivation: {
    title: string
    description: string
  }
  skills: {
    title: string
    design: {
      title: string
      items: string[]
    }
    programming: {
      title: string
      items: string[]
    }
    web: {
      title: string
      items: string[]
    }
    embedded: {
      title: string
      items: string[]
    }
    soft: {
      title: string
      items: string[]
    }
  }
  community: {
    title: string
    description: string
    activities: {
      robotics: {
        title: string
        description: string
      }
      injaz: {
        title: string
        description: string
      }
      jci: {
        title: string
        description: string
      }
      english: {
        title: string
        description: string
      }
    }
    conclusion: string
  }
  stats: {
    title: string
    projects: string
    medal: string
    olympiad: string
    experience: string
  }
  timeline: {
    title: string
    intro: string
    entries: Record<string, {
      en: string
      fr: string
      ar: string
      de: string
      description: {
        en: string
        fr: string
        ar: string
        de: string
      }
    }>
  }
  projectsTitle: string
  projectsSubtitle: string
  viewGithub: string
  viewDemo: string
  smartHomeDesc: string
  callboxDesc: string
  rallyCarDesc: string
  studioDesc: string
  contactTitle: string
  contactDesc: string
  contactMe: string
  contactSuccess: string
  nameLabel: string
  emailLabel: string
  messageLabel: string
  sendMessage: string
  viewAll: string
  sourceCode: string
  viewProject: string
  viewMoreProjects: string
  all: string
  awardWinning: string
  notFoundTitle: string
  notFoundMessage: string
  goHome: string
  projectsPageTitle: string
  projectsPageIntro: string
  projectsPageGithub: string
  projectsPageLinkedin: string
  checkOutMore: string
  viewLinkedIn: string
  resumeTitle: string
  resumeSubtitle: string
  downloadResume: string
  education: string
  experience: string
  skillsSection: string
  languages: string
  certificationsTitle: string
  certificationsSubtitle: string
  viewCertificate: string
  roboticsCerts: string
  educationCerts: string
  softSkillsCerts: string
  activities: string
  resume: string
}

export type Language = 'en' | 'fr' | 'ar' | 'de';
export type Translations = Record<Language, TranslationContent>

const translations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    journey: 'Journey',
    contact: 'Contact',
    certifications: 'Certifications',
    allRightsReserved: 'All rights reserved',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',

    // Hero Section
    intro: "Hello, I'm Omar Abouajaja",
    heroTitle: "Innovating at the Intersection of IoT, Robotics, and Digital Design",
    heroSubtitle: "Since 2018, I've been turning ideas into reality — from Arduino prototypes to polished UI/UX interfaces. My journey spans embedded systems, web development, and creative design, driven by curiosity and a passion for building meaningful solutions. I'm proud to have contributed to impactful tech communities like Jeunes Sciences Zarzis, AJIZ, INJAZ Tunisia, and JCI Zarzis.",
    shortPitch: "From simple circuits to complex systems, I create technology that matters.",
    exploreProjects: 'Explore Projects',
    downloadCV: 'Download Resume',

    // Sections
    motivation: {
      title: "What Drives Me",
      description: "I believe in the power of practical innovation. Every project is an opportunity to solve real problems, learn something new, and share knowledge with others. My goal is to create technology that makes a meaningful difference in people's lives."
    },
    skills: {
      title: "Technical Expertise",
      design: {
        title: "Digital Design",
        items: ["Figma", "Canva", "Adobe Photoshop", "Blender"]
      },
      programming: {
        title: "Software Development",
        items: ["C", "C++", "C#", "Python", "Java"]
      },
      web: {
        title: "Web Technologies",
        items: [
          "HTML5 / CSS3 / JavaScript",
          "Modern PHP",
          "React.js",
          "Vite",
          "Tailwind CSS",
          "Git",
          "GitHub",
          "Cloud Services"
        ]
      },
      embedded: {
        title: "IoT & Embedded Systems",
        items: [
          "Arduino Development",
          "ESP32 Solutions",
          "Raspberry Pi",
          "Rapid Prototyping"
        ]
      },
      soft: {
        title: "Professional Skills",
        items: [
          "Strategic Leadership & Project Management",
          "Cross-functional Team Collaboration",
          "Technical Training & Knowledge Transfer",
          "Public Speaking & Presentation",
          "Agile Project Execution",
          "Resource Optimization & Planning",
          "Community Engagement & Impact",
          "Adaptive Problem Resolution",
          "Continuous Learning & Development"
        ]
      }
    },
    community: {
      title: "Community Impact",
      description: "Since my earliest experiences, I've always learned best by sharing. Over the years, I've been involved in several local and volunteer-based initiatives that helped me grow both technically and personally.",
      activities: {
        robotics: {
          title: "Robotics Trainer – AJIZ / AJSZ (2023)",
          description: "In 2023, I led robotics workshops for youth in Zarzis. I taught them the basics of Arduino programming, wiring sensors and motors, and embedded logic. Having been trained at AJSZ between 2018 and 2020, I returned as a trainer to give back what I had learned."
        },
        injaz: {
          title: "Youth Mentor – INJAZ Tunisia (2022)",
          description: "Through INJAZ's entrepreneurship program, I helped student teams turn ideas into structured mini-projects. We worked on problem-solving, idea validation, and presentation. This experience improved my teaching and facilitation skills."
        },
        jci: {
          title: "Active Member – JCI Zarzis (2021 – 2023)",
          description: "Between 2021 and 2023, I was an active member of JCI Zarzis. I participated in citizen-focused actions, awareness campaigns in schools, local events, and solidarity programs. My contributions included visual communication, logistics, and group collaboration within a structured nonprofit environment."
        },
        english: {
          title: "Active Member – English Fan Club ZZ (2020 – 2022)",
          description: "I helped lead oral discussions, role-plays, and cultural exchange sessions in English. It was a space where we practiced confidently and supported each other in improving language skills."
        }
      },
      conclusion: "These experiences shaped me as much as my technical work. They strengthened my soft skills: teaching, communication, initiative, teamwork, and adaptability."
    },
    stats: {
      title: "📊 Achievements",
      projects: "🔧 10+ Innovative Projects Delivered",
      medal: "🏅 Gold Medal Winner – National IoT Congress 2022",
      olympiad: "🧠 Top 50 Finalist – National Programming Olympiad 2022",
      experience: "💼 7+ Years of Combined Experience"
    },
    timeline: {
      title: "⏳ Professional Journey",
      intro: "From my beginnings in a computer club in 2010 to my IoT projects, I've built my path through hands-on experiences, personal initiatives, competitions, and volunteering. Here's a chronological look at my technical and creative evolution.",
      entries: {
        "2010": {
          en: "First steps – Children's Computer Club (CIIPEWEB)",
          fr: "Premiers pas – Club informatique pour enfants (CIIPEWEB)",
          ar: "الخطوات الأولى - نادي الكمبيوتر للأطفال (CIIPEWEB)",
          de: "Erste Schritte – Computerclub für Kinder (CIIPEWEB)",
          description: {
            en: "Introduction to computing and programming basics",
            fr: "Découverte de l'informatique et des bases de la programmation",
            ar: "مقدمة في الحوسبة وأساسيات البرمجة",
            de: "Einführung in Computer und Programmiergrundlagen"
          }
        },
        "2011-2013": {
          en: "Weekly sessions: typing, educational games, logical thinking",
          fr: "Activité hebdomadaire : découverte de logiciels éducatifs, clavier, logique, etc.",
          ar: "جلسات أسبوعية: الكتابة، الألعاب التعليمية، التفكير المنطقي",
          de: "Wöchentliche Sitzungen: Tippen, Lernspiele, logisches Denken",
          description: {
            en: "Development of fundamental digital skills",
            fr: "Développement des compétences numériques fondamentales",
            ar: "تطوير المهارات الرقمية الأساسية",
            de: "Entwicklung grundlegender digitaler Fähigkeiten"
          }
        },
        "2018": {
          en: "Foundations – Arduino & Electronics Mastery",
          fr: "Fondations – Maîtrise Arduino & Électronique",
          ar: "الأساسيات - إتقان Arduino والإلكترونيات",
          de: "Grundlagen – Arduino & Elektronik Beherrschung",
          description: {
            en: "Learning embedded systems and electronics",
            fr: "Apprentissage des systèmes embarqués et de l'électronique",
            ar: "تعلم الأنظمة المدمجة والإلكترونيات",
            de: "Lernen von eingebetteten Systemen und Elektronik"
          }
        },
        "2019": {
          en: "Leadership – Robotics workshops (Jeunes Sciences Zarzis)",
          fr: "Leadership – Ateliers robotiques Jeunes Sciences Zarzis",
          ar: "القيادة - ورش عمل الروبوتات (شباب العلوم زارزيس)",
          de: "Führung – Robotik-Workshops (Jeunes Sciences Zarzis)",
          description: {
            en: "Mentoring youth in robotics and electronics",
            fr: "Encadrement de jeunes dans la robotique et l'électronique",
            ar: "توجيه الشباب في مجال الروبوتات والإلكترونيات",
            de: "Mentoring von Jugendlichen in Robotik und Elektronik"
          }
        },
        "2020": {
          en: "Innovation – Smart Parking System (Gabès fair)",
          fr: "Innovation – Système Smart Parking à Gabès (foire régionale)",
          ar: "الابتكار - نظام موقف ذكي في قابس (معرض إقليمي)",
          de: "Innovation – Smart-Parking-System (Gabès Messe)",
          description: {
            en: "First complete IoT project with license plate recognition",
            fr: "Premier projet IoT complet avec reconnaissance de plaques",
            ar: "أول مشروع إنترنت الأشياء كامل مع التعرف على لوحات الترخيص",
            de: "Erstes vollständiges IoT-Projekt mit Kennzeichenerkennung"
          }
        },
        "2021": {
          en: "Digital expansion – Web & Community (HTML, CSS, JS)",
          fr: "Expansion digitale – Web & Community (HTML, CSS, JS)",
          ar: "التوسع الرقمي - الويب والمجتمع (HTML، CSS، JS)",
          de: "Digitale Expansion – Web & Community (HTML, CSS, JS)",
          description: {
            en: "Web development and community engagement",
            fr: "Développement web et engagement communautaire",
            ar: "تطوير الويب والمشاركة المجتمعية",
            de: "Webentwicklung und Community-Engagement"
          }
        },
        "2022": {
          en: "Recognition – Gold Medal National IoT Congress",
          fr: "Reconnaissance – Médaille d'or Congrès National IoT",
          ar: "الاعتراف - الميدالية الذهبية في المؤتمر الوطني للإنترنت الأشياء",
          de: "Anerkennung – Goldmedaille Nationaler IoT-Kongress",
          description: {
            en: "Award-winning smart home project at national level",
            fr: "Projet de domotique intelligent primé au niveau national",
            ar: "مشروع منزل ذكي حائز على جائزة على المستوى الوطني",
            de: "Ausgezeichnetes Smart-Home-Projekt auf nationaler Ebene"
          }
        },
        "2023": {
          en: "Innovation – ESP32 CallBox (industrial alert + web interface)",
          fr: "Innovation – ESP32 CallBox (alerte industrielle + interface web)",
          ar: "الابتكار - ESP32 CallBox (تنبيه صناعي + واجهة ويب)",
          de: "Innovation – ESP32 CallBox (Industriealarm + Weboberfläche)",
          description: {
            en: "Connected industrial alert system",
            fr: "Système d'alerte industriel connecté",
            ar: "نظام تنبيه صناعي متصل",
            de: "Vernetztes industrielles Alarmsystem"
          }
        },
        "2023-2": {
          en: "Volunteer – Robotics Instructor at AJIZ/AJSZ",
          fr: "Bénévolat – Formateur Robotique chez AJIZ/AJSZ",
          ar: "التطوع - مدرب الروبوتات في AJIZ/AJSZ",
          de: "Ehrenamt – Robotik-Trainer bei AJIZ/AJSZ",
          description: {
            en: "Training youth in emerging technologies",
            fr: "Formation des jeunes aux technologies émergentes",
            ar: "تدريب الشباب على التقنيات الناشئة",
            de: "Schulung von Jugendlichen in aufstrebenden Technologien"
          }
        },
        "2024": {
          en: "Entrepreneurship – Co-founder of M&O Studio (digital menus / UI design / web integration)",
          fr: "Entrepreneuriat – Co-fondateur de M&O Studio (menus digitaux / UI design / intégration web)",
          ar: "ريادة الأعمال - الشريك المؤسس لاستوديو M&O (القوائم الرقمية / تصميم واجهة المستخدم / تكامل الويب)",
          de: "Unternehmertum – Mitbegründer von M&O Studio (digitale Menüs / UI-Design / Web-Integration)",
          description: {
            en: "Launching a digital design company",
            fr: "Lancement d'une entreprise de design numérique",
            ar: "إطلاق شركة تصميم رقمية",
            de: "Gründung eines digitalen Designunternehmens"
          }
        }
      }
    },

    // Timeline Section
    timelineTitle: 'My Journey',
    journeyTitle: 'My Journey',
    timeline2018: 'Started with electronics & sensors',
    timeline2019: 'Youth robotics workshops (AJSZ)',
    timeline2020: 'Smart Parking at Gabès tech fair',
    timeline2021: 'Digital expansion - Web & Community',
    timeline2022: 'Gold Medal – Smart Home IoT project',
    timeline2023: 'ESP32 CallBox + freelance UI/UX work',
    timeline2024: 'Co-founded M&O Studio',

    // Projects Section
    projectsTitle: 'Featured Projects',
    projectsSubtitle: 'A collection of my most impactful work, from IoT systems to web applications',
    viewGithub: 'View Code',
    viewDemo: 'Live Demo',
    smartHomeDesc: 'IoT-based home automation with ESP32 and Firebase - Gold Medal winner',
    callboxDesc: 'Factory emergency device using SIM800L for SMS/email alerts',
    rallyCarDesc: 'Remote-controlled off-road robotic car',
    studioDesc: 'Digital menu and web UI design studio',

    // Contact Section
    contactTitle: "Let's Create Something Amazing",
    contactDesc: "Have an idea? Let's turn it into reality together",
    contactMe: 'Start a Conversation',
    contactSuccess: 'Message received! I\'ll respond shortly.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Your Message',
    sendMessage: 'Send Message',

    // Education Section
    educationTitle: 'Education',
    bacInfo: 'Computer Science Baccalaureate',
    bacScores: 'Algorithm: 19/20, STI: 17/20',
    licenseIot: 'IoT Systems Engineering License',

    // Bio Section
    bioTitle: 'About Me',
    bioSubtitle: 'IoT Developer & Tech Educator from Tunisia',
    bioSkills: 'Core Competencies',
    technologies: 'Technology Stack',
    iotDescription: 'Creating intelligent connected solutions with cutting-edge IoT technologies.',
    roboticsDescription: 'Developing autonomous robotic systems for real-world applications.',
    embeddedDescription: 'Building reliable embedded systems for automation and control.',
    uiuxDescription: 'Crafting intuitive and engaging digital experiences.',
    webdevDescription: 'Developing modern web applications with latest technologies.',
    teachingDescription: 'Sharing knowledge through interactive workshops and training sessions.',
    
    // Resume Section
    resumeTitle: 'Professional Journey',
    resumeSubtitle: 'Education & Experience',
    downloadResume: 'Download Full Resume',
    education: 'Education',
    experience: 'Experience',
    skillsSection: 'Skills',
    languages: 'Languages',
    
    // Certifications Section
    certificationsTitle: 'Certifications & Achievements',
    certificationsSubtitle: 'Professional development and recognition of skills through various certifications and awards',
    viewCertificate: 'View Certificate',
    roboticsCerts: 'Robotics',
    educationCerts: 'Education',
    softSkillsCerts: 'Soft Skills & Certifications',

    // Other sections
    viewAll: 'View All Projects',
    sourceCode: 'Source Code',
    viewProject: 'View Project',
    viewMoreProjects: 'View more projects on GitHub',
    all: 'All Projects',
    awardWinning: 'Award Winning',
    notFoundTitle: 'Page Not Found',
    notFoundMessage: 'The page you are looking for does not exist or has been moved.',
    goHome: 'Go to Home',
    projectsPageTitle: 'My Projects',
    projectsPageIntro: "Since 2018, I've been creating hands-on projects in IoT, embedded systems, robotics and web development. These projects were built in personal, competitive or community-based settings. They reflect my growth, curiosity, and ability to turn ideas into working solutions.",
    projectsPageGithub: 'View all projects on GitHub',
    projectsPageLinkedin: 'Connect on LinkedIn',
    projectsPageContact: 'Contact me',
    activities: 'Volunteer Activities',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    responseTime: 'Response Time',
    sending: 'Sending...',
    send: 'Send',
    messageSent: 'Message sent successfully!',
    messageError: 'Error sending message',
    tryAgainLater: 'Please try again later',
    tooManyAttempts: 'Too many attempts, please try again later',
    resume: 'Resume',
    checkOutMore: 'Check out more of my work:',
    viewLinkedIn: 'View LinkedIn'
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
    journey: 'Parcours',
    contact: 'Contact',
    certifications: 'Certifications',
    allRightsReserved: 'Tous droits réservés',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',

    // Hero Section
    intro: "Bonjour, je suis Omar Abouajaja",
    heroTitle: "Innovation à l'Intersection de l'IoT, de la Robotique et du Design Numérique",
    heroSubtitle: "Depuis 2018, je transforme des idées en réalité — des prototypes Arduino aux interfaces UI/UX raffinées. Mon parcours couvre les systèmes embarqués, le développement web et le design créatif, guidé par la curiosité et la passion pour créer des solutions significatives. Je suis fier d'avoir contribué à des communautés tech impactantes comme Jeunes Sciences Zarzis, AJIZ, INJAZ Tunisia et JCI Zarzis.",
    shortPitch: "Des circuits simples aux systèmes complexes, je crée une technologie qui compte.",
    exploreProjects: 'Explorer les Projets',
    downloadCV: 'Télécharger le CV',

    // Sections
    motivation: {
      title: "Ce qui me motive",
      description: "Je crois en la puissance de l'innovation pratique. Chaque projet est une opportunité de résoudre des problèmes réels, d'apprendre quelque chose de nouveau et de partager des connaissances. Mon objectif est de créer une technologie qui fait une différence significative dans la vie des gens."
    },
    skills: {
      title: "Expertise Technique",
      design: {
        title: "Design Numérique",
        items: ["Figma", "Canva", "Adobe Photoshop", "Blender"]
      },
      programming: {
        title: "Développement Logiciel",
        items: ["C", "C++", "C#", "Python", "Java"]
      },
      web: {
        title: "Technologies Web",
        items: [
          "HTML5 / CSS3 / JavaScript",
          "PHP Moderne",
          "React.js",
          "Vite",
          "Tailwind CSS",
          "Git",
          "GitHub",
          "Services Cloud"
        ]
      },
      embedded: {
        title: "IoT & Systèmes Embarqués",
        items: [
          "Développement Arduino",
          "Solutions ESP32",
          "Raspberry Pi",
          "Prototypage Rapide"
        ]
      },
      soft: {
        title: "Compétences Professionnelles",
        items: [
          "Leadership Stratégique & Gestion de Projet",
          "Collaboration Interfonctionnelle",
          "Formation Technique & Transfert de Connaissances",
          "Prise de Parole & Présentation",
          "Exécution Agile de Projet",
          "Optimisation & Planification des Ressources",
          "Engagement Communautaire & Impact",
          "Résolution Adaptative de Problèmes",
          "Apprentissage & Développement Continu"
        ]
      }
    },
    community: {
      title: "Impact Communautaire",
      description: "Depuis mes premières expériences, j'ai toujours appris le mieux en partageant. Au fil des années, j'ai été impliqué dans plusieurs initiatives locales et bénévoles qui m'ont aidé à grandir techniquement et personnellement.",
      activities: {
        robotics: {
          title: "Formateur en Robotique – AJIZ / AJSZ (2023)",
          description: "En 2023, j'ai dirigé des ateliers de robotique pour les jeunes à Zarzis. Je leur ai enseigné les bases de la programmation Arduino, le câblage des capteurs et des moteurs, et la logique embarquée. Ayant été formé à l'AJSZ between 2018 and 2020, je suis revenu comme formateur pour transmettre ce que j'avais appris."
        },
        injaz: {
          title: "Mentor Jeunesse – INJAZ Tunisia (2022)",
          description: "Grâce au programme d'entrepreneuriat d'INJAZ, j'ai aidé des équipes d'étudiants à transformer des idées en mini-projets structurés. Nous avons travaillé sur la résolution de problèmes, la validation d'idées et la présentation. Cette expérience a amélioré mes compétences d'enseignement et de facilitation."
        },
        jci: {
          title: "Membre Actif – JCI Zarzis (2021 – 2023)",
          description: "Entre 2021 et 2023, j'ai été un membre actif de JCI Zarzis. J'ai participé à des actions citoyennes, des campagnes de sensibilisation dans les écoles, des événements locaux et des programmes de solidarité. Mes contributions incluaient la communication visuelle, la logistique et la collaboration en groupe dans un environnement associatif structuré."
        },
        english: {
          title: "Membre Actif – English Fan Club ZZ (2020 – 2022)",
          description: "J'ai aidé à animer des discussions orales, des jeux de rôle et des sessions d'échange culturel en anglais. C'était un espace où nous pratiquions en toute confiance et nous soutenions mutuellement dans l'amélioration de nos compétences linguistiques."
        }
      },
      conclusion: "Ces expériences m'ont façonné autant que mon travail technique. Elles ont renforcé mes compétences douces : enseignement, communication, initiative, travail d'équipe et adaptabilité."
    },
    stats: {
      title: "📊 Réalisations",
      projects: "🔧 10+ Projets Innovants Livrés",
      medal: "🏅 Médaille d'Or – Congrès National IoT 2022",
      olympiad: "🧠 Top 50 Finaliste – Olympiade Nationale de Programmation 2022",
      experience: "💼 7+ Années d'Expérience Combinée"
    },
    timeline: {
      title: "⏳ Parcours Professionnel",
      intro: "Depuis mes débuts dans un club informatique en 2010 jusqu'à mes projets en IoT, j'ai construit mon parcours à travers des expériences concrètes, des initiatives personnelles, des concours et du bénévolat. Voici un aperçu chronologique de mon évolution technique et créative.",
      entries: {} // Will be populated from the English version
    },

    // Timeline Section
    timelineTitle: 'Mon parcours',
    journeyTitle: 'Mon parcours',
    timeline2018: 'Débuts en électronique',
    timeline2019: 'Ateliers robotiques avec AJSZ',
    timeline2020: 'Projet Smart Parking à Gabès',
    timeline2021: 'Expansion digitale - Web & Communauté',
    timeline2022: 'Médaille d\'or – Maison intelligente',
    timeline2023: 'ESP32 CallBox + Freelance UI/UX',
    timeline2024: 'Fondation de M&O Studio',

    // Projects Section
    projectsTitle: 'Projets Phares',
    projectsSubtitle: 'Une collection de mes travaux les plus impactants, des systèmes IoT aux applications web',
    viewGithub: 'Voir le Code',
    viewDemo: 'Démo Live',
    smartHomeDesc: 'Domotique basée sur IoT avec ESP32 et Firebase – Lauréat de la Médaille d\'Or',
    callboxDesc: 'Boîte SOS usine (SIM800L – email/SMS)',
    rallyCarDesc: 'Voiture robotique tout-terrain télécommandée',
    studioDesc: 'Studio de design de menus numériques et d\'interfaces web',

    // Contact Section
    contactTitle: "Créons Quelque Chose d'Extraordinaire",
    contactDesc: "Vous avez une idée ? Transformons-la en réalité ensemble",
    contactMe: 'Démarrer une Conversation',
    contactSuccess: 'Message reçu ! Je répondrai bientôt.',
    nameLabel: 'Nom',
    emailLabel: 'Email',
    messageLabel: 'Votre Message',
    sendMessage: 'Envoyer le Message',

    // Education Section
    educationTitle: 'Formation',
    bacInfo: 'Baccalauréat en Informatique',
    bacScores: 'Algorithme : 19/20, STI : 17/20',
    licenseIot: 'Licence en Ingénierie des Systèmes IoT',

    // Bio Section
    bioTitle: 'À Propos de Moi',
    bioSubtitle: 'Développeur IoT & Éducateur Tech de Tunisie',
    bioSkills: 'Compétences Clés',
    technologies: 'Technologies',
    iotDescription: 'Développement de solutions intelligentes et connectées utilisant ESP32, Arduino et divers capteurs.',
    roboticsDescription: 'Construction et programmation de robots autonomes pour diverses applications.',
    embeddedDescription: 'Création de systèmes embarqués fiables pour l\'automatisation et le contrôle.',
    uiuxDescription: 'Conception d\'interfaces utilisateur intuitives et belles pour applications web et mobile.',
    webdevDescription: 'Création d\'applications web modernes avec les dernières technologies.',
    teachingDescription: 'Animation d\'ateliers et de sessions de formation en robotique et électronique.',
    
    // Resume Section
    resumeTitle: 'Parcours Professionnel',
    resumeSubtitle: 'Formation & Expérience',
    downloadResume: 'Télécharger le CV Complet',
    education: 'Formation',
    experience: 'Expérience',
    skillsSection: 'Compétences',
    languages: 'Langues',
    
    // Certifications Section
    certificationsTitle: 'Certifications & Réalisations',
    certificationsSubtitle: 'Développement professionnel et reconnaissance des compétences à travers diverses certifications et récompenses',
    viewCertificate: 'Voir le Certificat',
    roboticsCerts: 'Robotique',
    educationCerts: 'Formation',
    softSkillsCerts: 'Compétences Douces & Certifications',

    // Other sections
    viewAll: 'Voir Tous les Projets',
    sourceCode: 'Code Source',
    viewProject: 'Voir le Projet',
    viewMoreProjects: 'Voir plus de projets sur GitHub',
    all: 'Tous les Projets',
    awardWinning: 'Projet Lauréat',
    notFoundTitle: 'Page non trouvée',
    notFoundMessage: "La page que vous recherchez n'existe pas ou a été déplacée.",
    goHome: "Retour à l'accueil",
    projectsPageTitle: 'Mes Projets',
    projectsPageIntro: "Depuis 2018, je développe des projets pratiques dans les domaines de l'IoT, des systèmes embarqués, de la robotique et du développement web. Ces projets ont été réalisés dans un cadre personnel, associatif, ou compétitif, et reflètent ma progression technique, mon autonomie, et ma volonté de créer des solutions utiles et concrètes.",
    projectsPageGithub: 'Voir tous les projets sur GitHub',
    projectsPageLinkedin: 'Me contacter sur LinkedIn',
    projectsPageContact: 'Me contacter',
    activities: 'Activités Bénévoles',
    name: 'Nom',
    email: 'Email',
    message: 'Message',
    responseTime: 'Temps de réponse',
    sending: 'Envoi en cours...',
    send: 'Envoyer',
    messageSent: 'Message envoyé avec succès !',
    messageError: 'Erreur lors de l\'envoi du message',
    tryAgainLater: 'Veuillez réessayer plus tard',
    tooManyAttempts: 'Trop de tentatives, veuillez réessayer plus tard',
    resume: 'CV',
    checkOutMore: 'Découvrez plus de mes travaux:',
    viewLinkedIn: 'Voir LinkedIn'
  },
  de: {
    // Navigation
    home: 'Startseite',
    about: 'Über mich',
    projects: 'Projekte',
    journey: 'Reise',
    contact: 'Kontakt',
    certifications: 'Zertifizierungen',
    allRightsReserved: 'Alle Rechte vorbehalten',
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus',

    // Hero Section
    intro: "Hallo, ich bin Omar Abouajaja",
    heroTitle: "Innovation an der Schnittstelle von IoT, Robotik und digitalem Design",
    heroSubtitle: "Seit 2018 verwandle ich Ideen in Realität — von Arduino-Prototypen bis hin zu verfeinerten UI/UX-Schnittstellen. Meine Reise umfasst eingebettete Systeme, Webentwicklung und kreatives Design, angetrieben durch Neugier und Leidenschaft für sinnvolle Lösungen. Ich bin stolz darauf, zu einflussreichen Tech-Communities wie Jeunes Sciences Zarzis, AJIZ, INJAZ Tunisia und JCI Zarzis beigetragen zu haben.",
    shortPitch: "Von einfachen Schaltkreisen zu komplexen Systemen, ich entwickle Technologie, die zählt.",
    exploreProjects: 'Projekte Entdecken',
    downloadCV: 'Lebenslauf Herunterladen',

    // Sections
    motivation: {
      title: "Was mich antreibt",
      description: "Ich glaube an die Kraft praktischer Innovation. Jedes Projekt ist eine Chance, echte Probleme zu lösen, Neues zu lernen und Wissen mit anderen zu teilen. Mein Ziel ist es, Technologie zu schaffen, die einen sinnvollen Unterschied im Leben der Menschen macht."
    },
    skills: {
      title: "Technische Expertise",
      design: {
        title: "Digitales Design",
        items: ["Figma", "Canva", "Adobe Photoshop", "Blender"]
      },
      programming: {
        title: "Softwareentwicklung",
        items: ["C", "C++", "C#", "Python", "Java"]
      },
      web: {
        title: "Webtechnologien",
        items: [
          "HTML5 / CSS3 / JavaScript",
          "Moderne PHP",
          "React.js",
          "Vite",
          "Tailwind CSS",
          "Git",
          "GitHub",
          "Cloud-Dienste"
        ]
      },
      embedded: {
        title: "IoT & Eingebettete Systeme",
        items: [
          "Arduino-Entwicklung",
          "Solutions ESP32",
          "Raspberry Pi",
          "Rapid Prototyping"
        ]
      },
      soft: {
        title: "Professionelle Fähigkeiten",
        items: [
          "Strategische Führung & Projektmanagement",
          "Funktionsübergreifende Teamarbeit",
          "Technische Schulung & Wissenstransfer",
          "Öffentliches Sprechen & Präsentation",
          "Agile Projektausführung",
          "Ressourcenoptimierung & Planung",
          "Gemeinschaftsengagement & Wirkung",
          "Adaptive Problemlösung",
          "Kontinuierliches Lernen & Entwicklung"
        ]
      }
    },
    community: {
      title: "Gemeinschaftsimpact",
      description: "Seit meinen frühesten Erfahrungen habe ich immer am besten durch Teilen gelernt. Au fil des Jahres war ich an mehreren lokalen und ehrenamtlichen Initiativen beteiligt, die mir geholfen haben, sowohl technisch als auch persönlich zu wachsen.",
      activities: {
        robotics: {
          title: "Robotik-Trainer – AJIZ / AJSZ (2023)",
          description: "2023 leitete ich Robotik-Workshops für Jugendliche in Zarzis. Ich unterrichtete sie in den Grundlagen der Arduino-Programmierung, dem Anschluss von Sensoren und Motoren sowie eingebetteter Logik. Nach meiner Ausbildung bei AJSZ between 2018 and 2020, kehrte ich als Trainer zurück, um weiterzugeben, was ich gelernt hatte."
        },
        injaz: {
          title: "Jugendmentor – INJAZ Tunisia (2022)",
          description: "Durch das Entrepreneurship-Programm von INJAZ, jahmte ich Studententeams dabei, Ideen in strukturierte Mini-Projekte umzuwandeln. Wir arbeiteten an Problemlösung, Ideenvalidierung und Präsentation. Diese Erfahrung verbesserte meine Lehr- und Moderationsfähigkeiten."
        },
        jci: {
          title: "Aktives Mitglied – JCI Zarzis (2021 – 2023)",
          description: "Between 2021 and 2023, jahte ich ein aktives Mitglied von JCI Zarzis. Ich nahm an bürgerorientierten Aktionen, Aufklärungskampagnen in Schulen, lokalen Veranstaltungen und Solidaritätsprogrammen teil. Meine Beiträge umfassten visuelle Kommunikation, Logistik und Gruppenarbeit in einer strukturierten Non-Profit-Umgebung."
        },
        english: {
          title: "Aktives Mitglied – English Fan Club ZZ (2020 – 2022)",
          description: "Ich half bei der Leitung mündlicher Diskussionen, Rollenspielen und kulturellen Austauschsitzungen in englischer Sprache. Es war ein Raum, in dem wir selbstbewusst übten und uns gegenseitig bei der Verbesserung unserer Sprachkenntnisse unterstützten."
        }
      },
      conclusion: "Diese Erfahrungen m'ont façonné autant als meine technische Arbeit. Sie stärkten meine Soft Skills: Lehren, Kommunikation, Initiative, Teamarbeit und Anpassungsfähigkeit."
    },
    stats: {
      title: "📊 Erfolge",
      projects: "🔧 10+ Innovative Projekte Abgeschlossen",
      medal: "🏅 Goldmedaille – Nationaler IoT-Kongress 2022",
      olympiad: "🧠 Top 50 Finalist – Nationale Programmierolympiade 2022",
      experience: "💼 7+ Jahre Gesamterfahrung"
    },
    timeline: {
      title: "⏳ Beruflicher Werdegang",
      intro: "Von meinen Anfängen in einem Computerclub 2010 bis zu meinen IoT-Projekten habe ich meinen Weg durch praktische Erfahrungen, persönliche Initiativen, Wettbewerbe und ehrenamtliches Engagement aufgebaut. Hier ist ein chronologischer Überblick über meine technische und kreative Entwicklung.",
      entries: {} // Will be populated from the English version
    },

    // Timeline Section
    timelineTitle: 'Beruflicher Werdegang',
    journeyTitle: 'Reise',
    timeline2018: 'Anfänge in der Elektronik',
    timeline2019: 'Robotik-Workshops mit AJSZ',
    timeline2020: 'Smart-Parking-Projekt in Gabès',
    timeline2021: 'Digital expansion - Web & Community',
    timeline2022: 'Goldmedaille - Smart Home',
    timeline2023: 'ESP32 CallBox + freelance UI/UX',
    timeline2024: 'Fondation von M&O Studio',

    // Projects Section
    projectsTitle: 'Ausgewählte Projekte',
    projectsSubtitle: 'Eine Sammlung meiner wirkungsvollsten Arbeiten, von IoT-Systemen bis zu Webanwendungen',
    viewGithub: 'Code Ansehen',
    viewDemo: 'Live Demo',
    smartHomeDesc: 'IoT-basierte Hausautomation mit ESP32 und Firebase - Lauréat de la Médaille d\'Or',
    callboxDesc: 'Industrielles Notfallgerät mit SIM800L für SMS/E-Mail-Benachrichtigungen',
    rallyCarDesc: 'Fernsteuerbare Offroad-Roboterauto',
    studioDesc: 'Digitales Menü und Web-UI-Design-Studio',

    // Contact Section
    contactTitle: "Lassen Sie uns etwas Großartiges erschaffen",
    contactDesc: "Haben Sie eine Idee? Lassen Sie uns sie gemeinsam verwirklichen",
    contactMe: 'Gespräch Starten',
    contactSuccess: 'Nachricht empfangen! Ich antworte in Kürze.',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    messageLabel: 'Nachricht',
    sendMessage: 'Nachricht Senden',

    // Education Section
    educationTitle: 'Ausbildung',
    bacInfo: 'Informatik-Abitur',
    bacScores: 'Algorithmus: 19/20, STI: 17/20',
    licenseIot: 'IoT-Systemtechnik-Lizenz',

    // Bio Section
    bioTitle: 'Über Mich',
    bioSubtitle: 'IoT-Entwickler & Tech-Educator aus Tunesien',
    bioSkills: 'Kernkompetenzen',
    technologies: 'Technologie-Stack',
    iotDescription: 'Entwicklung intelligenter vernetzter Lösungen mit modernster IoT-Technologie.',
    roboticsDescription: 'Entwicklung autonomer Robotersysteme für praktische Anwendungen.',
    embeddedDescription: 'Entwicklung zuverlässiger eingebetteter Systeme für Automatisierung und Steuerung.',
    uiuxDescription: 'Gestaltung intuitiver und ansprechender digitaler Erlebnisse.',
    webdevDescription: 'Entwicklung moderner Webanwendungen mit neuesten Technologien.',
    teachingDescription: 'Wissensvermittlung durch interaktive Workshops und Trainingssitzungen.',
    
    // Resume Section
    resumeTitle: 'Beruflicher Werdegang',
    resumeSubtitle: 'Education & Experience',
    downloadResume: 'Télécharger den vollständigen Lebenslauf',
    education: 'Ausbildung',
    experience: 'Erfahrung',
    skillsSection: 'Fähigkeiten',
    languages: 'Sprachen',
    
    // Certifications Section
    certificationsTitle: 'Zertifizierungen & Erfolge',
    certificationsSubtitle: 'Professionelle Entwicklung und Anerkennung von Fähigkeiten durch verschiedene Zertifizierungen und Auszeichnungen',
    viewCertificate: 'Zertifikat Ansehen',
    roboticsCerts: 'Robotik',
    educationCerts: 'Ausbildung',
    softSkillsCerts: 'Soft Skills & Zertifizierungen',

    // Other sections
    viewAll: 'Alle Projekte Ansehen',
    sourceCode: 'Quellcode',
    viewProject: 'Projekt Ansehen',
    viewMoreProjects: 'Weitere Projekte auf GitHub ansehen',
    all: 'Alle Projekte',
    awardWinning: 'Ausgezeichnetes Projekt',
    notFoundTitle: 'Seite nicht gefunden',
    notFoundMessage: 'Die angeforderte Seite existiert nicht oder wurde verschoben.',
    goHome: 'Zur Startseite',
    projectsPageTitle: 'Meine Projekte',
    projectsPageIntro: "Seit 2018, habe ich praxisnahe Projekte in den Bereichen IoT, Embedded Systems, Robotik und Webentwicklung realisiert. Diese Projekte wurden in persönlichen, wettbewerblichen oder gemeinschaftlichen Rahmen durchgeführt und spiegeln mein Wachstum, meine Neugier und meine Fähigkeit wider, Ideen in funktionierende Lösungen umzusetzen.",
    projectsPageGithub: 'Alle Projekte auf GitHub ansehen',
    projectsPageLinkedin: 'Kontakt aufnehmen',
    projectsPageContact: 'Kontakt aufnehmen',
    activities: 'Ehrenamtliche Aktivitäten',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    responseTime: 'Antwortzeit',
    sending: 'Wird gesendet...',
    send: 'Senden',
    messageSent: 'Nachricht erfolgreich gesendet!',
    messageError: 'Fehler beim Senden der Nachricht',
    tryAgainLater: 'Bitte versuchen Sie es später erneut',
    tooManyAttempts: 'Zu viele Versuche, bitte versuchen Sie es später erneut',
    resume: 'Lebenslauf',
    checkOutMore: 'Weitere meiner Arbeiten ansehen:',
    viewLinkedIn: 'LinkedIn anzeigen'
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'عني',
    projects: 'المشاريع',
    journey: 'رحلة',
    contact: 'اتصل',
    certifications: 'الشهادات',
    allRightsReserved: 'جميع الحقوق محفوظة',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',

    // Hero Section
    intro: "مرحباً، أنا عمر أبو عجاجة",
    heroTitle: "الابتكار في تقاطع إنترنت الأشياء والروبوتات والتصميم الرقمي",
    heroSubtitle: "منذ عام 2018، كنت أحول الأفكار إلى واقع — من نماذج Arduino الأولية إلى واجهات UI/UX المصقولة. تمتد رحلتي عبر الأنظمة المدمجة وتطوير الويب والتصميم الإبداعي، مدفوعة بالفضول وشغف بناء الحلول ذات المعنى. أنا فخور بمساهمتي في مجتمعات التكنولوجيا المؤثرة مثل Jeunes Sciences Zarzis, AJIZ, INJAZ Tunisia وJCI Zarzis.",
    shortPitch: "من الدوائر البسيطة إلى الأنظمة المعقدة، أنشئ تكنولوجيا ذات معنى.",
    exploreProjects: 'استكشف المشاريع',
    downloadCV: 'تحميل السيرة الذاتية',

    // Sections
    motivation: {
      title: "ما يدفعني",
      description: "أؤمن بقوة الابتكار العملي. كل مشروع هو فرصة لحل مشاكل حقيقية، وتعلم شيء جديد، ومشاركة المعرفة مع الآخرين. هدفي هو إنشاء تكنولوجيا تحدث فرقاً معنوياً في حياة الناس."
    },
    skills: {
      title: "الخبرة التقنية",
      design: {
        title: "التصميم الرقمي",
        items: ["Figma", "Canva", "Adobe Photoshop", "Blender"]
      },
      programming: {
        title: "تطوير البرمجيات",
        items: ["C", "C++", "C#", "Python", "Java"]
      },
      web: {
        title: "تقنيات الويب",
        items: [
          "HTML5 / CSS3 / JavaScript",
          "PHP الحديث",
          "React.js",
          "Vite",
          "Tailwind CSS",
          "Git",
          "GitHub",
          "خدمات السحابة"
        ]
      },
      embedded: {
        title: "IoT & Systèmes Embarqués",
        items: [
          "تطوير Arduino",
          "حلول ESP32",
          "Raspberry Pi",
          "النماذج الأولية السريعة"
        ]
      },
      soft: {
        title: "المهارات المهنية",
        items: [
          "القيادة الاستراتيجية وإدارة المشاريع",
          "التعاون بين الوظائف",
          "التدريب التقني ونقل المعرفة",
          "التحدث العام والعرض",
          "تنفيذ المشاريع الرشيق",
          "تحسين وتخطيط الموارد",
          "المشاركة المجتمعية والتأثير",
          "حل المشكلات التكيفي",
          "التعلم والتطوير المستمر"
        ]
      }
    },
    community: {
      title: "التأثير المجتمعي",
      description: "منذ تجاربي الأولى، كنت دائمًا أتعلم بشكل أفضل من خلال المشاركة. على مر السنين، شاركت في عدة مبادرات محلية وتطوعية ساعدتني على النمو تقنيًا وشخصيًا.",
      activities: {
        robotics: {
          title: "مدرب روبوتات – AJIZ / AJSZ (2023)",
          description: "في عام 2023، قُدت ورشات روبوتات لفائدة الشباب في جرجيس. علمتهم أساسيات برمجة Arduino، توصيل المستشعرات والمحركات، والمنطق المدمج. بعد أن تدربت في AJSZ بين 2018 و2020، عدت كمدرب لأشارك ما تعلمته."
        },
        injaz: {
          title: "موجه شباب – إنجاز تونس (2022)",
          description: "من خلال برنامج ريادة الأعمال التابع لـ INJAZ، ساعدت فرقًا من الطلاب على تحويل أفكارهم إلى مشاريع مصغرة منظمة. عملنا على حل المشكلات، والتحقق من صحة الأفكار، وتقديمها. عززت هذه التجربة مهاراتي في التيسير والتدريب."
        },
        jci: {
          title: "عضو نشط – JCI جرجيس (2021 – 2023)",
          description: "بين 2021 و2023، كنت عضوًا نشطًا في JCI جرجيس. شاركت في أعمال مواطنية، حملات توعوية في المدارس، فعاليات محلية وبرامج تضامنية. شملت مساهماتي التصميم المرئي، التنظيم اللوجستي، والعمل الجماعي في بيئة غير ربحية منظمة."
        },
        english: {
          title: "عضو نشط - English Fan Club ZZ (2020 – 2022)",
          description: "ساهمت في تنشيط حلقات النقاش، ألعاب الأدوار، وجلسات التبادل الثقافي باللغة الإنجليزية. كان فضاءً نمارس فيه اللغة بثقة وندعم بعضنا البعض لتحسين مهاراتنا."
        }
      },
      conclusion: "شكلت هذه التجارب شخصيتي بقدر ما شكلها عملي التقني. عززت مهاراتي الناعمة: التدريس، والتواصل، والمبادرة، والعمل الجماعي، والتكيف."
    },
    stats: {
      title: "📊 الإنجازات",
      projects: "🔧 10+ مشاريع مبتكرة تم تسليمها",
      medal: "🏅 الفائز بالميدالية الذهبية – المؤتمر الوطني لإنترنت الأشياء 2022",
      olympiad: "🧠 من أفضل 50 متأهل نهائي – الأولمبياد الوطني للبرمجة 2022",
      experience: "💼 7+ سنوات من الخبرة المجمعة"
    },
    timeline: {
      title: "⏳ المسار الزمني",
      intro: "من بداياتي في نادي الكمبيوتر في 2010 إلى مشاريعي في إنترنت الأشياء، بنيت مساري من خلال تجارب عملية، ومبادرات شخصية، ومسابقات، وتطوع. إليك نظرة زمنية على تطوري التقني والإبداعي.",
      entries: {} // Will be populated from the English version
    },
    timelineTitle: 'المسار الزمني',
    journeyTitle: 'رحلتي',
    timeline2018: 'بدايات في الإلكترونيات',
    timeline2019: 'ورش عمل الروبوتات مع AJSZ',
    timeline2020: 'مشروع موقف ذكي في قابس',
    timeline2021: 'توسع رقمي - تطوير الويب والمجتمع',
    timeline2022: 'ميدالية ذهبية - منزل ذكي',
    timeline2023: 'ESP32 CallBox + عمل حر في UI/UX',
    timeline2024: 'تأسيس M&O Studio',
    projectsTitle: 'مشاريع مميزة',
    projectsSubtitle: 'مجموعة من أعمالي الأكثر تأثيراً، من أنظمة المنزل الذكي إلى منصات الروبوتات التعليمية',
    viewGithub: 'عرض الكود',
    viewDemo: 'عرض حي',
    smartHomeDesc: 'أتمتة المنزل القائمة على إنترنت الأشياء مع ESP32 وFirebase - الفائز بالميدالية الذهبية',
    callboxDesc: 'جهاز طوارئ صناعي يستخدم SIM800L لتنبيهات SMS/البريد الإلكتروني',
    rallyCarDesc: 'سيارة روبوتية للطرق الوعرة يتم التحكم بها عن بعد',
    studioDesc: 'استوديو تصميم القوائم الرقمية وواجهات الويب',
    contactTitle: "دعنا نبتكر شيئاً مذهلاً",
    contactDesc: "لديك فكرة؟ دعنا نحولها إلى واقع معاً",
    contactMe: 'ابدأ محادثة',
    contactSuccess: 'تم استلام الرسالة! سأرد قريباً.',
    nameLabel: 'الاسم',
    emailLabel: 'البريد الإلكتروني',
    messageLabel: 'الرسالة',
    sendMessage: 'إرسال الرسالة',
    educationTitle: 'التعليم',
    bacInfo: 'بكالوريوس في علوم الكمبيوتر',
    bacScores: 'الخوارزميات: 19/20, STI: 17/20',
    licenseIot: 'رخصة هندسة أنظمة إنترنت الأشياء',
    bioTitle: 'عني',
    bioSubtitle: 'مطور إنترنت الأشياء ومربي تقني من تونس',
    bioSkills: 'الكفاءات الأساسية',
    technologies: 'المكدس التقني',
    iotDescription: 'إنشاء حلول ذكية متصلة مع تقنيات إنترنت الأشياء المتطورة.',
    roboticsDescription: 'تطوير أنظمة روبوتية مستقلة للتطبيقات الواقعية.',
    embeddedDescription: 'بناء أنظمة مدمجة موثوقة للأتمتة والتحكم.',
    uiuxDescription: 'تصميم تجارب رقمية بديهية وجذابة.',
    webdevDescription: 'تطوير تطبيقات ويب حديثة بأحدث التقنيات.',
    teachingDescription: 'مشاركة المعرفة من خلال ورش عمل وجلسات تدريب تفاعلية.',
    resumeTitle: 'المسار المهني',
    resumeSubtitle: 'التعليم والخبرة',
    downloadResume: 'تحميل السيرة الذاتية الكاملة',
    education: 'التعليم',
    experience: 'الخبرة',
    skillsSection: 'المهارات',
    languages: 'اللغات',
    certificationsTitle: 'الشهادات والإنجازات',
    certificationsSubtitle: 'التطوير المهني والاعتراف بالمهارات من خلال شهادات وجوائز متنوعة',
    viewCertificate: 'عرض الشهادة',
    roboticsCerts: 'الروبوتات',
    educationCerts: 'التعليم',
    softSkillsCerts: 'المهارات الناعمة والشهادات',
    viewAll: 'عرض جميع المشاريع',
    sourceCode: 'الكود المصدري',
    viewProject: 'عرض المشروع',
    viewMoreProjects: 'عرض المزيد من المشاريع على GitHub',
    all: 'جميع المشاريع',
    awardWinning: 'مشروع حائز على جائزة',
    notFoundTitle: 'الصفحة غير موجودة',
    notFoundMessage: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    goHome: 'العودة إلى الرئيسية',
    projectsPageTitle: 'المشاريع',
    projectsPageIntro: 'اكتشف مشاريعي المميزة في إنترنت الأشياء، الروبوتات، وتطوير الويب. من أنظمة المنزل الذكي إلى منصات الروبوتات التعليمية.',
    projectsPageGithub: 'ملف GitHub الشخصي',
    projectsPageLinkedin: 'ملف LinkedIn الشخصي',
    projectsPageContact: 'اتصل بي',
    activities: 'النشاطات التطوعية',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    message: 'الرسالة',
    responseTime: 'وقت الاستجابة',
    sending: 'جاري الإرسال...',
    send: 'إرسال',
    messageSent: 'تم إرسال الرسالة بنجاح!',
    messageError: 'خطأ في إرسال الرسالة',
    tryAgainLater: 'يرجى المحاولة مرة أخرى لاحقاً',
    tooManyAttempts: 'محاولات كثيرة جداً، يرجى المحاولة مرة أخرى لاحقاً',
    resume: 'السيرة الذاتية',
    checkOutMore: 'اكتشف المزيد من أعمالي:',
    viewLinkedIn: 'عرض LinkedIn'
  }
};

// Populate timeline entries for all languages
function populateTimelineEntries() {
  Object.keys(translations).forEach((lang) => {
    if (lang !== 'en') {
      translations[lang as Language].timeline.entries = translations.en.timeline.entries;
    }
  });
}

// Call the function to populate timeline entries
populateTimelineEntries();

export default translations; 