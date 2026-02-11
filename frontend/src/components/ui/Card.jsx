import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Card({ children, className, hover = true, ...props }) {
  const Component = hover ? motion.div : 'div';
  
  return (
    <Component
      className={clsx(
        'glass-card p-6',
        hover && 'glass-card-hover cursor-pointer',
        className
      )}
      {...(hover && {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      })}
      {...props}
    >
      {children}
    </Component>
  );
}

export function GradientCard({ children, className, gradient = 'purple', ...props }) {
  const gradients = {
    purple: 'from-primary-600 to-primary-800',
    pink: 'from-pink-500 to-purple-600',
    blue: 'from-blue-500 to-cyan-500',
  };

  return (
    <motion.div
      className={clsx(
        'bg-gradient-to-br rounded-2xl p-6 shadow-premium-lg',
        gradients[gradient],
        className
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}