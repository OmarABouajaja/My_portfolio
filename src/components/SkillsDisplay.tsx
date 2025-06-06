import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import type { Skills } from '../types/translations';
import {
  // Design Icons
  FigmaIcon,
  CanvaIcon,
  PhotoshopIcon,
  BlenderIcon,
  // Programming Icons
  PythonIcon,
  CPPIcon,
  CIcon,
  CSharpIcon,
  JavaIcon,
  // Web Icons
  HTMLCSSJSIcon,
  PHPIcon,
  ReactIcon,
  TailwindIcon,
  ViteIcon,
  GitIcon,
  GitHubIcon,
  CloudIcon,
  PrototypingIcon,
  // Embedded Icons
  ArduinoIcon,
  ESP32Icon,
  RaspberryPiIcon,
  // Soft Skills Icons
  ResourceManagementIcon,
  ResponsivenessIcon,
  TeachingIcon,
  CommunicationIcon,
  TeamworkIcon,
  VolunteeringIcon,
  LeadershipIcon,
  ProblemSolvingIcon,
  SelfLearningIcon,
} from '@/components/ui/icons';

// Define the props for the SkillIcon component
interface SkillIconProps {
  icon: React.FC<{ className?: string }>;
  name: string;
  description?: string;
  className?: string;
  index: number;
  category?: string;
  translationKey?: number;
}

// Function to get the description for a skill
const getSkillDescription = (name: string) => {
  const descriptions: { [key: string]: string } = {
    // Design Tools
    'Figma': 'UI/UX Design & Prototyping',
    'Canva': 'Graphic Design & Social Media',
    'Adobe Photoshop': 'Image Editing & Manipulation',
    'Blender': '3D Modeling & Animation',

    // Programming Languages
    'Python': 'Backend Development & Data Science',
    'C++': 'Systems Programming & Game Dev',
    'C': 'Low-level Programming',
    'C#': '.NET Development',
    'Java': 'Enterprise & Android Development',

    // Web Technologies
    'HTML/CSS/JavaScript': 'Frontend Web Development',
    'PHP': 'Backend Web Development',
    'React': 'Modern UI Development',
    'Tailwind CSS': 'Utility-First Styling',
    'Vite': 'Next-Gen Frontend Tooling',
    'Git': 'Version Control',
    'GitHub': 'Code Collaboration',
    'Cloud': 'Cloud Services & Deployment',
    'Prototyping': 'Rapid Development & Testing',

    // Embedded Systems
    'Arduino': 'Microcontroller Programming',
    'ESP32': 'IoT Development',
    'Raspberry Pi': 'Single-Board Computing',

    // Soft Skills - English
    'Strategic Leadership & Project Management': 'Strategic planning and efficient allocation of project resources',
    'Cross-functional Team Collaboration': 'Quick adaptation to changing requirements and feedback',
    'Technical Training & Knowledge Transfer': 'Effective knowledge transfer and technical training facilitation',
    'Public Speaking & Presentation': 'Clear articulation of complex technical concepts',
    'Agile Project Execution': 'Strong collaboration and cross-functional team integration',
    'Resource Optimization & Planning': 'Active community engagement and social impact initiatives',
    'Community Engagement & Impact': 'Team guidance and project direction with clear vision',
    'Adaptive Problem Resolution': 'Systematic approach to technical challenges and solutions',
    'Continuous Learning & Development': 'Proactive acquisition of new skills and technologies',

    // Soft Skills - French
    'Gestion des Ressources et Leadership': 'Planification stratégique et allocation efficace des ressources',
    'Collaboration d\'Équipe': 'Adaptation rapide aux exigences changeantes',
    'Formation et Transfert': 'Transfert de connaissances et animation de formations techniques',
    'Communication et Présentation': 'Expression claire des concepts techniques complexes',
    'Travail d\'Équipe Agile': 'Collaboration forte et intégration d\'équipes pluridisciplinaires',
    'Optimisation des Ressources': 'Engagement communautaire actif et initiatives à impact social',
    'Impact Communautaire': 'Guidage d\'équipe et direction de projet avec vision claire',
    'Résolution de Problèmes Adaptative': 'Approche systématique des défis techniques',
    'Développement Continu': 'Acquisition proactive de nouvelles compétences',

    // Soft Skills - Arabic
    'القيادة الاستراتيجية': 'التخطيط الاستراتيجي والتوزيع الفعال للموارد',
    'التعاون الجماعي': 'التكيف السريع مع المتطلبات المتغيرة',
    'التدريب ونقل المعرفة': 'نقل المعرفة الفعال وتيسير التدريب التقني',
    'مهارات العرض والتقديم': 'التعبير الواضح عن المفاهيم التقنية المعقدة',
    'العمل الجماعي المرن': 'تعاون قوي وتكامل مع الفرق متعددة التخصصات',
    'تحسين الموارد': 'المشاركة المجتمعية النشطة ومبادرات التأثير الاجتماعي',
    'التأثير المجتمعي': 'توجيه الفريق وإدارة المشاريع برؤية واضحة',
    'حل المشكلات المتكيف': 'نهج منهجي للتحديات التقنية والحلول',
    'التطوير المستمر': 'اكتساب استباقي للمهارات والتقنيات الجديدة',

    // Soft Skills - Dutch
    'Strategisch Leiderschap': 'Strategische planning en efficiënte toewijzing van projectmiddelen',
    'Teamsamenwerkingen': 'Snelle aanpassing aan veranderende eisen en feedback',
    'Kennisoverdracht': 'Effectieve kennisoverdracht en technische trainingsfacilitatie',
    'Presentatievaardigheden': 'Heldere articulatie van complexe technische concepten',
    'Agile Teamwerk': 'Sterke samenwerking en integratie van multidisciplinaire teams',
    'Resourceoptimalisatie': 'Actieve gemeenschapsbetrokkenheid en sociale impactinitiatieven',
    'Community Impact': 'Teambegeleidingen projectsturing met duidelijke visie',
    'Adaptief Probleemoplossen': 'Systematische aanpak van technische uitdagingen',
    'Continue Ontwikkeling': 'Proactieve verwerving van nieuwe vaardigheden en technologieën'
  };
  return descriptions[name] || '';
};

