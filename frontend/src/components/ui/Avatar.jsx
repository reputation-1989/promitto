import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Avatar({ name, size = 'md', online = false, className }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
    '2xl': 'w-32 h-32 text-5xl',
  };

  return (
    <motion.div
      className={clsx('relative inline-block', className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-bold',
          'bg-gradient-to-br from-accent-purple to-accent-pink',
          'shadow-glow-subtle',
          sizes[size]
        )}
      >
        {name?.[0]?.toUpperCase()}
      </div>
      {online && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 status-online border-2 border-bg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        />
      )}
    </motion.div>
  );
}