import { DeviceIcon, RobotIcon, ParkingIcon, MedalIcon, RocketIcon, GraduationIcon, BookIcon, BriefcaseIcon } from '@/components/ui/custom-icons';

export interface TimelineItem {
  year: number;
  title: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  icon: React.FC<{ className?: string }>;
  technologies: string[];
}

export const timelineData: TimelineItem[] = [
  {
    year: 2018,
    title: {
      en: "Started with electronics & sensors",
      fr: "Débuts en électronique et capteurs"
    },
    description: {
      en: "First steps into electronics and Arduino programming. Built basic sensor circuits and automation projects.",
      fr: "Premiers pas en électronique et programmation Arduino. Construction de circuits basiques avec capteurs."
    },
    icon: DeviceIcon,
    technologies: ["Arduino", "Sensors", "Electronics"]
  },
  {
    year: 2019,
    title: {
      en: "Youth robotics workshops (AJSZ)",
      fr: "Ateliers robotiques AJSZ"
    },
    description: {
      en: "Led robotics workshops for youth, teaching basic electronics and programming.",
      fr: "Animation d'ateliers de robotique pour les jeunes, enseignement de l'électronique et de la programmation."
    },
    icon: RobotIcon,
    technologies: ["Arduino", "Robotics", "Education"]
  },
  {
    year: 2020,
    title: {
      en: "Smart Parking at Gabès tech fair",
      fr: "Smart Parking à la foire de Gabès"
    },
    description: {
      en: "Developed an automated parking system with LED indicators and LDR sensors.",
      fr: "Développement d'un système de parking automatisé avec indicateurs LED et capteurs LDR."
    },
    icon: ParkingIcon,
    technologies: ["Arduino", "LDR", "LED", "Automation"]
  },
  {
    year: 2022,
    title: {
      en: "Gold Medal – Smart Home IoT project",
      fr: "Médaille d'or – Projet domotique IoT"
    },
    description: {
      en: "Won gold medal at National IoT Congress for a complete home automation system.",
      fr: "Médaille d'or au Congrès national IoT pour un système complet de domotique."
    },
    icon: MedalIcon,
    technologies: ["ESP32", "Firebase", "MQTT", "IoT"]
  },
  {
    year: 2023,
    title: {
      en: "Multiple Achievements",
      fr: "Multiples réalisations"
    },
    description: {
      en: "Developed ESP32 CallBox, participated in TOP Olympiad, started UI/UX freelancing",
      fr: "Développement du CallBox ESP32, participation à l'Olympiade TOP, début du freelance UI/UX"
    },
    icon: RocketIcon,
    technologies: ["ESP32", "UI/UX", "React", "Node.js"]
  },
  {
    year: 2023,
    title: {
      en: "Baccalaureate in Computer Science",
      fr: "Baccalauréat en Informatique"
    },
    description: {
      en: "Graduated with excellent scores: Algo 19/20, STI 17/20",
      fr: "Diplômé avec d'excellentes notes : Algo 19/20, STI 17/20"
    },
    icon: GraduationIcon,
    technologies: ["Computer Science", "Algorithms", "Programming"]
  },
  {
    year: 2023,
    title: {
      en: "Started IoT Systems Engineering",
      fr: "Début en Ingénierie des Systèmes IoT"
    },
    description: {
      en: "Began studies at ISITCOM in IoT Systems Engineering",
      fr: "Début des études à l'ISITCOM en Ingénierie des Systèmes IoT"
    },
    icon: BookIcon,
    technologies: ["IoT", "Engineering", "Systems Design"]
  },
  {
    year: 2024,
    title: {
      en: "M&O Studio Founded",
      fr: "Création de M&O Studio"
    },
    description: {
      en: "Co-founded M&O Studio, focusing on web development and UI/UX design",
      fr: "Co-fondation de M&O Studio, spécialisé en développement web et design UI/UX"
    },
    icon: BriefcaseIcon,
    technologies: ["Web Development", "UI/UX", "Business"]
  }
]; 