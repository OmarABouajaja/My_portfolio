interface ContactConfig {
  formspreeEndpoint: string;
  emailTo: string;
  recaptchaSiteKey?: string;
  honeypotField: string;
  submitTimeout: number;
  maxMessageLength: number;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export const contactConfig: ContactConfig = {
  // Replace with your Formspree form ID
  formspreeEndpoint: 'https://formspree.io/f/xgvkjoqd',
  
  // Your contact email
  emailTo: 'omarbouajaja48@gmail.com',
  
  // Optional reCAPTCHA site key
  recaptchaSiteKey: undefined,
  
  // Honeypot field name for spam prevention
  honeypotField: '_gotcha',
  
  // Form submission timeout in milliseconds
  submitTimeout: 3000,
  
  // Maximum message length
  maxMessageLength: 1000,
  
  // Social media links
  socialLinks: [
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
  ]
};

// Form validation rules
export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

// Error messages
export const errorMessages = {
  name: {
    required: 'Please enter your name',
    minLength: 'Name must be at least 2 characters long',
    maxLength: 'Name must not exceed 50 characters'
  },
  email: {
    required: 'Please enter your email address',
    pattern: 'Please enter a valid email address'
  },
  message: {
    required: 'Please enter your message',
    minLength: 'Message must be at least 10 characters long',
    maxLength: 'Message must not exceed 1000 characters'
  },
  submit: {
    error: 'An error occurred. Please try again.',
    success: 'Message sent successfully!'
  }
}; 