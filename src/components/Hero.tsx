import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language';
import { FileText, Rocket } from 'lucide-react';
import { TranslationContent } from '@/data/translations';

const Hero = () => {
  const { t } = useLanguage();
  const heroTitle = t('heroTitle') as TranslationContent['heroTitle'];
  const heroSubtitle = t('heroSubtitle') as TranslationContent['heroSubtitle'];
  const exploreProjects = t('exploreProjects') as TranslationContent['exploreProjects'];
  const downloadCV = t('downloadCV') as TranslationContent['downloadCV'];

  const handleScrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/resume/omar-cv-en.pdf';
    link.download = 'Omar_Abouajaja_CV_EN.pdf';
    link.click();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
          style={{ width: '100%', overflow: 'hidden' }}
        >
          {/* Main Title */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="block">Omar Abouajaja</span>
            <span className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground mt-4 block">
              <TypeAnimation
                sequence={[
                  'IoT Developer',
                  2000,
                  'Robotics Trainer',
                  2000,
                  'Tech Innovator',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-xl md:text-2xl font-medium gradient-text mb-4">
              {heroTitle}
            </h2>
            <p className="text-muted-foreground">
              {heroSubtitle}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Button
              size="lg"
              onClick={handleScrollToProjects}
              className="tech-gradient text-white hover:scale-105 transition-transform duration-300"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {exploreProjects}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadCV}
              className="hover:scale-105 transition-transform duration-300 border-2"
            >
              <FileText className="w-5 h-5 mr-2" />
              {downloadCV}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 