import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Trophy, Flame, Lock, Unlock } from 'lucide-react';
import { Card } from './ui/Card';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FEATURE_LEVELS = {
  5: { name: 'Voice Messages', icon: '🎤' },
  10: { name: 'Photo Sharing', icon: '📸' },
  15: { name: 'Voice Calls', icon: '📞' },
  20: { name: 'Video Calls', icon: '📹' },
  25: { name: 'Shared Journal', icon: '📖' },
  30: { name: 'Time Capsules', icon: '⏰' },
  50: { name: 'Couple Challenges', icon: '🎯' },
  100: { name: 'Mystery Reward', icon: '🎁' }
};

export function ConnectionLevel() {
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevelData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLevelData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLevelData = async () => {
    try {
      const response = await api.get('/level');
      setLevelData(response.data);
    } catch (error) {
      console.error('Failed to fetch level data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !levelData) return null;

  const progressPercent = (levelData.points / levelData.pointsToNextLevel) * 100;
  const nextMilestone = Object.keys(FEATURE_LEVELS).find(level => parseInt(level) > levelData.level);

  return (
    <Card>
      <div className="space-y-6">
        {/* Level Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-2xl shadow-glow-medium"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {levelData.level}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold">Connection Level</h3>
              <p className="text-text-tertiary text-sm">{levelData.points} / {levelData.pointsToNextLevel} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-400/10 border border-orange-400/20">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-400">{levelData.currentStreak} day streak</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-bg-subtle rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-purple to-accent-pink"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          {nextMilestone && (
            <p className="text-xs text-text-quaternary text-center">
              {FEATURE_LEVELS[nextMilestone].icon} Level {nextMilestone}: {FEATURE_LEVELS[nextMilestone].name}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-xl bg-bg-subtle/50 border border-border">
            <p className="text-2xl font-bold">{levelData.totalMessages}</p>
            <p className="text-xs text-text-tertiary mt-1">Messages</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-bg-subtle/50 border border-border">
            <p className="text-2xl font-bold">{levelData.qualityConversations}</p>
            <p className="text-xs text-text-tertiary mt-1">Quality Chats</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-bg-subtle/50 border border-border">
            <p className="text-2xl font-bold">{levelData.longestStreak}</p>
            <p className="text-xs text-text-tertiary mt-1">Best Streak</p>
          </div>
        </div>

        {/* Unlocked Features */}
        {levelData.unlockedFeatures && levelData.unlockedFeatures.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <Unlock className="w-4 h-4 text-accent-purple" />
              Unlocked Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {levelData.unlockedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-medium"
                >
                  {feature.replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function DailyRituals() {
  const [levelData, setLevelData] = useState(null);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    fetchLevelData();
  }, []);

  const fetchLevelData = async () => {
    try {
      const response = await api.get('/level');
      setLevelData(response.data);
    } catch (error) {
      console.error('Failed to fetch level data:', error);
    }
  };

  const completeRitual = async (type) => {
    setCompleting(type);
    try {
      await api.post(`/level/ritual/${type}`);
      toast.success('✨ Ritual completed! +15 XP');
      fetchLevelData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Already completed today');
    } finally {
      setCompleting(null);
    }
  };

  if (!levelData) return null;

  const rituals = [
    { id: 'morningCheckIn', name: 'Morning Check-in', icon: '🌅', time: 'Morning' },
    { id: 'afternoonCheckIn', name: 'Afternoon Chat', icon: '☀️', time: 'Afternoon' },
    { id: 'eveningGratitude', name: 'Evening Gratitude', icon: '🌙', time: 'Evening' },
    { id: 'emotionShare', name: 'Share Emotions', icon: '💭', time: 'Anytime' }
  ];

  // Determine which user this is
  const ritualStatus = levelData.dailyRituals;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-purple" />
            Daily Rituals
          </h3>
          <p className="text-xs text-text-quaternary">+15 XP each</p>
        </div>

        <div className="space-y-2">
          {rituals.map((ritual) => {
            const completed = ritualStatus[ritual.id]?.user1 && ritualStatus[ritual.id]?.user2;
            const myCompleted = ritualStatus[ritual.id]?.user1 || ritualStatus[ritual.id]?.user2;
            
            return (
              <button
                key={ritual.id}
                onClick={() => !myCompleted && completeRitual(ritual.id)}
                disabled={myCompleted || completing === ritual.id}
                className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                  completed
                    ? 'bg-accent-purple/10 border-accent-purple/20'
                    : myCompleted
                    ? 'bg-bg-subtle/50 border-border cursor-wait opacity-60'
                    : 'bg-bg-elevated border-border hover:border-accent-purple/30 hover:bg-bg-hover cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ritual.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{ritual.name}</p>
                      <p className="text-xs text-text-quaternary">{ritual.time}</p>
                    </div>
                  </div>
                  {completed && (
                    <div className="flex items-center gap-1 text-accent-purple text-xs font-medium">
                      <Zap className="w-4 h-4" />
                      Both done!
                    </div>
                  )}
                  {!completed && myCompleted && (
                    <div className="text-xs text-text-quaternary">
                      Waiting for partner...
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {ritualStatus.allCompleted && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20 text-center">
            <p className="text-sm font-semibold text-accent-purple">
              🎉 All rituals completed today! +100 bonus XP
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}