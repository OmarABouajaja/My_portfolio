import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ContactFormProps {
  // Add any props if needed
}

const ContactForm = forwardRef<HTMLFormElement, ContactFormProps>((_, ref) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const response = await fetch('https://formspree.io/f/xgvkjoqd', { // Replace with your Formspree endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: t('contactSuccess'),
          duration: 3000,
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMessage('An error occurred. Please try again later.');
        throw new Error(); // Throw to catch in the catch block
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (!errorMessage) { // Prevent overwriting specific spam error
         setErrorMessage('An error occurred. Please try again later.');
      }

      toast({
        title: t('contactTitle'), // Use a generic title or error title
        description: errorMessage || 'Failed to send message.', // Use specific error or generic one
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      ref={ref}
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }} // Adjust delay if needed
    >
       {/* Honeypot field (hidden from users) */}
       <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div>
        <Label htmlFor="name" className="block text-sm font-medium mb-2">
          {t('nameLabel')}
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium mb-2">
          {t('emailLabel')}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="message" className="block text-sm font-medium mb-2">
          {t('messageLabel')}
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="w-full flex items-center justify-center" // Add flex, items-center, justify-center
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('sendMessage')}
        {!isSubmitting && <Send className="ml-2 h-4 w-4" />} {/* Show icon only when not submitting */}
      </Button>
      {errorMessage && (
         <div className="text-red-500 text-center mt-2">{errorMessage}</div>
      )}
    </motion.form>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm; 