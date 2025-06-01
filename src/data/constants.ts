import { EmailIcon } from '@/components/ui/custom-icons';
import { Github, Linkedin } from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Omar Abouajaja",
  birth: "April 28, 2004",
  location: "Zarzis, Tunisia",
  linkedin: "https://www.linkedin.com/in/omar-abouajaja",
  github: "https://github.com/OmarABouajaja ",
  buymeacoffee: "https://buymeacoffee.com/omarabouajaja",
  paypal: "https://paypal.me/omarabouajaja",
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "B2 (TCF 657)" },
    { name: "English", level: "Fluent" },
    { name: "German", level: "Basic" }
  ]
};

export const EDUCATION = [
  {
    year: "2023",
    title: {
      en: "Baccalaureate in Computer Science",
      fr: "Baccalauréat en Sciences Informatiques"
    },
    details: {
      en: "Algorithms: 19/20, STI: 17/20",
      fr: "Algorithmes : 19/20, STI : 17/20"
    }
  },
  {
    year: "2023-2024",
    title: {
      en: "IoT Engineering License (ISITCOM)",
      fr: "Licence en Ingénierie IoT (ISITCOM)"
    },
    details: {
      en: "Focus on IoT and embedded systems (not completed)",
      fr: "Spécialisation en IoT et systèmes embarqués (non terminé)"
    }
  }
];

export const ACHIEVEMENTS = [
  {
    year: "2022",
    title: {
      en: "Smart Home - National IoT Congress Winner",
      fr: "Maison Intelligente - Vainqueur du Congrès National IoT"
    }
  },
  {
    year: "2019",
    title: {
      en: "Smart Parking - Gabès Science Fair",
      fr: "Parking Intelligent - Foire des Sciences de Gabès"
    }
  }
];

export const SOCIAL_LINKS = {
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://linkedin.com/in/omar-abouajaja"
  },
  github: {
    icon: Github,
    label: "GitHub",
    url: "https://github.com/OmarABouajaja "
  }
};

export const SUPPORT_LINKS = {
  buymeacoffee: {
    icon: "🤖",
    label: {
      en: "Buy me a robot",
      fr: "Offrez-moi un robot",
      de: "Kauf mir einen Roboter",
      ar: "اشترِ لي روبوتًا"
    },
    url: "https://buymeacoffee.com/omarabouajab"
  }
};

export const techStack = {
  languages: ["JavaScript", "Python", "C", "C++", "PHP"],
  frameworks: ["React.js", "Firebase", "Tailwind CSS"],
  tools: ["ESP32", "Arduino IDE", "Sim800L", "Figma", "Photoshop", "GitHub"],
  categories: [
    {
      name: "IoT & Embedded",
      skills: ["ESP32", "Arduino", "Sensors", "C/C++", "Firebase"]
    },
    {
      name: "Web Development",
      skills: ["React", "JavaScript", "Tailwind CSS", "Node.js"]
    },
    {
      name: "Design",
      skills: ["Figma", "UI/UX", "Photoshop", "Web Design"]
    },
    {
      name: "Robotics",
      skills: ["Arduino", "Motors", "Sensors", "3D Printing"]
    }
  ]
};

export const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/omar-abouajaja",
    icon: "linkedin"
  },
  {
    name: "GitHub",
    url: "https://github.com/OmarABouajaja",
    icon: "github"
  },
  {
    name: "Email",
    url: "mailto:omarbouajaja48@gmail.com",
    icon: "mail"
  }
]; 