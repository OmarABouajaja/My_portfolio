import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ArrowRight, Filter } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { projects, categories, type Category } from '@/data/projects';
import { cn } from '@/lib/utils';

const Projects = () => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        project.title[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.stack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, currentLanguage]);

  const handleCategoryChange = (value: Category) => {
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
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent",
            isRTL && "font-arabic"
          )}>
            {t('projectsTitle')}
          </h1>
          <p className={cn(
            "text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed",
            isRTL && "font-arabic"
          )}>
            {t('projectsSubtitle')}
          </p>
        </motion.div>

        {/* Filter and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-4xl mx-auto",
            isRTL && "md:flex-row-reverse"
          )}
        >
          {/* Category Filter */}
          <div className="w-full md:w-auto flex-shrink-0">
            <Label htmlFor="category-filter" className="sr-only">{t('filterByCategory')}</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter" className="w-full md:w-[180px] bg-background/50 backdrop-blur-sm">
                <Filter className={cn("h-4 w-4 text-muted-foreground", isRTL ? "ml-2" : "mr-2")} />
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent className="bg-background/50 backdrop-blur-sm">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                    className={cn(isRTL && "font-arabic")}
                  >
                    {category.label[currentLanguage]}
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
              className={cn(
                "w-full bg-background/50 backdrop-blur-sm",
                isRTL && "text-right font-arabic"
              )}
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
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
                    <span className={cn(
                      "absolute top-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md z-10",
                      isRTL ? "right-2" : "left-2"
                    )}>
                      {project.award}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow space-y-3 relative z-10">
                  <h3 className={cn(
                    "text-xl font-bold",
                    isRTL && "font-arabic"
                  )}>
                    {project.title[currentLanguage]}
                  </h3>
                  <p className={cn(
                    "text-muted-foreground text-sm flex-grow",
                    isRTL && "font-arabic"
                  )}>
                    {project.description[currentLanguage]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.stack.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className={cn(
                          "bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full",
                          isRTL && "font-arabic"
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className={cn(
                    "flex gap-3 mt-6",
                    isRTL && "flex-row-reverse"
                  )}>
                    {project.github && (
                      <Button asChild variant="outline" size="sm" className="btn-outline-glow">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className={cn(
                          "flex items-center gap-1",
                          isRTL && "flex-row-reverse"
                        )}>
                          GitHub <ArrowRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button asChild size="sm" className="btn-gradient">
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className={cn(
                          "flex items-center gap-1",
                          isRTL && "flex-row-reverse"
                        )}>
                          Demo <ArrowRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
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
              className={cn(
                "text-center text-muted-foreground py-16",
                isRTL && "font-arabic"
              )}
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