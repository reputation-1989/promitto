import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Card({ children, className, hover = false, glow = false, ...props }) {
  if (glow) {
    return (
      <motion.div
        className={clsx('glow-card', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        {...props}
      >
        <div className="glow-card-inner p-6">
          {children}
        </div>
      </motion.div>
    );
  }

  if (hover) {
    return (
      <motion.div
        className={clsx('card-premium-hover p-6', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={clsx('card-premium p-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ icon, value, label, delay = 0 }) {
  return (
    <motion.div
      className="card-premium p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        delay: delay 
      }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-purple-glow mb-3"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {icon}
      </motion.div>
      <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-sm text-text-tertiary">{label}</div>
    </motion.div>
  );
}