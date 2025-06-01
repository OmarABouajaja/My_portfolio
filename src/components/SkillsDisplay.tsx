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

interface SkillIconProps {
  icon: React.FC<{ className?: string }>;
  name: string;
  description?: string;
  className?: string;
  index: number;
  category?: string;
  translationKey?: number;
}

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

const SkillIcon = ({ icon: Icon, name, className, index, category, translationKey }: SkillIconProps) => {
  const { t } = useLanguage();
  const description = getSkillDescription(name);
  
  // Get translated name for soft skills
  const displayName = category === 'soft' && translationKey !== undefined
    ? (t('skills') as Skills).soft.items[translationKey]
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
};

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
};

const SkillsDisplay = () => {
  const { t } = useLanguage();
  const skills = t('skills') as Skills;
  const categories = Object.keys(skillsByCategory);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'design':
        return skills.design.title;
      case 'programming':
        return skills.programming.title;
      case 'web':
        return skills.web.title;
      case 'embedded':
        return skills.embedded.title;
      case 'soft':
        return skills.soft.title;
      default:
        return category;
    }
  };

  return (
    <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3 pb-24">
      {categories.map((category, categoryIndex) => {
        const skillsForCategory = skillsByCategory[category as keyof typeof skillsByCategory];
        const categoryTitle = getCategoryTitle(category);

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="group relative p-8 rounded-2xl bg-card/95 hover:bg-card hover:shadow-2xl transition-all duration-500 ease-out border border-border/50"
          >
            {/* Category title with language switch */}
            <h3 className="text-2xl font-bold capitalize mb-10">
              <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent backdrop-blur-sm">
                {categoryTitle}
              </span>
            </h3>

            {/* Skills grid with unified layout for all categories */}
            <div className={cn(
              "grid gap-x-12 gap-y-16",
              category === 'web' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2',
              category === 'soft' ? 'md:grid-cols-3 xl:grid-cols-3 gap-y-20' : '',
              "place-items-center relative z-10"
            )}>
              {skillsForCategory.map((skill, index) => (
                <SkillIcon
                  key={index}
                  icon={skill.icon}
                  name={skill.name}
                  index={index}
                  category={category}
                  translationKey={'translationKey' in skill ? skill.translationKey : undefined}
                  className="relative z-10"
                />
              ))}
            </div>

            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default SkillsDisplay;