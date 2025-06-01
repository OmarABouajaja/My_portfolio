import { cn } from '@/lib/utils';

/**
 * Interface for icon component props
 * Allows customization of icon appearance through className
 */
interface IconProps {
  className?: string;
}

/**
 * List of icons that should be inverted to white in dark mode
 * These icons need special handling for dark theme visibility
 */
const whiteInDarkMode = [
  'Figma',
  'python',
  'csharp',
  'java',
  'PHP',
  'React',
  'git',
  'github',
  'Prototypage',
  'ESP32',
  'gestion de ressource',
  'resposivity',
  'pedagogy',
  'team work',
  'benevolat',
  'leadership',
  'problem solving',
  'self learning',
  'Tailwind CSS'
];

/**
 * Factory function to create icon components from SVG files
 * @param category - The category folder containing the icon
 * @param name - The name of the icon file (without extension)
 * @returns A React component that renders the icon
 */
export const importIcon = (category: string, name: string) => {
  const IconComponent = ({ className }: IconProps) => {
    const shouldInvert = whiteInDarkMode.includes(name);
    return (
      <div
        className={cn(
          'w-14 h-14', // Base size
          'transition-all duration-300 ease-out',
          'relative group/icon',
          className
        )}
      >
        <img 
          src={`/src/data/icons/${category}/${name}.svg`}
          alt={`${name} icon`}
          className={cn(
            'w-full h-full',
            'transition-all duration-300',
            'object-contain',
            'absolute inset-0',
            // Invert specified icons in dark mode
            shouldInvert && 'dark:invert'
          )}
        />
      </div>
    );
  };
  return IconComponent;
};

// Design tool icons
export const FigmaIcon = importIcon('design', 'Figma');
export const CanvaIcon = importIcon('design', 'Canva');
export const PhotoshopIcon = importIcon('design', 'Photoshop');
export const BlenderIcon = importIcon('design', 'blender');

// Programming language icons
export const PythonIcon = importIcon('programming', 'python');
export const CPPIcon = importIcon('programming', 'c++');
export const CIcon = importIcon('programming', 'c');
export const CSharpIcon = importIcon('programming', 'csharp');
export const JavaIcon = importIcon('programming', 'java');

// Web development technology icons
export const HTMLCSSJSIcon = importIcon('web', 'HTMLCSSJS');
export const PHPIcon = importIcon('web', 'PHP');
export const ReactIcon = importIcon('web', 'React');
export const TailwindIcon = importIcon('web', 'Tailwind CSS');
export const ViteIcon = importIcon('web', 'vite');
export const GitIcon = importIcon('web', 'git');
export const GitHubIcon = importIcon('web', 'github');
export const CloudIcon = importIcon('web', 'cloud');
export const PrototypingIcon = importIcon('web', 'Prototypage');

// Embedded systems and hardware icons
export const ArduinoIcon = importIcon('embedded', 'Arduino');
export const ESP32Icon = importIcon('embedded', 'ESP32');
export const RaspberryPiIcon = importIcon('embedded', 'raspberyy pi');

// Soft skills and professional development icons
export const ResourceManagementIcon = importIcon('soft', 'gestion de ressource');
export const ResponsivenessIcon = importIcon('soft', 'resposivity');
export const TeachingIcon = importIcon('soft', 'pedagogy');
export const CommunicationIcon = importIcon('soft', 'public communication');
export const TeamworkIcon = importIcon('soft', 'team work');
export const VolunteeringIcon = importIcon('soft', 'benevolat');
export const LeadershipIcon = importIcon('soft', 'leadership');
export const ProblemSolvingIcon = importIcon('soft', 'problem solving');
export const SelfLearningIcon = importIcon('soft', 'self learning');

// Category representation icons
export const DeviceIcon = importIcon('web', 'cloud');
export const PaletteIcon = importIcon('design', 'Figma');
export const BookIcon = importIcon('programming', 'python');
export const RobotIcon = importIcon('embedded', 'Arduino');
export const BrainIcon = importIcon('soft', 'self learning');

/**
 * Language translation icon component
 * Renders a circular icon with translation-related symbols
 */
export const TranslateIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
    <path d="M9 8h7.5" />
    <path d="M7 11h8" />
    <path d="M12 8v8" />
    <path d="M9 14c0 2 1.5 3 3 3s3-1 3-3" />
  </svg>
);

/**
 * Skills icon component
 * Renders a layered structure representing skill development
 */
export const SkillsIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M17 14l5-2.5-10-5-10 5L7 14" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 22v-5" />
  </svg>
);

/**
 * Community icon component
 * Renders interconnected circles representing community
 */
export const CommunityIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M16 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M8 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M12 17c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

/**
 * Timeline icon component
 * Renders a clock-like design representing time progression
 */
export const TimelineIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M12 6v6l-4 2" />
    <path d="M12 2v4" />
    <path d="M12 18v4" />
  </svg>
);

/**
 * Projects icon component
 * Renders a grid-like structure representing project organization
 */
export const ProjectsIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <circle cx="9" cy="9" r="1" />
    <circle cx="15" cy="15" r="1" />
  </svg>
);

export const ContactIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-4 w-4', className)}
    {...props}
  >
    <path d="M12 2v4" />
    <path d="M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10" />
    <path d="M20 6H4a2 2 0 0 0-2 2v2l10 5 10-5V8a2 2 0 0 0-2-2z" />
    <path d="M12 11v5" />
    <path d="M8 13l4 3 4-3" />
  </svg>
); 