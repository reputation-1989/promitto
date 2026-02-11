import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function SkeletonCard({ className }) {
  return (
    <div className={clsx('card-premium p-8 space-y-4', className)}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl skeleton" />
        <div className="flex-1 space-y-3">
          <div className="h-4 rounded skeleton w-3/4" />
          <div className="h-3 rounded skeleton w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded skeleton w-full" />
        <div className="h-3 rounded skeleton w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return <div className={clsx('rounded-full skeleton', sizes[size])} />;
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded skeleton"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonButton({ className }) {
  return <div className={clsx('h-12 rounded-xl skeleton', className)} />;
}

export function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={clsx(
        'border-2 border-accent-purple/20 border-t-accent-purple rounded-full',
        sizes[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}