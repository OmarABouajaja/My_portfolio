import { Github, Linkedin } from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Omar Abouajaja",
  birth: "April 28, 2004",
  location: "Zarzis, Tunisia",
  linkedin: "https://www.linkedin.com/in/omar-abouajaja",
  github: "https://github.com/OmarABouajaja",
  buymeacoffee: "https://coff.ee/omarbouajab",
  paypal: "",
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "B2 (TCF 657)" },
    { name: "English", level: "Fluent" },
    { name: "German", level: "Basic" }
  ],
  email: 'omarbouajaja48@gmail.com',
  phone: '+216 26 313 145', // Replace with your actual phone number
};

export const SOCIAL_LINKS = {
  linkedin: {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/omar-abouajaja',
    icon: Linkedin,
  },
  github: {
    label: 'GitHub',
    url: 'https://github.com/OmarABouajaja',
    icon: Github,
  },

};

export const SUPPORT_LINKS = {
  buymeacoffee: {
    icon: "🤖",
    label: {
      en: "Buy me a robot",
      fr: "Offrez-moi un robot",
      de: "Kauf mir einen Roboter",
      ar: "اهدي لي روبوتًا"
    },
    url: "https://coff.ee/omarbouajab"
  },
  calendly: {
    label: {
      en: 'Schedule a Call',
      fr: 'Planifier un appel',
      ar: 'جدولة مكالمة',
      de: 'Anruf planen',
    },
    url: 'https://calendly.com/omarbouajaja48/30min', // Replace with your Calendly link
    icon: null, // Replace with appropriate icon if available
  },
}; 