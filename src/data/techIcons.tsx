import React from 'react';

interface TechIconProps {
  className?: string;
}

export const techIcons: Record<string, {
  icon: React.FC<TechIconProps>;
  color: string;
  gradient: [string, string];
}> = {
  'React': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 21.5c-3.5 0-6.5-1-8.5-2.5C1.5 17.5 0 15.5 0 12s1.5-5.5 3.5-7C5.5 3.5 8.5 2.5 12 2.5s6.5 1 8.5 2.5c2 1.5 3.5 3.5 3.5 7s-1.5 5.5-3.5 7c-2 1.5-5 2.5-8.5 2.5z" />
        <path d="M12 21.5c3.5 0 6.5-4.3 6.5-9.5S15.5 2.5 12 2.5 5.5 6.8 5.5 12s3 9.5 6.5 9.5z" />
      </svg>
    ),
    color: '#61DAFB',
    gradient: ['#61DAFB', '#2D8EBE']
  },
  'Arduino': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M12 22V12M2 7l10 5 10-5" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: '#00979D',
    gradient: ['#00979D', '#006B70']
  },
  'ESP32': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M2 7l10 5 10-5M12 12v10" />
        <path d="M7 9.5l5 2.5 5-2.5" />
      </svg>
    ),
    color: '#E7352C',
    gradient: ['#E7352C', '#B32620']
  },
  'Python': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 7v10M7 12h10" />
        <path d="M9.5 9.5L12 7l2.5 2.5M9.5 14.5L12 17l2.5-2.5" />
      </svg>
    ),
    color: '#3776AB',
    gradient: ['#3776AB', '#1D4B7C']
  },
  'Node.js': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
        <path d="M12 22V12M3 7l9 5 9-5" />
        <path d="M12 12l-4.5-2.5M12 12l4.5-2.5" />
      </svg>
    ),
    color: '#339933',
    gradient: ['#339933', '#1F5C1F']
  },
  'Firebase': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 17l4-12 4 8-8 4z" />
        <path d="M12 13l4-9 4 13H4" />
        <path d="M8 5v12" />
      </svg>
    ),
    color: '#FFCA28',
    gradient: ['#FFCA28', '#FF8F00']
  },
  'MongoDB': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M12 2c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" />
        <path d="M12 16c-4 0-7 1.5-7 3.5s3 3.5 7 3.5 7-1.5 7-3.5-3-3.5-7-3.5z" />
      </svg>
    ),
    color: '#47A248',
    gradient: ['#47A248', '#2E6A2E']
  },
  'TensorFlow': {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M12 22V12M2 7l10 5 10-5" />
        <path d="M7 9.5l5 2.5 5-2.5" />
      </svg>
    ),
    color: '#FF6F00',
    gradient: ['#FF6F00', '#B34D00']
  }
};

export type TechIconName = keyof typeof techIcons; 