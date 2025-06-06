import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ArrowRight, Filter } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

const Projects = () => {
  const { t, currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    // Assuming categories are also translated via the t function or directly available
    // If not, you might need to fetch or define them similarly to projects
    // For now, let's assume they are available via t or a constant import if needed.
    // Using a placeholder structure based on common patterns.
    return [
      { value: "all", label: t('projectCategories.all') || "All Projects" },
      { value: "iot", label: t('projectCategories.iot') || "IoT" },
      { value: "embedded", label: t('projectCategories.embedded') || "Embedded" },
      { value: "robotics", label: t('projectCategories.robotics') || "Robotik" },
      { value: "web", label: t('projectCategories.web') || "Web Development" },
    ];
  }, [t]);

  // Define the missing 'projects' variable
  const projects = [
    { id: 1, title: { en: 'Project 1', fr: 'Projet 1', ar: 'مشروع 1', de: 'Projekt 1' }, description: { en: 'Description 1', fr: 'Description 1', ar: 'وصف 1', de: 'Beschreibung 1' }, category: 'web', stack: ['React', 'TypeScript'], image: '', github: '', demo: '', award: 'Award 1' },
    { id: 2, title: { en: 'Project 2', fr: 'Projet 2', ar: 'مشروع 2', de: 'Projekt 2' }, description: { en: 'Description 2', fr: 'Description 2', ar: 'وصف 2', de: 'Beschreibung 2' }, category: 'iot', stack: ['Arduino', 'C++'], image: '', github: '', demo: '', award: 'Award 2' },
    // Add more project objects as needed
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project: typeof projects[number]) => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        project.title[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.stack.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchTerm, currentLanguage]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="relative min-h-screen py-20 md:py-32">
      <AnimatedBackground />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 relative z-10"
      >
        <motion.div
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {t('projectsTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('projectsSubtitle')}
          </p>
        </motion.div>

        {/* Filter and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-4xl mx-auto"
        >
          {/* Category Filter */}
          <div className="w-full md:w-auto flex-shrink-0">
            <Label htmlFor="category-filter" className="sr-only">{t('filterByCategory')}</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter" className="w-full md:w-[180px] bg-background/50 backdrop-blur-sm">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent className="bg-background/50 backdrop-blur-sm">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="w-full md:flex-grow">
            <Label htmlFor="project-search" className="sr-only">{t('searchProjects')}</Label>
            <Input
              id="project-search"
              type="text"
              placeholder={t('searchProjectsPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-background/50 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout // Enable layout animations
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project: typeof projects[number], index: number) => (
              <motion.div
                key={project.id}
                layout // Enable layout animations for items
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 shadow-lg flex flex-col group card-hover relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title[currentLanguage]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.award && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md z-10">
                      {project.award}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow space-y-3 relative z-10">
                  <h3 className="text-xl font-bold">{project.title[currentLanguage]}</h3>
                  <p className="text-muted-foreground text-sm flex-grow">{project.description[currentLanguage]}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.stack.map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    {project.github && (
                      <Button asChild variant="outline" size="sm" className="btn-outline-glow">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          GitHub <ArrowRight className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button asChild size="sm" className="btn-gradient">
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          Demo <ArrowRight className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        <AnimatePresence>
          {filteredProjects.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center text-muted-foreground py-16"
            >
              {t('noProjectsFound')}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
};

export default Projects; 