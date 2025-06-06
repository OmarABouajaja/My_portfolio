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
  ],
  email: 'omar.abouajaja@ieee.org',
  phone: '+216 28 123 456', // Replace with your actual phone number
};

export const SOCIAL_LINKS = {
  linkedin: {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/omar-abouajaja',
    icon: Linkedin,
  },
  github: {
    label: 'GitHub',
    url: 'https://github.com/omar-abouajaja',
    icon: Github,
  },
  twitter: {
    label: 'Twitter',
    url: 'https://twitter.com/omar_abouajaja',
    icon: null, // Replace with Twitter icon if available
  },
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
  },
  calendly: {
    label: {
      en: 'Schedule a Call',
      fr: 'Planifier un appel',
      ar: 'جدولة مكالمة',
      de: 'Anruf planen',
    },
    url: 'https://calendly.com/your-calendly-link', // Replace with your Calendly link
    icon: null, // Replace with appropriate icon if available
  },
}; 