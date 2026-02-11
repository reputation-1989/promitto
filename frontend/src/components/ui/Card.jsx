import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Card({ children, className, hover = false, glow = false, ...props }) {
  if (glow) {
    return (
      <motion.div
        className={clsx('glow-card', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        {...props}
      >
        <div className="glow-card-inner p-8">
          {children}
        </div>
      </motion.div>
    );
  }

  if (hover) {
    return (
      <motion.div
        className={clsx('card-premium-hover p-8', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={clsx('card-premium p-8', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ icon, value, label, delay = 0 }) {
  return (
    <motion.div
      className="group card-premium p-6 text-center hover:border-border-hover hover:shadow-elevated-lg hover:-translate-y-1 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: delay 
      }}
    >
      <motion.div
        className="icon-container-hover mx-auto mb-4"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {icon}
      </motion.div>
      <div className="text-4xl font-bold text-text-primary mb-2 tracking-tight">{value}</div>
      <div className="text-sm font-medium text-text-tertiary">{label}</div>
    </motion.div>
  );
}