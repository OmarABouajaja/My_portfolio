import { TranslationContent, Translations } from '@/types/translations';

const translations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    journey: 'Journey',
    contact: 'Contact',
    certifications: 'Certifications',
    resume: 'Resume',
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
          title: "Facilitator – English Fan Club ZZ (2020 – 2022)",
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
      title: "⏳ Parcours Professionnel",
      intro: "Depuis mes débuts dans un club informatique en 2010 jusqu'à mes projets en IoT, j'ai construit mon parcours à travers des expériences concrètes, des initiatives personnelles, des concours et du bénévolat. Voici un aperçu chronologique de mon évolution technique et créative.",
      entries: {
        "2010": {
          fr: "Premiers pas – Club informatique pour enfants (CIIPEWEB)",
          en: "First steps – Children's Computer Club (CIIPEWEB)",
          description: {
            fr: "Découverte de l'informatique et des bases de la programmation",
            en: "Introduction to computing and programming basics"
          }
        },
        "2011-2013": {
          fr: "Activité hebdomadaire : découverte de logiciels éducatifs, clavier, logique, etc.",
          en: "Weekly sessions: typing, educational games, logical thinking",
          description: {
            fr: "Développement des compétences numériques fondamentales",
            en: "Development of fundamental digital skills"
          }
        },
        "2018": {
          fr: "Fondations – Maîtrise Arduino & Électronique",
          en: "Foundations – Arduino & Electronics Mastery",
          description: {
            fr: "Apprentissage des systèmes embarqués et de l'électronique",
            en: "Learning embedded systems and electronics"
          }
        },
        "2019": {
          fr: "Leadership – Ateliers robotiques Jeunes Sciences Zarzis",
          en: "Leadership – Robotics workshops (Jeunes Sciences Zarzis)",
          description: {
            fr: "Encadrement de jeunes dans la robotique et l'électronique",
            en: "Mentoring youth in robotics and electronics"
          }
        },
        "2020": {
          fr: "Innovation – Système Smart Parking à Gabès (foire régionale)",
          en: "Innovation – Smart Parking System (Gabès fair)",
          description: {
            fr: "Premier projet IoT complet avec reconnaissance de plaques",
            en: "First complete IoT project with license plate recognition"
          }
        },
        "2021": {
          fr: "Expansion digitale – Web & Communauté (HTML, CSS, JS)",
          en: "Digital expansion – Web & Community (HTML, CSS, JS)",
          description: {
            fr: "Développement web et engagement communautaire",
            en: "Web development and community engagement"
          }
        },
        "2022": {
          fr: "Reconnaissance – Médaille d'or Congrès National IoT",
          en: "Recognition – Gold Medal, National IoT Congress",
          description: {
            fr: "Projet de domotique intelligent primé au niveau national",
            en: "Award-winning smart home project at national level"
          }
        },
        "2022-2": {
          fr: "Olympiade – Classé Top 50 sur 3000 à l'Olympiade TOP (C++)",
          en: "Olympiad – Top 50 out of 3000, TOP Programming Olympiad (C++)",
          description: {
            fr: "Excellence en programmation compétitive",
            en: "Excellence in competitive programming"
          }
        },
        "2023": {
          fr: "Innovation – ESP32 CallBox (alerte industrielle + interface web)",
          en: "Innovation – ESP32 CallBox (industrial alert + web interface)",
          description: {
            fr: "Système d'alerte industriel connecté",
            en: "Connected industrial alert system"
          }
        },
        "2023-2": {
          fr: "Bénévolat – Formateur Robotique chez AJIZ/AJSZ",
          en: "Volunteer – Robotics Instructor at AJIZ/AJSZ",
          description: {
            fr: "Formation des jeunes aux technologies émergentes",
            en: "Training youth in emerging technologies"
          }
        },
        "2024": {
          fr: "Entrepreneuriat – Co-fondateur de M&O Studio (menus digitaux / UI design / intégration web)",
          en: "Entrepreneurship – Co-founder of M&O Studio (digital menus / UI design / web integration)",
          description: {
            fr: "Lancement d'une entreprise de design numérique",
            en: "Launching a digital design company"
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
    timeline2022: 'Gold Medal – Smart Home IoT project',
    timeline2023: 'ESP32 CallBox + freelance UI/UX work',
    timeline2024: 'Co-founded M&O Studio',
    journeySubtitle: 'A passion for innovation growing since 2018',

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
    activities: 'Volunteer Activities',

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
    projectsPageContact: 'Contact me'
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
    journey: 'Parcours',
    contact: 'Contact',
    certifications: 'Certifications',
    resume: 'CV',
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
          description: "En 2023, j'ai dirigé des ateliers de robotique pour les jeunes à Zarzis. Je leur ai enseigné les bases de la programmation Arduino, le câblage des capteurs et des moteurs, et la logique embarquée. Ayant été formé à l'AJSZ entre 2018 et 2020, je suis revenu comme formateur pour transmettre ce que j'avais appris."
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
          title: "Facilitateur – English Fan Club ZZ (2020 – 2022)",
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
      entries: {
        "2010": {
          fr: "Premiers pas – Club informatique pour enfants (CIIPEWEB)",
          en: "First steps – Children's Computer Club (CIIPEWEB)",
          description: {
            fr: "Découverte de l'informatique et des bases de la programmation",
            en: "Introduction to computing and programming basics"
          }
        },
        "2011-2013": {
          fr: "Activité hebdomadaire : découverte de logiciels éducatifs, clavier, logique, etc.",
          en: "Weekly sessions: typing, educational games, logical thinking",
          description: {
            fr: "Développement des compétences numériques fondamentales",
            en: "Development of fundamental digital skills"
          }
        },
        "2018": {
          fr: "Fondations – Maîtrise Arduino & Électronique",
          en: "Foundations – Arduino & Electronics Mastery",
          description: {
            fr: "Apprentissage des systèmes embarqués et de l'électronique",
            en: "Learning embedded systems and electronics"
          }
        },
        "2019": {
          fr: "Leadership – Ateliers robotiques Jeunes Sciences Zarzis",
          en: "Leadership – Robotics workshops (Jeunes Sciences Zarzis)",
          description: {
            fr: "Encadrement de jeunes dans la robotique et l'électronique",
            en: "Mentoring youth in robotics and electronics"
          }
        },
        "2020": {
          fr: "Innovation – Système Smart Parking à Gabès (foire régionale)",
          en: "Innovation – Smart Parking System (Gabès fair)",
          description: {
            fr: "Premier projet IoT complet avec reconnaissance de plaques",
            en: "First complete IoT project with license plate recognition"
          }
        },
        "2021": {
          fr: "Expansion digitale – Web & Communauté (HTML, CSS, JS)",
          en: "Digital expansion – Web & Community (HTML, CSS, JS)",
          description: {
            fr: "Développement web et engagement communautaire",
            en: "Web development and community engagement"
          }
        },
        "2022": {
          fr: "Reconnaissance – Médaille d'or Congrès National IoT",
          en: "Recognition – Gold Medal, National IoT Congress",
          description: {
            fr: "Projet de domotique intelligent primé au niveau national",
            en: "Award-winning smart home project at national level"
          }
        },
        "2022-2": {
          fr: "Olympiade – Classé Top 50 sur 3000 à l'Olympiade TOP (C++)",
          en: "Olympiad – Top 50 out of 3000, TOP Programming Olympiad (C++)",
          description: {
            fr: "Excellence en programmation compétitive",
            en: "Excellence in competitive programming"
          }
        },
        "2023": {
          fr: "Innovation – ESP32 CallBox (alerte industrielle + interface web)",
          en: "Innovation – ESP32 CallBox (industrial alert + web interface)",
          description: {
            fr: "Système d'alerte industriel connecté",
            en: "Connected industrial alert system"
          }
        },
        "2023-2": {
          fr: "Bénévolat – Formateur Robotique chez AJIZ/AJSZ",
          en: "Volunteer – Robotics Instructor at AJIZ/AJSZ",
          description: {
            fr: "Formation des jeunes aux technologies émergentes",
            en: "Training youth in emerging technologies"
          }
        },
        "2024": {
          fr: "Entrepreneuriat – Co-fondateur de M&O Studio (menus digitaux / UI design / intégration web)",
          en: "Entrepreneurship – Co-founder of M&O Studio (digital menus / UI design / web integration)",
          description: {
            fr: "Lancement d'une entreprise de design numérique",
            en: "Launching a digital design company"
          }
        }
      }
    },

    // Timeline Section
    timelineTitle: 'Mon Parcours',
    journeyTitle: 'Mon Parcours',
    timeline2018: 'Débuts en électronique',
    timeline2019: 'Ateliers robotiques avec AJSZ',
    timeline2020: 'Projet Smart Parking à Gabès',
    timeline2022: 'Médaille d\'or – Maison intelligente',
    timeline2023: 'ESP32 CallBox + Freelance UI/UX',
    timeline2024: 'Fondation de M&O Studio',
    journeySubtitle: 'Une passion pour l\'innovation qui grandit depuis 2018',

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
    activities: 'Activités Bénévoles',

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
    goHome: 'Retour à l\'accueil',
    projectsPageTitle: 'Mes Projets',
    projectsPageIntro: "Depuis 2018, je développe des projets pratiques dans les domaines de l'IoT, des systèmes embarqués, de la robotique et du développement web. Ces projets ont été réalisés dans un cadre personnel, associatif, ou compétitif, et reflètent ma progression technique, mon autonomie, et ma volonté de créer des solutions utiles et concrètes.",
    projectsPageGithub: 'Voir tous les projets sur GitHub',
    projectsPageLinkedin: 'Me contacter sur LinkedIn',
    projectsPageContact: 'Me contacter'
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'عني',
    projects: 'المشاريع',
    journey: 'رحلة',
    contact: 'اتصل',
    certifications: 'الشهادات',
    resume: 'السيرة الذاتية',
    allRightsReserved: 'جميع الحقوق محفوظة',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',

    // Hero Section
    intro: "مرحباً، أنا عمر أبو عجاجة",
    heroTitle: "الابتكار في تقاطع إنترنت الأشياء والروبوتات والتصميم الرقمي",
    heroSubtitle: "منذ عام 2018، كنت أحول الأفكار إلى واقع — من نماذج Arduino الأولية إلى واجهات UI/UX المصقولة. تمتد رحلتي عبر الأنظمة المدمجة وتطوير الويب والتصميم الإبداعي، مدفوعة بالفضول وشغف بناء الحلول ذات المعنى. أنا فخور بمساهمتي في مجتمعات التكنولوجيا المؤثرة مثل Jeunes Sciences Zarzis وAJIZ وINJAZ Tunisia وJCI Zarzis.",
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
        title: "إنترنت الأشياء والأنظمة المدمجة",
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
      description: "منذ تجاربي الأولى، كنت دائماً أتعلم بشكل أفضل من خلال المشاركة. على مر السنين، شاركت في العديد من المبادرات المحلية والتطوعية التي ساعدتني على النمو تقنياً وشخصياً.",
      activities: {
        robotics: {
          title: "مدرب روبوتات – AJIZ / AJSZ (2023)",
          description: "في عام 2023، قمت بتوجيه ورش عمل الروبوتات للشباب في جرجيس. علمتهم أساسيات برمجة Arduino، وتوصيل المستشعرات والمحركات، والمنطق المدمج. بعد تدريبي في AJSZ بين عامي 2018 و2020، عدت كمدرب لإعادة ما تعلمته."
        },
        injaz: {
          title: "مرشد شباب – INJAZ Tunisia (2022)",
          description: "من خلال برنامج ريادة الأعمال في INJAZ، ساعدت فرق الطلاب على تحويل الأفكار إلى مشاريع مصغرة منظمة. عملنا على حل المشكلات، والتحقق من صحة الأفكار، والعرض. حسنت هذه التجربة مهاراتي في التدريب والتيسير."
        },
        jci: {
          title: "عضو نشط – JCI Zarzis (2021 – 2023)",
          description: "بين عامي 2021 و2023، كنت عضواً نشطاً في JCI Zarzis. شاركت في إجراءات موجهة للمواطنين، وحملات توعية في المدارس، وفعاليات محلية، وبرامج تضامن. شملت مساهماتي التواصل المرئي، والخدمات اللوجستية، والتعاون الجماعي في بيئة غير ربحية منظمة."
        },
        english: {
          title: "ميسر – English Fan Club ZZ (2020 – 2022)",
          description: "ساعدت في قيادة المناقشات الشفوية، وتمثيل الأدوار، وجلسات التبادل الثقافي باللغة الإنجليزية. كانت مساحة حيث مارسنا بثقة ودعمنا بعضنا البعض في تحسين مهارات اللغة."
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
      title: "⏳ المسار المهني",
      intro: "من بداياتي في نادي الكمبيوتر في 2010 إلى مشاريعي في إنترنت الأشياء، بنيت مساري من خلال تجارب عملية، ومبادرات شخصية، ومسابقات، وتطوع. إليك نظرة زمنية على تطوري التقني والإبداعي.",
      entries: {
        "2010": {
          fr: "Premiers pas – Club informatique pour enfants (CIIPEWEB)",
          en: "First steps – Children's Computer Club (CIIPEWEB)",
          description: {
            fr: "Découverte de l'informatique et des bases de la programmation",
            en: "Introduction to computing and programming basics"
          }
        },
        "2011-2013": {
          fr: "Activité hebdomadaire : découverte de logiciels éducatifs, clavier, logique, etc.",
          en: "Weekly sessions: typing, educational games, logical thinking",
          description: {
            fr: "Développement des compétences numériques fondamentales",
            en: "Development of fundamental digital skills"
          }
        },
        "2018": {
          fr: "Fondations – Maîtrise Arduino & Électronique",
          en: "Foundations – Arduino & Electronics Mastery",
          description: {
            fr: "Apprentissage des systèmes embarqués et de l'électronique",
            en: "Learning embedded systems and electronics"
          }
        },
        "2019": {
          fr: "Leadership – Ateliers robotiques Jeunes Sciences Zarzis",
          en: "Leadership – Robotics workshops (Jeunes Sciences Zarzis)",
          description: {
            fr: "Encadrement de jeunes dans la robotique et l'électronique",
            en: "Mentoring youth in robotics and electronics"
          }
        },
        "2020": {
          fr: "Innovation – Système Smart Parking à Gabès (foire régionale)",
          en: "Innovation – Smart Parking System (Gabès fair)",
          description: {
            fr: "Premier projet IoT complet avec reconnaissance de plaques",
            en: "First complete IoT project with license plate recognition"
          }
        },
        "2021": {
          fr: "Expansion digitale – Web & Communauté (HTML, CSS, JS)",
          en: "Digital expansion – Web & Community (HTML, CSS, JS)",
          description: {
            fr: "Développement web et engagement communautaire",
            en: "Web development and community engagement"
          }
        },
        "2022": {
          fr: "Reconnaissance – Médaille d'or Congrès National IoT",
          en: "Recognition – Gold Medal, National IoT Congress",
          description: {
            fr: "Projet de domotique intelligent primé au niveau national",
            en: "Award-winning smart home project at national level"
          }
        },
        "2022-2": {
          fr: "Olympiade – Classé Top 50 sur 3000 à l'Olympiade TOP (C++)",
          en: "Olympiad – Top 50 out of 3000, TOP Programming Olympiad (C++)",
          description: {
            fr: "Excellence en programmation compétitive",
            en: "Excellence in competitive programming"
          }
        },
        "2023": {
          fr: "Innovation – ESP32 CallBox (alerte industrielle + interface web)",
          en: "Innovation – ESP32 CallBox (industrial alert + web interface)",
          description: {
            fr: "Système d'alerte industriel connecté",
            en: "Connected industrial alert system"
          }
        },
        "2023-2": {
          fr: "Bénévolat – Formateur Robotique chez AJIZ/AJSZ",
          en: "Volunteer – Robotics Instructor at AJIZ/AJSZ",
          description: {
            fr: "Formation des jeunes aux technologies émergentes",
            en: "Training youth in emerging technologies"
          }
        },
        "2024": {
          fr: "Entrepreneuriat – Co-fondateur de M&O Studio (menus digitaux / UI design / intégration web)",
          en: "Entrepreneurship – Co-founder of M&O Studio (digital menus / UI design / web integration)",
          description: {
            fr: "Lancement d'une entreprise de design numérique",
            en: "Launching a digital design company"
          }
        }
      }
    },

    // Projects Section
    projectsTitle: 'مشاريع مميزة',
    projectsSubtitle: 'مجموعة من أعمالي الأكثر تأثيراً، من أنظمة إنترنت الأشياء إلى تطبيقات الويب',
    viewGithub: 'عرض الكود',
    viewDemo: 'عرض حي',
    smartHomeDesc: 'أتمتة المنزل القائمة على إنترنت الأشياء مع ESP32 وFirebase - الفائز بالميدالية الذهبية',
    callboxDesc: 'جهاز طوارئ صناعي يستخدم SIM800L لتنبيهات SMS/البريد الإلكتروني',
    rallyCarDesc: 'سيارة روبوتية للطرق الوعرة يتم التحكم بها عن بعد',
    studioDesc: 'استوديو تصميم القوائم الرقمية وواجهات الويب',

    // Contact Section
    contactTitle: "دعنا نبتكر شيئاً مذهلاً",
    contactDesc: "لديك فكرة؟ دعنا نحولها إلى واقع معاً",
    contactMe: 'ابدأ محادثة',
    contactSuccess: 'تم استلام الرسالة! سأرد قريباً.',
    nameLabel: 'الاسم',
    emailLabel: 'البريد الإلكتروني',
    messageLabel: 'رسالتك',
    sendMessage: 'إرسال الرسالة',

    // Education Section
    educationTitle: 'التعليم',
    bacInfo: 'بكالوريوس في علوم الكمبيوتر',
    bacScores: 'الخوارزميات: 19/20, STI: 17/20',
    licenseIot: 'رخصة هندسة أنظمة إنترنت الأشياء',
    activities: 'الأنشطة التطوعية',

    // Bio Section
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
    
    // Resume Section
    resumeTitle: 'المسار المهني',
    resumeSubtitle: 'التعليم والخبرة',
    downloadResume: 'تحميل السيرة الذاتية الكاملة',
    education: 'التعليم',
    experience: 'الخبرة',
    skillsSection: 'المهارات',
    languages: 'اللغات',
    
    // Certifications Section
    certificationsTitle: 'الشهادات والإنجازات',
    certificationsSubtitle: 'التطوير المهني والاعتراف بالمهارات من خلال شهادات وجوائز متنوعة',
    viewCertificate: 'عرض الشهادة',
    roboticsCerts: 'الروبوتات',
    educationCerts: 'التعليم',
    softSkillsCerts: 'المهارات الناعمة والشهادات',

    // Other sections
    viewAll: 'عرض جميع المشاريع',
    sourceCode: 'الكود المصدري',
    viewProject: 'عرض المشروع',
    viewMoreProjects: 'عرض المزيد من المشاريع على GitHub',
    all: 'جميع المشاريع',
    awardWinning: 'مشروع حائز على جائزة',
    notFoundTitle: 'الصفحة غير موجودة',
    notFoundMessage: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    goHome: 'العودة إلى الرئيسية',
    projectsPageTitle: 'مشاريعي',
    projectsPageIntro: "منذ عام 2018، أنشأت مشاريع عملية في إنترنت الأشياء والأنظمة المدمجة والروبوتات وتطوير الويب. تم تنفيذ هذه المشاريع في بيئات شخصية أو تنافسية أو مجتمعية، وتعكس نموي وفضولي وقدرتي على تحويل الأفكار إلى حلول عملية.",
    projectsPageGithub: 'عرض جميع المشاريع على GitHub',
    projectsPageLinkedin: 'تواصل معي على LinkedIn',
    projectsPageContact: 'اتصل بي'
  },
  de: {
    // Navigation
    home: 'Startseite',
    about: 'Über Mich',
    projects: 'Projekte',
    journey: 'Reise',
    contact: 'Kontakt',
    certifications: 'Zertifizierungen',
    resume: 'Lebenslauf',
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
          "ESP32-Lösungen",
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
      description: "Seit meinen frühesten Erfahrungen habe ich immer am besten durch Teilen gelernt. Im Laufe der Jahre war ich an mehreren lokalen und ehrenamtlichen Initiativen beteiligt, die mir geholfen haben, sowohl technisch als auch persönlich zu wachsen.",
      activities: {
        robotics: {
          title: "Robotik-Trainer – AJIZ / AJSZ (2023)",
          description: "2023 leitete ich Robotik-Workshops für Jugendliche in Zarzis. Ich unterrichtete sie in den Grundlagen der Arduino-Programmierung, dem Anschluss von Sensoren und Motoren sowie eingebetteter Logik. Nach meiner Ausbildung bei AJSZ zwischen 2018 und 2020 kehrte ich als Trainer zurück, um weiterzugeben, was ich gelernt hatte."
        },
        injaz: {
          title: "Jugendmentor – INJAZ Tunisia (2022)",
          description: "Durch das Entrepreneurship-Programm von INJAZ half ich Studententeams dabei, Ideen in strukturierte Mini-Projekte umzuwandeln. Wir arbeiteten an Problemlösung, Ideenvalidierung und Präsentation. Diese Erfahrung verbesserte meine Lehr- und Moderationsfähigkeiten."
        },
        jci: {
          title: "Aktives Mitglied – JCI Zarzis (2021 – 2023)",
          description: "Zwischen 2021 und 2023 war ich aktives Mitglied von JCI Zarzis. Ich beteiligte mich an bürgerorientierten Aktionen, Aufklärungskampagnen in Schulen, lokalen Veranstaltungen und Solidaritätsprogrammen. Meine Beiträge umfassten visuelle Kommunikation, Logistik und Gruppenarbeit in einer strukturierten Non-Profit-Umgebung."
        },
        english: {
          title: "Moderator – English Fan Club ZZ (2020 – 2022)",
          description: "Ich half bei der Leitung mündlicher Diskussionen, Rollenspielen und kulturellen Austauschsitzungen auf Englisch. Es war ein Raum, in dem wir selbstbewusst übten und uns gegenseitig bei der Verbesserung unserer Sprachkenntnisse unterstützten."
        }
      },
      conclusion: "Diese Erfahrungen haben mich ebenso geprägt wie meine technische Arbeit. Sie stärkten meine Soft Skills: Lehren, Kommunikation, Initiative, Teamarbeit und Anpassungsfähigkeit."
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
      entries: {
        "2010": {
          fr: "Premiers pas – Club informatique pour enfants (CIIPEWEB)",
          en: "First steps – Children's Computer Club (CIIPEWEB)",
          description: {
            fr: "Découverte de l'informatique et des bases de la programmation",
            en: "Introduction to computing and programming basics"
          }
        },
        "2011-2013": {
          fr: "Activité hebdomadaire : découverte de logiciels éducatifs, clavier, logique, etc.",
          en: "Weekly sessions: typing, educational games, logical thinking",
          description: {
            fr: "Développement des compétences numériques fondamentales",
            en: "Development of fundamental digital skills"
          }
        },
        "2018": {
          fr: "Fondations – Maîtrise Arduino & Électronique",
          en: "Foundations – Arduino & Electronics Mastery",
          description: {
            fr: "Apprentissage des systèmes embarqués et de l'électronique",
            en: "Learning embedded systems and electronics"
          }
        },
        "2019": {
          fr: "Leadership – Ateliers robotiques Jeunes Sciences Zarzis",
          en: "Leadership – Robotics workshops (Jeunes Sciences Zarzis)",
          description: {
            fr: "Encadrement de jeunes dans la robotique et l'électronique",
            en: "Mentoring youth in robotics and electronics"
          }
        },
        "2020": {
          fr: "Innovation – Système Smart Parking à Gabès (foire régionale)",
          en: "Innovation – Smart Parking System (Gabès fair)",
          description: {
            fr: "Premier projet IoT complet avec reconnaissance de plaques",
            en: "First complete IoT project with license plate recognition"
          }
        },
        "2021": {
          fr: "Expansion digitale – Web & Communauté (HTML, CSS, JS)",
          en: "Digital expansion – Web & Community (HTML, CSS, JS)",
          description: {
            fr: "Développement web et engagement communautaire",
            en: "Web development and community engagement"
          }
        },
        "2022": {
          fr: "Reconnaissance – Médaille d'or Congrès National IoT",
          en: "Recognition – Gold Medal, National IoT Congress",
          description: {
            fr: "Projet de domotique intelligent primé au niveau national",
            en: "Award-winning smart home project at national level"
          }
        },
        "2022-2": {
          fr: "Olympiade – Classé Top 50 sur 3000 à l'Olympiade TOP (C++)",
          en: "Olympiad – Top 50 out of 3000, TOP Programming Olympiad (C++)",
          description: {
            fr: "Excellence en programmation compétitive",
            en: "Excellence in competitive programming"
          }
        },
        "2023": {
          fr: "Innovation – ESP32 CallBox (alerte industrielle + interface web)",
          en: "Innovation – ESP32 CallBox (industrial alert + web interface)",
          description: {
            fr: "Système d'alerte industriel connecté",
            en: "Connected industrial alert system"
          }
        },
        "2023-2": {
          fr: "Bénévolat – Formateur Robotique chez AJIZ/AJSZ",
          en: "Volunteer – Robotics Instructor at AJIZ/AJSZ",
          description: {
            fr: "Formation des jeunes aux technologies émergentes",
            en: "Training youth in emerging technologies"
          }
        },
        "2024": {
          fr: "Entrepreneuriat – Co-fondateur de M&O Studio (menus digitaux / UI design / intégration web)",
          en: "Entrepreneurship – Co-founder of M&O Studio (digital menus / UI design / web integration)",
          description: {
            fr: "Lancement d'une entreprise de design numérique",
            en: "Launching a digital design company"
          }
        }
      }
    },

    // Projects Section
    projectsTitle: 'Ausgewählte Projekte',
    projectsSubtitle: 'Eine Sammlung meiner wirkungsvollsten Arbeiten, von IoT-Systemen bis zu Webanwendungen',
    viewGithub: 'Code Ansehen',
    viewDemo: 'Live Demo',
    smartHomeDesc: 'IoT-basierte Hausautomation mit ESP32 und Firebase - Goldmedaillen-Gewinner',
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
    messageLabel: 'Ihre Nachricht',
    sendMessage: 'Nachricht Senden',

    // Education Section
    educationTitle: 'Ausbildung',
    bacInfo: 'Informatik-Abitur',
    bacScores: 'Algorithmus: 19/20, STI: 17/20',
    licenseIot: 'IoT-Systemtechnik-Lizenz',
    activities: 'Ehrenamtliche Aktivitäten',

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
    resumeSubtitle: 'Ausbildung & Erfahrung',
    downloadResume: 'Vollständigen Lebenslauf Herunterladen',
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
    projectsPageIntro: "Seit 2018 realisiere ich praxisnahe Projekte in den Bereichen IoT, Embedded Systems, Robotik und Webentwicklung. Diese Projekte entstanden im privaten, wettbewerblichen oder gemeinschaftlichen Rahmen und spiegeln mein Wachstum, meine Neugier und meine Fähigkeit wider, Ideen in funktionierende Lösungen umzusetzen.",
    projectsPageGithub: 'Alle Projekte auf GitHub ansehen',
    projectsPageLinkedin: 'Auf LinkedIn vernetzen',
    projectsPageContact: 'Kontakt aufnehmen'
  }
};

export default translations; 