import type { Language } from '@/types/translations';

export type Category = 'all' | 'iot' | 'embedded' | 'robotics' | 'web';

export interface Project {
  id: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  stack: string[];
  category: Category;
  award?: string;
  year: number;
  image: string;
  github?: string;
  demo?: string;
}

export interface CategoryOption {
  value: Category;
  label: Record<Language, string>;
}

export const categories: CategoryOption[] = [
  { value: "all", label: { en: "All Projects", fr: "Tous les Projets", ar: "جميع المشاريع", de: "Alle Projekte", es: "Todos los proyectos" } },
  { value: "iot", label: { en: "IoT", fr: "IoT", ar: "إنترنت الأشياء", de: "IoT", es: "IoT" } },
  { value: "embedded", label: { en: "Embedded", fr: "Embarqué", ar: "الأنظمة المدمجة", de: "Eingebettete Systeme", es: "Sistemas embebidos" } },
  { value: "robotics", label: { en: "Robotics", fr: "Robotique", ar: "الروبوتات", de: "Robotik", es: "Robótica" } },
  { value: "web", label: { en: "Web Development", fr: "Développement Web", ar: "تطوير الويب", de: "Webentwicklung", es: "Desarrollo web" } }
];

export const projects: Project[] = [
  {
    id: 1,
    title: {
      en: "Smart Home System",
      fr: "Smart Home System",
      ar: "نظام المنزل الذكي",
      de: "Smart Home System",
      es: "Sistema de Hogar Inteligente"
    },
    description: {
      en: "A full home automation system awarded at the National IoT Congress. Allows remote control of lights, motion detection, alerts and energy monitoring.",
      fr: "Système domotique complet primé au Congrès national IoT. Il permet de gérer à distance l'éclairage, la détection de mouvement, les alertes, et la consommation énergétique.",
      ar: "نظام أتمتة منزلية كامل حائز على جائزة في المؤتمر الوطني لإنترنت الأشياء. يتيح التحكم عن بعد في الإضاءة، واكتشاف الحركة، والتنبيهات، ومراقبة الطاقة.",
      de: "Ein komplettes Hausautomationssystem, ausgezeichnet beim Nationalen IoT-Kongress. Ermöglicht Fernsteuerung von Licht, Bewegungserkennung, Alarme und Energiemonitoring.",
      es: "Un sistema completo de automatización del hogar premiado en el Congreso Nacional de IoT. Permite el control remoto de luces, detección de movimiento, alertas y monitoreo energético."
    },
    stack: ["ESP32", "Firebase", "MQTT", "React Native"],
    category: "iot",
    award: "National IoT Congress",
    year: 2022,
    image: "/projects/smart-home.jpg",
    github: "https://github.com/OmarABouajaja/Projects/tree/main/SmartHome",
    demo: "https://github.com/OmarABouajaja/Projects/tree/main/SmartHome#demo"
  },
  {
    id: 2,
    title: {
      en: "ESP32 CallBox",
      fr: "ESP32 CallBox",
      ar: "صندوق الطوارئ الصناعي ESP32",
      de: "ESP32 CallBox",
      es: "ESP32 CallBox"
    },
    description: {
      en: "An industrial emergency box that sends SMS and email alerts using a SIM800L module. Logs critical events and auto-reboots when needed.",
      fr: "Boîtier d'assistance pour environnements industriels. Il envoie des alertes par SMS ou email via SIM800L, journalise les erreurs, et redémarre automatiquement le système si nécessaire.",
      ar: "صندوق طوارئ صناعي يرسل تنبيهات عبر الرسائل القصيرة والبريد الإلكتروني باستخدام وحدة SIM800L. يسجل الأحداث الحرجة ويعيد التشغيل تلقائيًا عند الحاجة.",
      de: "Industrielle Notrufbox, die SMS- und E-Mail-Benachrichtigungen über ein SIM800L-Modul sendet. Protokolliert kritische Ereignisse und startet bei Bedarf automatisch neu.",
      es: "Caja de emergencia industrial que envía alertas por SMS y correo electrónico usando un módulo SIM800L. Registra eventos críticos y se reinicia automáticamente cuando es necesario."
    },
    stack: ["ESP32", "SIM800L", "PHP", "C", "Firebase"],
    category: "embedded",
    year: 2023,
    image: "/projects/callbox.jpg",
    github: "https://github.com/OmarABouajaja/Projects/tree/main/ESP32-CallBox",
    demo: "https://github.com/OmarABouajaja/Projects/tree/main/ESP32-CallBox#demo"
  },
  {
    id: 3,
    title: {
      en: "Rally RC Car",
      fr: "Voiture RC Rally",
      ar: "سيارة روبوتية للطرق الوعرة",
      de: "Rally RC Car",
      es: "Coche Robótico Todoterreno"
    },
    description: {
      en: "Remote-controlled robotic car with GPS, obstacle detection and live video. Built as part of an off-road robotics challenge.",
      fr: "Voiture robotique pilotable à distance, avec détection d'obstacles, GPS embarqué et streaming vidéo. Projet développé dans le cadre d'un concours robotique tout-terrain.",
      ar: "سيارة روبوتية يتم التحكم بها عن بعد مع GPS واكتشاف العقبات وبث فيديو مباشر. تم بناؤها كجزء من تحدي الروبوتات للطرق الوعرة.",
      de: "Ferngesteuertes Roboterauto mit GPS, Hinderniserkennung und Live-Video. Entwickelt für eine Offroad-Robotik-Challenge.",
      es: "Coche robótico todoterreno controlado a distancia con GPS, detección de obstáculos y video en vivo. Construido como parte de un desafío de robótica."
    },
    stack: ["Arduino", "Raspberry Pi", "OpenCV", "C++"],
    category: "robotics",
    year: 2023,
    image: "/projects/rc-car.jpg",
    github: "https://github.com/OmarABouajaja/Projects/tree/main/Rally-RC-Car",
    demo: "https://github.com/OmarABouajaja/Projects/tree/main/Rally-RC-Car#demo"
  },
  {
    id: 4,
    title: {
      en: "Smart Parking",
      fr: "Parking Intelligent",
      ar: "موقف سيارات ذكي",
      de: "Smart Parking",
      es: "Aparcamiento Inteligente"
    },
    description: {
      en: "Parking management system using LDR sensors, LCD display and servos. Presented at the Gabès regional science fair.",
      fr: "Système de détection de places de stationnement avec capteurs LDR, servo-moteurs et affichage LCD. Présenté à la foire régionale de Gabès.",
      ar: "نظام إدارة مواقف السيارات باستخدام مستشعرات LDR وشاشة LCD وسيرفو. تم عرضه في معرض قابس العلمي الإقليمي.",
      de: "Parkraummanagementsystem mit LDR-Sensoren, LCD-Anzeige und Servos. Präsentiert auf der Gabès Regionalmesse.",
      es: "Sistema de gestión de aparcamiento que utiliza sensores LDR, pantalla LCD y servos. Presentado en la feria regional de ciencias de Gabès."
    },
    stack: ["Arduino", "LCD", "LDR", "C"],
    category: "embedded",
    year: 2020,
    image: "/projects/smart-parking.jpg",
    github: "https://github.com/OmarABouajaja/Projects/tree/main/Smart-Parking",
    demo: "https://github.com/OmarABouajaja/Projects/tree/main/Smart-Parking#demo"
  },
  {
    id: 5,
    title: {
      en: "M&O Studio",
      fr: "M&O Studio",
      ar: "استوديو M&O",
      de: "M&O Studio",
      es: "M&O Studio"
    },
    description: {
      en: "A small creative studio I co-founded to design interactive digital menus. UI created with Figma and developed in React + Tailwind.",
      fr: "Studio cofondé pour créer des menus digitaux interactifs. Le design est conçu dans Figma et l'intégration se fait avec React et Tailwind pour un rendu responsive.",
      ar: "استوديو إبداعي صغير شاركت في تأسيسه لتصميم قوائم رقمية تفاعلية. تم إنشاء واجهة المستخدم باستخدام Figma وتم تطويرها في React + Tailwind.",
      de: "Kreativstudio, das ich mitbegründet habe, um interaktive digitale Menüs zu entwerfen. UI mit Figma erstellt und in React + Tailwind entwickelt.",
      es: "Un pequeño estudio creativo que cofundé para diseñar menús digitales interactivos. La interfaz se creó en Figma y se desarrolló con React + Tailwind."
    },
    stack: ["Figma", "React", "Tailwind CSS", "Firebase"],
    category: "web",
    year: 2024,
    image: "/projects/mno-studio.jpg",
    github: "https://github.com/OmarABouajaja/Projects/tree/main/MO-Studio",
    demo: "https://mo-studio.tn"
  },
  {
    id: 6,
    title: {
      en: "IoT Developer Portfolio",
      fr: "Portfolio IoT",
      ar: "محفظة مطور إنترنت الأشياء",
      de: "IoT Entwickler Portfolio",
      es: "Portafolio de Desarrollador IoT"
    },
    description: {
      en: "My personal bilingual portfolio with dark/light theme, animations and responsive design. Deployed on Cloudflare Pages.",
      fr: "Portfolio personnel bilingue avec mode sombre/clair, animations, et design responsive. Déployé sur Cloudflare Pages.",
      ar: "محفظتي الشخصية ثنائية اللغة مع وضع داكن/فاتح، ورسوم متحركة وتصميم متجاوب. تم نشرها على Cloudflare Pages.",
      de: "Mein persönliches zweisprachiges Portfolio mit Dunkel-/Hellmodus, Animationen und responsivem Design. Bereitgestellt auf Cloudflare Pages.",
      es: "Mi portafolio personal bilingüe con tema oscuro/claro, animaciones y diseño responsivo. Desplegado en Cloudflare Pages."
    },
    stack: ["React", "Vite", "Framer Motion", "Tailwind"],
    category: "web",
    year: 2024,
    image: "/projects/portfolio.jpg",
    github: "https://github.com/OmarABouajaja/portfolio-fusion",
    demo: "https://omar-abouajaja.tn"
  },
  {
    id: 7,
    title: {
      en: "UI Mockups & Prototyping",
      fr: "Maquettes & Prototypes UI",
      ar: "نماذج أولية وتصميمات UI",
      de: "UI Mockups & Prototyping",
      es: "Maquetas y Prototipos UI"
    },
    description: {
      en: "Interactive designs, web interfaces and educational tools created for workshops and personal use.",
      fr: "Conception de prototypes interactifs, d'interfaces web et d'outils éducatifs pour mes projets et ateliers.",
      ar: "تصاميم تفاعلية وواجهات ويب وأدوات تعليمية تم إنشاؤها للورش والعمل الشخصي.",
      de: "Interaktive Designs, Webschnittstellen und Bildungstools für Workshops und den persönlichen Gebrauch.",
      es: "Diseños interactivos, interfaces web y herramientas educativas creadas para talleres y uso personal."
    },
    stack: ["Figma", "Canva", "Photoshop", "Blender"],
    category: "web",
    year: 2024,
    image: "/projects/uiux.jpg",
    github: "https://github.com/OmarABouajaja/Projects/tree/main/UI-UX",
    demo: "https://www.behance.net/omar-abouajaja"
  }
]; 