import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { loadingScreenContainer, loadingScreenItem, loadingScreenGlow } from '@/utils/animations';
import { TranslationContent } from '@/data/translations';

const LoadingScreen = () => {
  const { language } = useLanguage();

  return (
    <AnimatePresence>
    <motion.div
        variants={loadingScreenContainer}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden select-none"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
            variants={loadingScreenGlow}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-glow opacity-20"
          />
          <motion.div
            className="absolute -inset-8 bg-gradient-blue-violet opacity-5 blur-3xl"
          animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
          }}
          transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Content Container */}
      <motion.div
          variants={loadingScreenItem}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        {/* Logo/Brand */}
        <motion.div 
            className="mb-10 relative"
            variants={loadingScreenItem}
        >
            <motion.div className="relative space-y-4">
              <motion.p 
                className="text-xl md:text-2xl font-medium tracking-wider uppercase text-blue-300"
            animate={{ 
                  y: [0, -2, 0]
            }}
            transition={{
                  duration: 3, 
              repeat: Infinity,
                  ease: "easeInOut" 
            }}
              >
                Hi, I'm
              </motion.p>
          <motion.h1
                className="text-6xl md:text-7xl font-bold tracking-tight text-white"
            animate={{ 
                  y: [0, -2, 0]
            }}
            transition={{
                  duration: 3,
              repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  letterSpacing: '-0.02em'
            }}
          >
            Omar Abouajaja
          </motion.h1>
            </motion.div>
        </motion.div>

        {/* Title/Role */}
        <motion.div
            variants={loadingScreenItem}
            className="mb-14 relative"
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.p 
                className="text-3xl md:text-4xl font-semibold tracking-wide text-slate-200"
                animate={{ 
                  y: [0, -2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
          >
            {language === 'fr' 
                  ? "Passionné IoT & Robotique"
                  : "IoT & Robotics Enthusiast"
            }
          </motion.p>
          <motion.p
                className="text-xl mt-4 font-medium tracking-wider text-blue-300"
                animate={{
                  y: [0, -1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
          >
            {language === 'fr'
              ? "Innovation • Automatisation • Excellence"
              : "Innovation • Automation • Excellence"
            }
          </motion.p>
            </motion.div>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div 
            variants={loadingScreenItem}
          className="flex flex-col items-center gap-4"
        >
          {/* Progress Bar */}
            <div className="w-56 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-lg">
            <motion.div
                className="h-full w-full origin-left bg-blue-400"
              animate={{
                  scaleX: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                  ease: "easeInOut"
              }}
            />
          </div>

          {/* Loading Text */}
          <motion.p
              className="text-base font-medium tracking-wide text-blue-300"
              animate={{ 
                y: [0, -1, 0],
                opacity: [0.7, 1, 0.7]
              }}
            transition={{
                duration: 2,
              repeat: Infinity,
                ease: "easeInOut"
            }}
          >
            {language === 'fr' 
              ? "Préparation de l'expérience..."
              : "Preparing experience..."
            }
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen; 