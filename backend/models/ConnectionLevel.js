const mongoose = require('mongoose');

const connectionLevelSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  points: {
    type: Number,
    default: 0
  },
  pointsToNextLevel: {
    type: Number,
    default: 100
  },
  
  // Milestones
  milestones: [{
    name: String,
    achieved: Boolean,
    achievedAt: Date,
    points: Number
  }],
  
  // Streaks
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  
  // Daily Rituals
  dailyRituals: {
    date: {
      type: Date,
      default: null
    },
    morningCheckIn: {
      user1: { type: Boolean, default: false },
      user2: { type: Boolean, default: false }
    },
    afternoonCheckIn: {
      user1: { type: Boolean, default: false },
      user2: { type: Boolean, default: false }
    },
    eveningGratitude: {
      user1: { type: Boolean, default: false },
      user2: { type: Boolean, default: false }
    },
    emotionShare: {
      user1: { type: Boolean, default: false },
      user2: { type: Boolean, default: false }
    },
    allCompleted: {
      type: Boolean,
      default: false
    }
  },
  
  // Unlocked Features
  unlockedFeatures: [{
    type: String,
    enum: ['voice_messages', 'photo_sharing', 'voice_calls', 'video_calls', 'shared_journal', 'time_capsules', 'couple_challenges']
  }],
  
  // Stats
  totalMessages: {
    type: Number,
    default: 0
  },
  qualityConversations: {
    type: Number,
    default: 0
  },
  emotionsShared: {
    type: Number,
    default: 0
  },
  activitiesCompleted: {
    type: Number,
    default: 0
  },
  
  connectedAt: {
    type: Date,
    default: Date.now
  },
  lastLevelUp: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Calculate points needed for next level (exponential growth)
connectionLevelSchema.methods.calculatePointsToNextLevel = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// Add points and check for level up
connectionLevelSchema.methods.addPoints = async function(points, reason = '') {
  this.points += points;
  
  while (this.points >= this.pointsToNextLevel && this.level < 100) {
    this.points -= this.pointsToNextLevel;
    this.level += 1;
    this.lastLevelUp = new Date();
    this.pointsToNextLevel = this.calculatePointsToNextLevel();
    
    // Unlock features based on level
    if (this.level === 5 && !this.unlockedFeatures.includes('voice_messages')) {
      this.unlockedFeatures.push('voice_messages');
    }
    if (this.level === 10 && !this.unlockedFeatures.includes('photo_sharing')) {
      this.unlockedFeatures.push('photo_sharing');
    }
    if (this.level === 15 && !this.unlockedFeatures.includes('voice_calls')) {
      this.unlockedFeatures.push('voice_calls');
    }
    if (this.level === 20 && !this.unlockedFeatures.includes('video_calls')) {
      this.unlockedFeatures.push('video_calls');
    }
    if (this.level === 25 && !this.unlockedFeatures.includes('shared_journal')) {
      this.unlockedFeatures.push('shared_journal');
    }
    if (this.level === 30 && !this.unlockedFeatures.includes('time_capsules')) {
      this.unlockedFeatures.push('time_capsules');
    }
    if (this.level === 50 && !this.unlockedFeatures.includes('couple_challenges')) {
      this.unlockedFeatures.push('couple_challenges');
    }
  }
  
  await this.save();
  return { leveledUp: this.level, newPoints: this.points };
};

// Check and update streak
connectionLevelSchema.methods.updateStreak = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!this.lastActivityDate) {
    this.currentStreak = 1;
    this.lastActivityDate = today;
  } else {
    const lastActivity = new Date(this.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Next day, increment streak
      this.currentStreak += 1;
      this.lastActivityDate = today;
      
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }
      
      // Bonus points for streak milestones
      if (this.currentStreak === 7) {
        await this.addPoints(100, '7-day streak');
      } else if (this.currentStreak === 30) {
        await this.addPoints(500, '30-day streak');
      } else if (this.currentStreak === 100) {
        await this.addPoints(2000, '100-day streak');
      }
    } else {
      // Streak broken
      this.currentStreak = 1;
      this.lastActivityDate = today;
    }
  }
  
  await this.save();
};

// Reset daily rituals
connectionLevelSchema.methods.resetDailyRituals = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!this.dailyRituals.date || this.dailyRituals.date < today) {
    this.dailyRituals = {
      date: today,
      morningCheckIn: { user1: false, user2: false },
      afternoonCheckIn: { user1: false, user2: false },
      eveningGratitude: { user1: false, user2: false },
      emotionShare: { user1: false, user2: false },
      allCompleted: false
    };
  }
};

// Check if all daily rituals are completed
connectionLevelSchema.methods.checkDailyCompletion = async function() {
  const rituals = this.dailyRituals;
  
  const allDone = 
    rituals.morningCheckIn.user1 && rituals.morningCheckIn.user2 &&
    rituals.afternoonCheckIn.user1 && rituals.afternoonCheckIn.user2 &&
    rituals.eveningGratitude.user1 && rituals.eveningGratitude.user2 &&
    rituals.emotionShare.user1 && rituals.emotionShare.user2;
  
  if (allDone && !rituals.allCompleted) {
    rituals.allCompleted = true;
    await this.addPoints(100, 'All daily rituals completed');
  }
};

module.exports = mongoose.model('ConnectionLevel', connectionLevelSchema);