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

interface Route {
  path: string;
  component: string;
  exact?: boolean;
}

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
    path: '/certifications',
    label: {
      en: 'Certifications',
      fr: 'Certifications'
    },
    icon: '📜',
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
    path: '/certifications',
    component: 'Certifications'
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

export const mobileBreakpoint = 768; // in pixels 