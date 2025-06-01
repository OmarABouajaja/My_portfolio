import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { certificates } from '@/data/certificates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, ExternalLink } from 'lucide-react';

const Certifications = () => {
  const { t, currentLanguage } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);

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

  const categories = [
    { value: 'all', label: t('all'), icon: Award },
    { value: 'robotics', label: t('roboticsCerts'), icon: Award },
    { value: 'education', label: t('educationCerts'), icon: Award },
    { value: 'skills', label: t('softSkillsCerts'), icon: Award }
  ];

  const filteredCertificates = filter === 'all'
    ? certificates
    : certificates.filter(cert => cert.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/5">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.div 
            className="text-center space-y-6 mb-16"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {t('certificationsTitle')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('certificationsSubtitle')}
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={filter === category.value ? "default" : "outline"}
                  onClick={() => setFilter(category.value)}
                  size="lg"
                  className="group relative overflow-hidden"
                >
                  <Icon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {category.label}
                  {filter === category.value && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              );
            })}
          </motion.div>

          {/* Certificates Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              {filteredCertificates.map((certificate) => (
                <motion.article
                  key={certificate.id}
                  className="group relative bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
                  variants={itemVariants}
                  layout
                  onHoverStart={() => setHoveredCert(certificate.id)}
                  onHoverEnd={() => setHoveredCert(null)}
                >
                  {/* Certificate Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={`/certificates/${certificate.filename}`}
                      alt={certificate.title[currentLanguage]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 right-4">
                      <Badge className="flex items-center gap-1 bg-background/80 backdrop-blur-sm">
                        <Calendar className="w-4 h-4" />
                        {certificate.year}
                      </Badge>
                    </div>
                  </div>

                  {/* Certificate Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {certificate.title[currentLanguage]}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-3">
                      {certificate.description[currentLanguage]}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <Badge 
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {categories.find(cat => cat.value === certificate.category)?.label}
                      </Badge>

                      {certificate.url && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="group/btn"
                        >
                          <a 
                            href={certificate.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            {t('viewCertificate')}
                            <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <AnimatePresence>
                    {hoveredCert === certificate.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default Certifications; 