import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for the AnimatedText component
 * - text: The string to animate
 * - className: Optional additional classes
 * - gradient: Whether to apply a gradient effect
 * - delay: Delay before animation starts
 * - duration: Duration of each word's animation
 * - staggerChildren: Time between each word's animation
 */
interface AnimatedTextProps {
  text: string;
  className?: string;
  gradient?: boolean;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
}

/**
 * AnimatedText component animates each word in a string with a fade and slide effect
 * Features:
 * - Animates words in sequence using Framer Motion
 * - Optional gradient effect for text
 * - Customizable delay, duration, and stagger
 */
const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  gradient = false,
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.1,
}) => {
  // Split the text into words for individual animation
  const words = text.split(' ');

  // Animation variants for the container (parent)
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren, delayChildren: delay * i },
    }),
  };

  // Animation variants for each word (child)
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={cn(
            "mr-2 last:mr-0",
            gradient && "bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 animate-gradient"
          )}
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText; 