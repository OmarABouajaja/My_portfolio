import { Variants } from 'framer-motion';

// Custom easing
export const customEase = [0.22, 1, 0.36, 1];
export const springEase = [0.43, 1.19, 0.49, 0.96];

// Loading screen animations
export const loadingScreenContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: customEase,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: customEase,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const loadingScreenItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: springEase
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: customEase
    }
  }
};

export const loadingScreenGlow: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: [0.2, 0.4, 0.2],
    scale: [1, 1.2, 1],
    transition: {
      duration: 4,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: customEase }
  }
};

// Fade in up animation
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: springEase }
  }
};

// Fade in down animation
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

// Scale animation
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Card hover animation
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Page transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: -10
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Text reveal animation
export const textReveal: Variants = {
  hidden: {
    y: "100%",
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Gradient text animation
export const gradientText: Variants = {
  initial: {
    backgroundPosition: "0% 50%"
  },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      ease: [0.22, 1, 0.36, 1],
      repeat: Infinity
    }
  }
};

// Floating animation
export const floating: Variants = {
  initial: {
    y: 0
  },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Typewriter cursor animation
export const cursor: Variants = {
  initial: {
    opacity: 1
  },
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Menu item hover animation
export const menuItem: Variants = {
  rest: {
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    x: 4,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}; 