import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { EDUCATION, ACHIEVEMENTS } from '@/data/constants';
import { Button } from '@/components/ui/button';

const Resume = () => {
  const { t, currentLanguage } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          variants={itemVariants}
        >
          {t('resumeTitle')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground text-center mb-12"
          variants={itemVariants}
        >
          {t('resumeSubtitle')}
        </motion.p>

        {/* Download Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          variants={itemVariants}
        >
          <Button asChild size="lg">
            <a 
              href={`/Resume_EN.pdf`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t('downloadEN')} 🇬🇧
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a 
              href={`/Resume_FR.pdf`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t('downloadFR')} 🇫🇷
            </a>
          </Button>
        </motion.div>

        {/* Education Timeline */}
        <motion.div 
          className="max-w-3xl mx-auto mb-16"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8"
            variants={itemVariants}
          >
            {t('educationTitle')}
          </motion.h2>

          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            {EDUCATION.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex gap-4 items-start"
                variants={itemVariants}
              >
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-lg font-semibold">{item.year}</span>
                </div>
                
                <div className="flex-grow relative pl-8 pb-8">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-primary rounded-full" />
                  {index !== EDUCATION.length - 1 && (
                    <div className="absolute left-[5px] top-4 w-[2px] h-full bg-border" />
                  )}
                  <div className="bg-card rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {item.title[currentLanguage]}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.details[currentLanguage]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Achievements */}
        <motion.div 
          className="max-w-3xl mx-auto"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8"
            variants={itemVariants}
          >
            {t('achievements')}
          </motion.h2>

          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            {ACHIEVEMENTS.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex gap-4 items-start"
                variants={itemVariants}
              >
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-lg font-semibold">{item.year}</span>
                </div>
                
                <div className="flex-grow relative pl-8 pb-8">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-primary rounded-full" />
                  {index !== ACHIEVEMENTS.length - 1 && (
                    <div className="absolute left-[5px] top-4 w-[2px] h-full bg-border" />
                  )}
                  <div className="bg-card rounded-lg p-4 shadow-sm">
                    <p className="text-lg">
                      {item.title[currentLanguage]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Resume; 