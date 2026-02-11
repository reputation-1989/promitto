import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Card({ children, className, hover = false, glow = false, ...props }) {
  if (glow) {
    return (
      <motion.div
        className={clsx('glow-card p-[1px]', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
        whileHover={{ y: -4 }}
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
      className="card-premium-glow group cursor-default"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25,
        delay: delay 
      }}
    >
      <div className="p-6 text-center space-y-4">
        <motion.div
          className="inline-flex items-center justify-center w-14 h-14 rounded-xl icon-container-hover"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <div className="space-y-1">
          <div className="text-4xl font-bold text-text-primary tracking-tight">{value}</div>
          <div className="text-sm text-text-tertiary font-medium tracking-wide uppercase">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}