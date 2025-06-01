import { Variants } from 'framer-motion';

// Custom easing for animations
export const customEase = [0.22, 1, 0.36, 1];
export const springEase = [0.43, 1.19, 0.49, 0.96];

// Loading screen container animation
export const loadingScreenContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: customEase }
  }
};

// Loading screen item animation
export const loadingScreenItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: customEase }
  }
};

// Loading screen glow animation
export const loadingScreenGlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: customEase }
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
    transition: { duration: 0.4, ease: customEase }
  }
};

// Stagger container animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      ease: customEase
    }
  }
};

// Page transition animation
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
      ease: customEase
    }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.3,
      ease: customEase
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