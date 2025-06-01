// Define the structure for SEO configuration
interface SEOConfig {
  title: string;
  description: string;
  openGraph: {
    type: string;
    locale: string;
    url: string;
    site_name: string;
    title: string;
    description: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
  };
  twitter: {
    handle: string;
    site: string;
    cardType: string;
  };
}

// Default SEO configuration for the site
export const defaultSEO: SEOConfig = {
  title: 'Omar Abouajaja - IoT Developer & Robotics Trainer',
  description: 'IoT Developer and Robotics Trainer from Tunisia, specializing in smart automation systems, embedded development, and robotics education.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ob.m-and-o-studio.com.tn',
    site_name: 'Omar Abouajaja Portfolio',
    title: 'Omar Abouajaja - IoT Developer & Robotics Trainer',
    description: 'IoT Developer and Robotics Trainer from Tunisia, specializing in smart automation systems, embedded development, and robotics education.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Omar Abouajaja Portfolio'
      }
    ]
  },
  twitter: {
    handle: '@omar_abouajaja',
    site: '@omar_abouajaja',
    cardType: 'summary_large_image'
  }
};

// SEO configurations for specific pages
export const pageSEO = {
  home: {
    title: 'Omar Abouajaja - IoT Developer & Robotics Trainer',
    description: 'Welcome to my portfolio. I create intelligent and connected systems, specializing in IoT, robotics, and web development.'
  },
  projects: {
    title: 'Projects - Omar Abouajaja',
    description: 'Explore my featured projects in IoT, robotics, and web development. From smart home systems to educational robotics platforms.'
  },
  resume: {
    title: 'Resume - Omar Abouajaja',
    description: 'My professional journey, skills, and experience in IoT development, robotics training, and web development.'
  },
  contact: {
    title: 'Contact - Omar Abouajaja',
    description: 'Get in touch with me for collaboration opportunities, project inquiries, or questions about my work.'
  }
};

// Structured data for SEO
export const structuredData = {
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Omar Abouajaja',
    url: 'https://ob.m-and-o-studio.com.tn',
    image: '/profile.jpg',
    sameAs: [
      'https://www.linkedin.com/in/omar-abouajaja',
      'https://github.com/OmarABouajaja '
    ],
    jobTitle: 'IoT Developer & Robotics Trainer',
    worksFor: {
      '@type': 'Organization',
      name: 'M&O Studio'
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'ISITCOM'
    }
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Omar Abouajaja Portfolio',
    url: 'https://ob.m-and-o-studio.com.tn',
    description: 'Personal portfolio website of Omar Abouajaja, showcasing projects and expertise in IoT, robotics, and web development.'
  }
}; 