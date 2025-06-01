import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Card } from '@/components/ui/card';
import TechBadge from '@/components/TechBadge';
import { cn } from '@/lib/utils';

const Bio = () => {
  const { t } = useLanguage();
  const technologies = [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'Next.js',
    'Tailwind CSS',
    'Framer Motion',
    'Git',
    'Docker',
    'AWS'
  ];

  return (
    <section id="bio" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="p-6 glass-effect border-0">
              <h3 className="text-2xl font-bold mb-6">{t('bioTitle')}</h3>
              <p className="text-muted-foreground mb-4">{t('bioSubtitle')}</p>
              <div className="space-y-4">
                <p>{t('iotDescription')}</p>
                <p>{t('roboticsDescription')}</p>
                <p>{t('embeddedDescription')}</p>
                <p>{t('uiuxDescription')}</p>
                <p>{t('webdevDescription')}</p>
                <p>{t('teachingDescription')}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <Card className="p-6 glass-effect border-0">
              <h3 className="text-2xl font-bold mb-6">{t('technologies')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                      delay: index * 0.1
                    }}
                  >
                    <TechBadge 
                      name={tech}
                      size="lg"
                      className="w-full justify-center"
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Bio; 