import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useLanguage } from '@/providers/language';

// Define a type for timeline entries, matching the structure in translations.ts
interface TimelineEntry {
  title: string;
  description: string;
  year: string;
  award?: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const { isRTL } = useLanguage();

  return (
    <div className="relative mt-12">
      {/* Vertical Timeline Line with Gradient and Glow */}
      <div className={`absolute ${isRTL ? 'right-8' : 'left-8'} top-0 bottom-0 w-0.5`}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/50" />
        <div className="absolute inset-0 bg-primary/20 blur-sm" />
      </div>

      <div className="space-y-12">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.year}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex gap-8 items-start group ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {/* Year Circle with Enhanced Design */}
            <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-md animate-pulse" />
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-sm" />
              {/* Main Circle */}
              <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center group-hover:border-primary/80 transition-colors duration-300">
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {entry.year}
                </span>
              </div>
              {/* Connecting Line */}
              <div className={`absolute ${isRTL ? 'right-1/2' : 'left-1/2'} top-1/2 -translate-y-1/2 ${isRTL ? 'translate-x-1/2' : '-translate-x-1/2'} w-8 h-0.5 bg-gradient-to-r ${isRTL ? 'from-transparent to-primary/50' : 'from-primary/50 to-transparent'}`} />
            </div>

            {/* Content Card with Enhanced Design */}
            <div className="flex-grow">
              <div className="glass-effect rounded-xl p-6 space-y-3 group-hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                {/* Card Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 relative">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {entry.title}
                  </h3>
                  {entry.award && (
                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                      <Award className="w-4 h-4" />
                      {entry.award}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground relative">
                  {entry.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline; 