import { motion } from 'framer-motion';
import { Button } from './Button';

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  actionLabel,
  secondary,
  secondaryLabel 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="text-center py-16 px-6"
    >
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl icon-container mb-6"
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      
      <div className="space-y-3 mb-8">
        <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
        <p className="text-text-secondary max-w-md mx-auto text-balance leading-relaxed">
          {description}
        </p>
      </div>
      
      {(action || secondary) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Button onClick={action} size="lg">
              {actionLabel}
            </Button>
          )}
          {secondary && (
            <Button onClick={secondary} variant="secondary" size="lg">
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}