// Define the structure for navigation items
interface NavItem {
  path: string;
  label: {
    en: string;
    fr: string;
  };
  icon: string;
  showInNav: boolean;
  showInMobile: boolean;
}

// Define the structure for routes
interface Route {
  path: string;
  component: string;
  exact?: boolean;
}

// Navigation items for the site
export const navigation: NavItem[] = [
  {
    path: '/',
    label: {
      en: 'Home',
      fr: 'Accueil'
    },
    icon: '🏠',
    showInNav: true,
    showInMobile: true
  },
  {
    path: '/projects',
    label: {
      en: 'Projects',
      fr: 'Projets'
    },
    icon: '🚀',
    showInNav: true,
    showInMobile: true
  },
  {
    path: '/resume',
    label: {
      en: 'Resume',
      fr: 'CV'
    },
    icon: '📄',
    showInNav: true,
    showInMobile: true
  },
  {
    path: '/contact',
    label: {
      en: 'Contact',
      fr: 'Contact'
    },
    icon: '📧',
    showInNav: true,
    showInMobile: true
  }
];

// Routes for the application
export const routes: Route[] = [
  {
    path: '/',
    component: 'Home',
    exact: true
  },
  {
    path: '/projects',
    component: 'Projects'
  },
  {
    path: '/resume',
    component: 'Resume'
  },
  {
    path: '/contact',
    component: 'Contact'
  },
  {
    path: '*',
    component: 'NotFound'
  }
];

// Social media links
export const socialLinks = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/omar-abouajaja',
    icon: 'linkedin'
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/OmarABouajaja ',
    icon: 'github'
  },
  {
    platform: 'Email',
    url: 'mailto:omarbouajaja48@gmail.com',
    icon: 'mail'
  }
];

// Mobile breakpoint in pixels
export const mobileBreakpoint = 768; 