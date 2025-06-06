import React, { lazy, Suspense, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TranslationContent } from '@/types/translations';
import SkillsDisplay from '@/components/SkillsDisplay';

// Lazy load heavy components
const NetworkBackground = lazy(() => import('@/components/ui/NetworkBackground'));

const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}> = ({ children, className, delay = 0, id }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className={cn("py-20 md:py-32 px-4 sm:px-6", className)}
    >
      {children}
    </motion.section>
  );
};

const Home: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Memoized scroll animations
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, 100]);
  const progressBarScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Memoized handlers
  const downloadCV = useCallback(() => {
    const cvUrl = "https://drive.google.com/file/d/1IuD6Dhwm2onXKXCXss5PKwW9S1HazVBA/view?usp=sharing";
    window.open(cvUrl, '_blank');
  }, []);

  // Scroll to next section
  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('motivation-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 z-50"
        style={{ scaleX: progressBarScaleX, transformOrigin: "0%" }}
      />

      {/* Network Background with Suspense and fallback */}
      <Suspense fallback={
        <div className="fixed inset-0 bg-background animate-pulse" />
      }>
        <NetworkBackground />
      </Suspense>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center py-16 md:py-24 overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-12 md:space-y-16"
          >
            <motion.div className="text-center space-y-8">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="relative inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {t('intro')}
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </span>
              </motion.h1>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl text-foreground/90 max-w-4xl mx-auto font-medium leading-relaxed"
                >
                {t('heroTitle')}
                </motion.p>
                <div className="absolute -inset-x-full -inset-y-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl -z-10" />
              </motion.div>

              <motion.p 
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('heroSubtitle')}
              </motion.p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-4"
            >
              {Object.entries(t('stats')).filter(([key]) => key !== 'title').map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, translateY: -5 }}
                  className="p-6 rounded-xl glass-effect card-hover backdrop-blur-sm border border-slate-200/10 dark:border-slate-700/30 relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <p className="text-lg md:text-xl font-bold text-foreground/90 relative z-10">
                    {value as React.ReactNode}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden btn-gradient min-w-[200px] transform-gpu text-lg h-14 group"
              >
                <Link to="/projects" className="flex items-center justify-center">
                  <span className="relative z-10">{t('exploreProjects')}</span>
                  <motion.div
                    className="ml-2 relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={downloadCV}
                className="btn-outline-glow min-w-[200px] transform-gpu text-lg h-14 border-2 relative overflow-hidden group"
              >
                <span className="relative z-10">{t('downloadCV')}</span>
                <motion.div
                  className="ml-2 relative z-10"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Download className="h-5 w-5" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToNextSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer focus:outline-none group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-12 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center backdrop-blur-sm relative overflow-hidden"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="text-primary relative z-10"
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </motion.button>
      </section>

      {/* Motivation Section */}
      <Section id="motivation-section" className="bg-gradient-to-b from-muted/5 to-transparent relative">
        <div className="absolute inset-0 bg-grid-primary/5 mask-gradient-b" />
        <div className="container mx-auto max-w-4xl px-4 relative">
          <motion.div className="text-center space-y-8">
            <motion.h2 
              className="title-section relative inline-block text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {String(t('motivation.title'))}
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-foreground/90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {String(t('motivation.description'))}
            </motion.p>
          </motion.div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section className="bg-gradient-to-b from-transparent to-muted/5">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div className="space-y-12">
            <motion.h2 
              className="title-section text-center relative inline-block text-3xl sm:text-4xl md:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {String(t('skills.title'))}
            </motion.h2>
            <SkillsDisplay />
          </motion.div>
        </div>
      </Section>

      {/* Community Section */}
      <Section className="bg-gradient-to-b from-transparent to-muted/5">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div className="space-y-12">
            <motion.div 
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="title-section">{String(t('community.title'))}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
                {String(t('community.description'))}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Explicitly type community activities and iterate over entries */}
              {Object.entries(t('community.activities') as TranslationContent['community']['activities']).map(([key, activity]: [string, { title: string; description: string }], index) => (
                <motion.div
                  key={key} // Use key from Object.entries
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect rounded-xl p-6 space-y-4 card-hover"
                >
                  <h3 className="title-card">{activity.title}</h3>
                  <p className="text-muted-foreground">{activity.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl text-foreground/90 italic">
                {String(t('community.conclusion'))}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section className="bg-gradient-to-b from-transparent to-muted/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center space-y-8">
            <h2 className="title-section">{String(t('timeline.title'))}</h2>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {String(t('timeline.intro'))}
            </motion.p>

            {/* Vertical Timeline Line with Gradient and Glow */}
            
            

            
              
                {/* Explicitly type entry */}
                {Object.entries(t('timeline.entries') as TranslationContent['timeline']['entries'])
                  .sort(([keyA], [keyB]) => {
                    // Extract year and optional suffix from keys
                    const [yearStrA, suffixStrA] = keyA.split('-');
                    const [yearStrB, suffixStrB] = keyB.split('-');

                    const yearA = parseInt(yearStrA);
                    const yearB = parseInt(yearStrB);

                    // If years are equal, sort by the suffix (e.g., "2022-2" comes after "2022")
                    if (yearA === yearB) {
                      const suffixA = parseInt(suffixStrA || '0');
                      const suffixB = parseInt(suffixStrB || '0');
                      return suffixB - suffixA;
                    }
                    return yearB - yearA;
                  })
                  .map(([year, entry]: [string, TranslationContent['timeline']['entries'][string]], index) => {
                    // Display only the year part
                    const displayYear = year.split('-')[0];
                    return (
                  <motion.div
                    key={year}
                        initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative flex gap-8 items-start group"
                  >
                        {/* Year Circle with Enhanced Design */}
                        <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center">
                          {/* Outer Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-md animate-pulse" />
                          {/* Inner Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-sm" />
                          {/* Main Circle */}
                          <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center group-hover:border-primary/80 transition-colors duration-300">
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                              {displayYear}
                            </span>
                          </div>
                          {/* Connecting Line */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>

                        {/* Content Card with Enhanced Design */}
                        <div className="flex-grow">
                          <div className="glass-effect rounded-xl p-6 space-y-3 group-hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                            {/* Card Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 relative">
                              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                {String(entry[currentLanguage as keyof typeof entry])}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground relative">
                              {entry.description[currentLanguage as keyof typeof entry.description]}
                            </p>
                    </div>
                    </div>
                  </motion.div>
                    );
                  })}
              
            
            {/* The Timeline component should be rendered here */}

          </motion.div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-muted/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div className="space-y-6">
            <h2 className="title-section">{t('contactTitle')}</h2>
            <p className="text-xl text-muted-foreground">{t('contactDesc')}</p>
            <Button
              asChild
              size="lg"
              className="btn-gradient transform-gpu"
            >
              <Link to="/contact" className="flex items-center">
                {t('contactMe')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default Home; 