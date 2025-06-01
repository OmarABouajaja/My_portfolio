import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { projects, categories, Category } from '@/data/projects.ts';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

const CONTEXT = {
  en: `Since 2018, I've been creating hands-on projects in IoT, embedded systems, robotics and web development. These projects were built in personal, competitive or community-based settings. They reflect my growth, curiosity, and ability to turn ideas into working solutions.`,
  fr: `Depuis 2018, je développe des projets pratiques dans les domaines de l'IoT, des systèmes embarqués, de la robotique et du développement web. Ces projets ont été réalisés dans un cadre personnel, associatif, ou compétitif, et reflètent ma progression technique, mon autonomie, et ma volonté de créer des solutions utiles et concrètes.`
};

const DISCOVER = {
  en: {
    github: 'View all projects on GitHub',
    linkedin: 'Connect on LinkedIn',
    contact: 'Contact me',
  },
  fr: {
    github: 'Voir tous les projets sur GitHub',
    linkedin: 'Me contacter sur LinkedIn',
    contact: 'Me contacter',
  }
};

const CATEGORY_COLORS = {
  iot: 'bg-blue-100 text-blue-700',
  embedded: 'bg-green-100 text-green-700',
  robotics: 'bg-purple-100 text-purple-700',
  web: 'bg-pink-100 text-pink-700',
  all: 'bg-gray-100 text-gray-700',
};

const Projects = () => {
  const { t, currentLanguage } = useLanguage();
  const [filter, setFilter] = useState<Category>('all');

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => (p.category === filter || (filter === 'embedded' && p.category === 'iot')));

  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        {/* Section Intro */}
      <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <motion.div 
            className="text-center space-y-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent tracking-tight">
              {t('projectsPageTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('projectsPageIntro')}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`rounded-full px-5 py-2 font-semibold text-base transition-all duration-300 group relative overflow-hidden hover:scale-105 backdrop-blur-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/40 ${filter === category.value ? 'bg-primary text-white shadow-lg' : 'bg-card/70 text-muted-foreground'}`}
                style={{ minWidth: 120 }}
              >
                <span>
                  {category.label[currentLanguage]}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
            <motion.article
              key={project.id}
                  className="group relative bg-white/80 dark:bg-card/70 backdrop-blur-lg rounded-2xl overflow-hidden border border-border/70 hover:border-primary/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.025]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
            >
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold shadow-sm ${CATEGORY_COLORS[project.category] || 'bg-gray-100 text-gray-700'}`}>
                      {categories.find(c => c.value === project.category)?.label[currentLanguage]}
                    </span>
                  </div>
              {/* Project Content */}
                  <div className="p-8 pt-14 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {project.title[currentLanguage]}
                </h3>
                      <span className="text-sm text-muted-foreground font-semibold">({project.year})</span>
                      {project.award && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{project.award}</span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {project.description[currentLanguage]}
                </p>
                {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.stack?.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-primary/10 text-primary font-medium tracking-wide px-3 py-1 rounded-full text-xs md:text-sm"
                        >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
            </AnimatePresence>
        </motion.div>
      </motion.section>
      </div>
    </div>
  );
};

export default Projects; 