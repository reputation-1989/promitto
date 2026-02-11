const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumbers: [
    {
      number: {
        type: String,
        required: true
      },
      verified: {
        type: Boolean,
        default: false
      },
      isPrimary: {
        type: Boolean,
        default: false
      }
    }
  ],
  password: {
    type: String,
    required: true
  },
  // Profile fields
  profilePicture: {
    type: String,
    default: ''
  },
  avatarColor: {
    type: String,
    default: '#8b5cf6' // Default purple
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  interests: [{
    type: String,
    trim: true
  }],
  age: {
    type: Number,
    min: 13,
    max: 120,
    default: null
  },
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  // Connection fields
  connectedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  connectionStatus: {
    type: String,
    enum: ['none', 'pending_sent', 'pending_received', 'connected'],
    default: 'none'
  },
  pendingRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  connectionRequestedAt: {
    type: Date,
    default: null
  },
  connectedAt: {
    type: Date,
    default: null
  },
  // Privacy & Safety
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  // Stats
  totalMessagesSent: {
    type: Number,
    default: 0
  },
  connectionCount: {
    type: Number,
    default: 0 // Track total connections ever made
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
UserSchema.index({ username: 1 });
UserSchema.index({ displayName: 'text', bio: 'text', interests: 'text' });

module.exports = mongoose.model('User', UserSchema);