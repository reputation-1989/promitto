import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LevelUpNotification({ level, show, onClose }) {
  if (show) {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#fbbf24'],
      ticks: 400,
    });
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative bg-gradient-to-br from-bg-elevated to-bg-hover border-2 border-accent-purple/30 rounded-3xl p-12 max-w-md w-full mx-4 text-center shadow-glow-strong"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block mb-6"
            >
              <Trophy className="w-24 h-24 text-accent-purple" strokeWidth={1.5} />
            </motion.div>

            <h2 className="text-5xl font-bold text-gradient-purple mb-4">Level Up!</h2>
            <p className="text-3xl font-bold mb-6">Level {level}</p>
            <p className="text-text-secondary mb-8">Your connection grows stronger!</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-accent-purple text-white font-semibold shadow-glow-medium hover:shadow-glow-strong transition-all duration-200"
            >
              Continue
            </motion.button>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <Sparkles className="absolute top-4 left-4 w-6 h-6 text-accent-purple animate-pulse" />
              <Sparkles className="absolute top-8 right-8 w-8 h-8 text-accent-pink animate-pulse" style={{ animationDelay: '0.2s' }} />
              <Sparkles className="absolute bottom-12 left-12 w-6 h-6 text-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              <Sparkles className="absolute bottom-8 right-6 w-7 h-7 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}