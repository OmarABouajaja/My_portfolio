import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '@/components/ui/animated-background';

// ... rest of the imports and constants ...

const About = () => {
  const { currentLanguage } = useLanguage();

  const aboutContent = {
    fr: {
      title: 'À propos',
      desc: `Ingénieur passionné par l'IoT, la robotique et le développement web, j'aime concevoir des solutions concrètes et créatives. Depuis 2018, j'ai mené des projets techniques, participé à des compétitions et collaboré avec des associations et des clients. Mon objectif : apprendre, partager et innover.`
    },
    en: {
      title: 'About',
      desc: `Engineer passionate about IoT, robotics, and web development. I love building real-world, creative solutions. Since 2018, I have led technical projects, competed in challenges, and collaborated with associations and clients. My goal: learn, share, and innovate.`
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {aboutContent[currentLanguage].title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {aboutContent[currentLanguage].desc}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 text-center"
          >
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              {currentLanguage === 'fr'
                ? `Je suis diplômé en ingénierie informatique, spécialisé dans l'IoT et les systèmes embarqués. J'ai participé à des concours nationaux, animé des ateliers, et réalisé des projets freelance et associatifs. J'aime explorer de nouvelles technologies, partager mes connaissances et contribuer à des projets à impact.`
                : `I hold a degree in computer engineering, specializing in IoT and embedded systems. I've competed in national contests, led workshops, and delivered freelance and community projects. I enjoy exploring new tech, sharing knowledge, and contributing to impactful projects.`}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <Button asChild variant="outline" className="font-semibold hover:scale-105 transition-transform backdrop-blur-sm">
                <a href="https://linkedin.com/in/omar-abouajaja" target="_blank" rel="noopener noreferrer">
                  {currentLanguage === 'fr' ? 'Voir LinkedIn' : 'View LinkedIn'}
                </a>
              </Button>
              <Button asChild variant="default" className="font-semibold hover:scale-105 transition-transform backdrop-blur-sm">
                <Link to="/contact">
                  {currentLanguage === 'fr' ? 'Me contacter' : 'Contact me'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About; 