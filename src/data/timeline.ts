interface TimelineItem {
  id: number;
  year: number;
  title: string;
  description: string;
  category: 'education' | 'project' | 'achievement' | 'work';
  icon?: string;
}

export const timeline: TimelineItem[] = [
  {
    id: 1,
    year: 2018,
    title: "Started DIY Electronics",
    description: "Began exploring electronics through self-learning and DIY projects",
    category: "education",
    icon: "🔧"
  },
  {
    id: 2,
    year: 2019,
    title: "Arduino & Robotics Clubs",
    description: "Joined AJSZ robotics club and started conducting workshops",
    category: "education",
    icon: "🤖"
  },
  {
    id: 3,
    year: 2020,
    title: "Smart Parking Project",
    description: "Developed and presented smart parking system at Gabès science fair",
    category: "project",
    icon: "🅿️"
  },
  {
    id: 4,
    year: 2022,
    title: "Smart Home - Gold Medal",
    description: "Won Gold Medal at National IoT Congress for Smart Home project",
    category: "achievement",
    icon: "🏅"
  },
  {
    id: 5,
    year: 2023,
    title: "Multiple Achievements",
    description: "Developed ESP32 CallBox, participated in TOP Olympiad, started UI/UX freelancing",
    category: "achievement",
    icon: "🚀"
  },
  {
    id: 6,
    year: 2023,
    title: "Baccalaureate in Computer Science",
    description: "Graduated with excellent scores: Algo 19/20, STI 17/20",
    category: "education",
    icon: "🎓"
  },
  {
    id: 7,
    year: 2023,
    title: "Started IoT Systems Engineering",
    description: "Began studies at ISITCOM in IoT Systems Engineering",
    category: "education",
    icon: "📚"
  },
  {
    id: 8,
    year: 2024,
    title: "M&O Studio Founded",
    description: "Co-founded M&O Studio, focusing on web development and UI/UX design",
    category: "work",
    icon: "💼"
  }
];

export const categories = [
  { value: "all", label: "All" },
  { value: "education", label: "Education" },
  { value: "project", label: "Projects" },
  { value: "achievement", label: "Achievements" },
  { value: "work", label: "Work" }
]; 