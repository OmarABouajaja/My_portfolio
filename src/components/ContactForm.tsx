import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimit'>('idle');
  const [submitCount, setSubmitCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t('messageSent'),
        description: t('responseTime'),
      });
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
    } catch (error) {
      toast({
        title: t('messageError'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setSubmitCount((prev) => prev + 1);
    }
  };

  if (submitCount >= 3) {
    return (
      <div className="text-center">
        <p className="text-lg font-medium">{t('tooManyAttempts')}</p>
        <p className="text-sm text-muted-foreground">{t('tryAgainLater')}</p>
      </div>
    );
  }

  return (
    <Card className="p-6 glass-effect border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field */}
        <div className="hidden">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('name')} *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                minLength={2}
                maxLength={50}
                placeholder={t('name')}
                className="glass-input"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('email')} *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder={t('email')}
                className="glass-input"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              {t('message')} *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              minLength={10}
              maxLength={1000}
              placeholder={t('message')}
              className="glass-input min-h-[150px]"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('responseTime')}
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || submitStatus === 'rateLimit'}
            className="tech-gradient"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? t('sending') : t('send')}
          </Button>
        </div>

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {submitStatus === 'success' && (
            <p className="text-green-500 text-sm mt-4 flex items-center">
              <span className="mr-2">✅</span>
              {t('messageSent')}
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-500 text-sm mt-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t('messageError')} {t('tryAgainLater')}
            </p>
          )}
          {submitStatus === 'rateLimit' && (
            <p className="text-yellow-500 text-sm mt-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t('tooManyAttempts')} {t('tryAgainLater')}
            </p>
          )}
        </motion.div>
      </form>
    </Card>
  );
};

export default ContactForm; 