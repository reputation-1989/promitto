const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'voice', 'file'],
    default: 'text'
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaSize: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  readAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index for efficient message queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, status: 1 });

// Method to get messages between two users
messageSchema.statics.getConversation = async function(userId1, userId2, limit = 100, skip = 0) {
  return this.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 }
    ],
    isDeleted: false
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'displayName username')
  .populate('receiver', 'displayName username');
};

// Method to mark messages as delivered
messageSchema.statics.markAsDelivered = async function(receiverId) {
  return this.updateMany(
    { receiver: receiverId, status: 'sent' },
    { status: 'delivered' }
  );
};

// Method to mark messages as read
messageSchema.statics.markAsRead = async function(senderId, receiverId) {
  return this.updateMany(
    { sender: senderId, receiver: receiverId, status: { $in: ['sent', 'delivered'] } },
    { status: 'read', readAt: new Date() }
  );
};

module.exports = mongoose.model('Message', messageSchema);