// SkillIcon component to display individual skills
const SkillIcon = React.memo(({ icon: Icon, name, className, index, category, translationKey }: SkillIconProps) => {
  const { t } = useLanguage();
  const description = getSkillDescription(name);
  
  // Get translated name for soft skills
  const displayName = category === 'soft' && translationKey !== undefined
    ? String((t('skills') as Skills).soft.items[translationKey])
    : name;
  
  // Unified icon size and label for all skills
  const iconSize = 'w-12 h-12 md:w-14 md:h-14';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative inline-flex flex-col items-center justify-center gap-2"
      )}
    >
      <div className="relative transform transition-transform duration-200 ease-out group-hover:scale-110">
        <div className="relative">
          <Icon className={cn(
            iconSize,
            "transition-all duration-300 ease-out drop-shadow-xl group-hover:drop-shadow-[0_0_24px_rgba(var(--primary-rgb),0.5)]",
            className
          )} />
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl bg-primary/30" />
        </div>
      </div>
      <span className="text-sm font-medium text-foreground absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-normal text-center w-32 opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-background/80 backdrop-blur-sm p-1 rounded-md">
        {displayName}
      </span>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 0, y: 10, scale: 0.95 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="absolute -bottom-36 left-1/2 -translate-x-1/2 z-20 min-w-[280px] max-w-[320px] pointer-events-none"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-lg border border-border shadow-xl" />
          <div className="relative p-4 rounded-lg">
            <div className="font-semibold text-base text-foreground mb-2 text-center">{displayName}</div>
            {description && (
              <div className="text-sm text-foreground/90 leading-relaxed text-center">{description}</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

SkillIcon.displayName = 'SkillIcon';

// Define skills by category
const skillsByCategory = {
  'design': [
    { name: 'Figma', icon: FigmaIcon },
    { name: 'Canva', icon: CanvaIcon },
    { name: 'Adobe Photoshop', icon: PhotoshopIcon },
    { name: 'Blender', icon: BlenderIcon },
  ],
  'programming': [
    { name: 'Python', icon: PythonIcon },
    { name: 'C++', icon: CPPIcon },
    { name: 'C', icon: CIcon },
    { name: 'C#', icon: CSharpIcon },
    { name: 'Java', icon: JavaIcon },
  ],
  'web': [
    { name: 'HTML/CSS/JavaScript', icon: HTMLCSSJSIcon },
    { name: 'PHP', icon: PHPIcon },
    { name: 'React', icon: ReactIcon },
    { name: 'Tailwind CSS', icon: TailwindIcon },
    { name: 'Vite', icon: ViteIcon },
    { name: 'Git', icon: GitIcon },
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Cloud', icon: CloudIcon },
    { name: 'Prototyping', icon: PrototypingIcon },
  ],
  'embedded': [
    { name: 'Arduino', icon: ArduinoIcon },
    { name: 'ESP32', icon: ESP32Icon },
    { name: 'Raspberry Pi', icon: RaspberryPiIcon },
  ],
  'soft': [
    { name: 'Resource Management', translationKey: 0, icon: ResourceManagementIcon },
    { name: 'Responsiveness', translationKey: 1, icon: ResponsivenessIcon },
    { name: 'Teaching', translationKey: 2, icon: TeachingIcon },
    { name: 'Communication', translationKey: 3, icon: CommunicationIcon },
    { name: 'Teamwork', translationKey: 4, icon: TeamworkIcon },
    { name: 'Volunteering', translationKey: 5, icon: VolunteeringIcon },
    { name: 'Leadership', translationKey: 6, icon: LeadershipIcon },
    { name: 'Problem Solving', translationKey: 7, icon: ProblemSolvingIcon },
    { name: 'Self Learning', translationKey: 8, icon: SelfLearningIcon },
  ],
} as const;

// Main SkillsDisplay component
const SkillsDisplay = React.memo(() => {
  const { t } = useLanguage();
  const skills = t('skills') as Skills;
  const categories = Object.keys(skillsByCategory);

  // Function to get the title for each category
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'design':
        return String(skills.design.title);
      case 'programming':
        return String(skills.programming.title);
      case 'web':
        return String(skills.web.title);
      case 'embedded':
        return String(skills.embedded.title);
      case 'soft':
        return String(skills.soft.title);
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {categories.map((category) => (
        <div key={category} className="mb-16 last:mb-0">
          <h2 className="text-2xl font-bold mb-8 text-center">{getCategoryTitle(category)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {skillsByCategory[category as keyof typeof skillsByCategory].map((skill, index) => (
              <SkillIcon
                key={skill.name}
                icon={skill.icon}
                name={skill.name}
                index={index}
                category={category}
                translationKey={'translationKey' in skill ? skill.translationKey : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

SkillsDisplay.displayName = 'SkillsDisplay';

export default SkillsDisplay;