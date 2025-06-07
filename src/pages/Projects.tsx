import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Filter } from 'lucide-react';
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 flex flex-col md:flex-row gap-4 justify-end items-center"
        >
          <div className="w-full md:w-auto flex-grow">
            <Label htmlFor="search" className="sr-only">Search projects</Label>
            <Input
              id="search"
              type="text"
              placeholder={t('searchProjects') as string}
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger className="w-full md:w-auto bg-card/50 backdrop-blur-sm border-border/50">
              <Filter className="mr-2 h-4 w-4 text-primary" />
              <SelectValue placeholder={t('filterByCategory') as string} />
            </SelectTrigger>
            <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label[currentLanguage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-foreground/90 group-hover:text-primary transition-colors duration-300">
                    {project.title[currentLanguage]}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {project.description[currentLanguage]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                    <span>{project.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* New Global Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: filteredProjects.length * 0.05 + 0.2 }} // Adjust delay based on project count
          className="text-center mt-16 space-y-4"
        >
          <p className="text-lg text-muted-foreground">
            {t('checkOutMore')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://github.com/OmarABouajaja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github mr-2 h-4 w-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3.5 0 4.1-1.3 4.1-2.2 0-.7-.2-1.2-.5-1.5.3-.7.3-1.3.3-2.6 0-.6 0-1.1-.3-1.6 0 0-1.4 0-2.8 1.3a9.4 9.4 0 0 0-6.2 0C6.6 6.8 5.2 6.8 5.2 6.8c-.3.5-.3 1-.3 1.6 0 1.3 0 1.9.3 2.6-.3.3-.5.8-.5 1.5 0 .9.6 2.2 4.1 2.2-.2.2-.4.5-.5.8-.4.4-.7 1-.9 1.7-.2.7-.3 1.3-.3 1.9v4M12 22v-4a4.8 4.8 0 0 0-1-3.2c3.5 0 4.1-1.3 4.1-2.2 0-.7-.2-1.2-.5-1.5.3-.7.3-1.3.3-2.6 0-.6 0-1.1-.3-1.6 0 0-1.4 0-2.8 1.3a9.4 9.4 0 0 0-6.2 0C6.6 6.8 5.2 6.8 5.2 6.8c-.3.5-.3 1-.3 1.6 0 1.3 0 1.9.3 2.6-.3.3-.5.8-.5 1.5 0 .9.6 2.2 4.1 2.2-.2.2-.4.5-.5.8-.4.4-.7 1-.9 1.7-.2.7-.3 1.3-.3 1.9v4"></path></svg>
              <span>{t('viewGithub')}</span>
            </a>
            <a
              href="https://www.linkedin.com/in/omar-abouajaja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin mr-2 h-4 w-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span>{t('viewLinkedIn')}</span>
            </a>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Projects; 