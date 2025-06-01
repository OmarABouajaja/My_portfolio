import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, AlertTriangle } from 'lucide-react';
import { checkRateLimit } from '@/utils/emailObfuscator';

const ContactForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimit'>('idle');
  const [formStartTime] = useState(Date.now());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Honeypot check
    if (formData.get('website')) {
      return; // Bot detected, silently reject
    }

    // Time-based bot detection
    const timeDiff = Date.now() - formStartTime;
    if (timeDiff < 3000) { // If form is submitted in less than 3 seconds
      return; // Likely a bot, silently reject
    }

    // Rate limiting
    const identifier = formData.get('email') as string;
    if (!checkRateLimit(identifier)) {
      setSubmitStatus('rateLimit');
      return;
    }

    // Input validation
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus('error');
      return;
    }

    // Message validation (no URLs/links)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(message)) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Form-Start-Time': formStartTime.toString(),
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          timestamp: new Date().toISOString(),
          // Additional security metadata
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userAgent: navigator.userAgent,
          language: navigator.language,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setSubmitStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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