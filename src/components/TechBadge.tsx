import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { techIcons, TechIconName } from '@/data/techIcons';
import { cn } from '@/lib/utils';

interface TechBadgeProps {
  name: TechIconName;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

const TechBadge = ({ name, className, size = 'md', showName = true }: TechBadgeProps) => {
  const tech = techIcons[name];
  
  if (!tech) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <Badge 
        variant="secondary"
        className={cn(
          'flex items-center gap-2 px-2.5 py-1',
          'bg-gradient-to-br transition-all duration-300',
          'border border-transparent hover:border-primary/10',
          'shadow-sm hover:shadow',
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${tech.gradient[0]}10, ${tech.gradient[1]}10)`,
          color: tech.color
        }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(sizeClasses[size], 'relative')}
        >
          <tech.icon className="w-full h-full" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${tech.gradient[0]}, ${tech.gradient[1]})`,
              mixBlendMode: 'soft-light'
            }}
          />
        </motion.div>
        {showName && (
          <span className="text-sm font-medium">
            {name}
          </span>
        )}
      </Badge>
      <motion.div
        className="absolute -inset-0.5 rounded-md bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"
        style={{
          background: `linear-gradient(135deg, ${tech.gradient[0]}, ${tech.gradient[1]})`
        }}
      />
    </motion.div>
  );
};

export default TechBadge; 