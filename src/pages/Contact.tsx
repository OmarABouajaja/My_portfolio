import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { PERSONAL_INFO, SOCIAL_LINKS, SUPPORT_LINKS } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Github, Linkedin, Twitter, Globe, Heart, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

const Contact = () => {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    // Honeypot field
    if (formData.get('website')) {
      setIsSubmitting(false);
      setErrorMessage('Spam detected.');
      return;
    }
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      _subject: `New message from ${formData.get('name')}`
    };

    try {
      const response = await fetch('https://formspree.io/f/xgvkjoqd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: t('contactSuccess'),
          duration: 3000
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMessage('An error occurred. Please try again later.');
        throw new Error();
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      toast({
        title: t('contactTitle'),
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 py-16 md:py-24">
      <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            className="text-center space-y-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          {t('contactTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('contactDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
            <motion.div 
              variants={containerVariants}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-2xl blur-3xl -z-10" />
              <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg">
                {/* Honeypot field (hidden from users) */}
                <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('nameLabel')}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isSubmitting}
                    className="bg-background/50"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('emailLabel')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                    className="bg-background/50"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('messageLabel')}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  disabled={isSubmitting}
                    className="bg-background/50 resize-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                    className="w-full group relative overflow-hidden flex items-center justify-center font-semibold hover:scale-105 transition-transform backdrop-blur-sm"
                  disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {t('sendMessage')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </motion.div>
                {/* Error message */}
                {errorMessage && (
                  <div className="text-red-500 text-center mt-2">{errorMessage}</div>
                )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            {/* Social Links */}
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              {Object.entries(SOCIAL_LINKS).map(([key, link]) => (
                <motion.a
                  key={key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 shadow-lg transition-all duration-300 group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {key === 'github' ? <Github className="w-5 h-5 text-primary" /> :
                       key === 'linkedin' ? <Linkedin className="w-5 h-5 text-primary" /> :
                       key === 'twitter' ? <Twitter className="w-5 h-5 text-primary" /> :
                       <Globe className="w-5 h-5 text-primary" />}
                    </div>
                    <span className="font-medium">{link.label}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Support Links */}
            <motion.div 
                className="space-y-6 pt-8 border-t border-border/50"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-center text-muted-foreground flex items-center justify-center gap-2"
                  variants={itemVariants}
                >
                  <Heart className="w-4 h-4 text-primary" />
                  {t('contactMe')}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                {Object.entries(SUPPORT_LINKS).map(([key, link]) => (
                  <Button
                    key={key}
                    asChild
                    variant="outline"
                      className="group relative overflow-hidden font-semibold hover:scale-105 transition-transform backdrop-blur-sm"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                        <span className="relative z-10">{link.icon}</span>
                        <span className="relative z-10">{link.label[currentLanguage as 'en' | 'fr']}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </a>
                  </Button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      </div>
    </div>
  );
};

export default Contact; 