// Define the structure for education entries
interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description?: string;
  achievements?: string[];
}

// Define the structure for experience entries
interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

// Define the structure for skills
interface Skill {
  name: string;
  level: number; // 1-5
  keywords: string[];
}

// Define the structure for languages
interface Language {
  name: string;
  level: string;
  certification?: string;
}

// Define the overall resume configuration
interface ResumeConfig {
  header: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location: string;
    website: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  skills: {
    technical: Skill[];
    soft: Skill[];
  };
  languages: Language[];
  interests: string[];
}

// Resume configuration for Omar Abouajaja
export const resumeConfig: ResumeConfig = {
  header: {
    name: "Omar Abouajaja",
    title: "IoT Developer & Robotics Trainer",
    email: "omarbouajaja48@gmail.com",
    location: "Zarzis, Tunisia",
    website: "https://ob.m-and-o-studio.com.tn",
    summary: "IoT Developer and Robotics Trainer with expertise in smart automation systems, embedded development, and robotics education. Gold medalist at National IoT Congress. Co-founder of M&O Studio."
  },
  education: [
    {
      degree: "Licence in IoT Systems Engineering",
      institution: "ISITCOM",
      location: "Hammam Sousse, Tunisia",
      period: "2023-2024",
      description: "Studying IoT systems, embedded development, and network protocols."
    },
    {
      degree: "Baccalaureate in Computer Science",
      institution: "Lycée Zarzis",
      location: "Zarzis, Tunisia",
      period: "2023",
      achievements: [
        "Algorithm Score: 19/20",
        "Information Systems Score: 17/20"
      ]
    }
  ],
  experience: [
    {
      title: "Co-founder & IoT Developer",
      company: "M&O Studio",
      location: "Zarzis, Tunisia",
      period: "2024-Present",
      description: "Co-founded a web development and UI/UX design studio, focusing on creative digital solutions.",
      achievements: [
        "Developed and launched the studio's web platform",
        "Created digital menu solutions for local businesses",
        "Managed client relationships and project delivery"
      ],
      technologies: ["React", "Figma", "Tailwind CSS", "Firebase"]
    },
    {
      title: "Robotics Trainer",
      company: "AJSZ Robotics Club",
      location: "Zarzis, Tunisia",
      period: "2019-2023",
      description: "Conducted workshops and training sessions in robotics and electronics for students.",
      achievements: [
        "Trained over 50 students in basic robotics",
        "Developed practical curriculum for hands-on learning",
        "Mentored students for robotics competitions"
      ],
      technologies: ["Arduino", "C++", "Electronics", "3D Printing"]
    }
  ],
  skills: {
    technical: [
      {
        name: "IoT Development",
        level: 5,
        keywords: ["ESP32", "Arduino", "Sensors", "Firebase"]
      },
      {
        name: "Programming",
        level: 4,
        keywords: ["JavaScript", "Python", "C", "C++", "PHP"]
      },
      {
        name: "Web Development",
        level: 4,
        keywords: ["React", "Node.js", "Tailwind CSS", "HTML/CSS"]
      },
      {
        name: "Electronics",
        level: 4,
        keywords: ["Circuit Design", "Microcontrollers", "Sensors"]
      },
      {
        name: "Design",
        level: 3,
        keywords: ["Figma", "UI/UX", "Photoshop"]
      }
    ],
    soft: [
      {
        name: "Teaching",
        level: 5,
        keywords: ["Workshop Facilitation", "Curriculum Development"]
      },
      {
        name: "Problem Solving",
        level: 4,
        keywords: ["Analytical Thinking", "Debugging"]
      },
      {
        name: "Communication",
        level: 4,
        keywords: ["Technical Writing", "Presentation"]
      }
    ]
  },
  languages: [
    {
      name: "Arabic",
      level: "Native"
    },
    {
      name: "French",
      level: "B2",
      certification: "TCF 657"
    },
    {
      name: "English",
      level: "Fluent"
    },
    {
      name: "German",
      level: "Basic"
    }
  ],
  interests: [
    "IoT Innovation",
    "Robotics Education",
    "Open Source Development",
    "3D Printing",
    "Electronics DIY"
  ]
}; 