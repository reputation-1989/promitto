const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');
const { body, validationResult } = require('express-validator');

// @route   GET /api/connection/search/:username
// @desc    Search for a user by username (only if they're available)
// @access  Private
router.get('/search/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = await User.findById(req.user.id);

    // Check if current user can send requests
    if (currentUser.connectionStatus !== 'none') {
      return res.status(400).json({
        message: 'You already have a pending request or active connection'
      });
    }

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('username displayName profilePicture bio interests age location.city location.country connectionStatus');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is available (not connected or has pending requests)
    if (user.connectionStatus !== 'none') {
      return res.status(400).json({
        message: 'User not available',
        available: false
      });
    }

    // User is available
    res.json({
      available: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        interests: user.interests,
        age: user.age,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/connection/send-request
// @desc    Send connection request
// @access  Private
router.post(
  '/send-request',
  [
    auth,
    body('recipientId', 'Recipient ID is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipientId } = req.body;

    try {
      const sender = await User.findById(req.user.id);
      const recipient = await User.findById(recipientId);

      if (!recipient) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if sender can send request
      if (sender.connectionStatus !== 'none') {
        return res.status(400).json({
          message: 'You already have a pending request or active connection'
        });
      }

      // Check if recipient is available
      if (recipient.connectionStatus !== 'none') {
        return res.status(400).json({
          message: 'This user is not available for connection'
        });
      }

      // Cannot send request to yourself
      if (sender._id.toString() === recipient._id.toString()) {
        return res.status(400).json({ message: 'Cannot send request to yourself' });
      }

      // Update both users
      sender.connectionStatus = 'pending_sent';
      sender.pendingRequest = recipient._id;
      sender.connectionRequestedAt = new Date();
      await sender.save();

      recipient.connectionStatus = 'pending_received';
      recipient.pendingRequest = sender._id;
      await recipient.save();

      res.json({
        message: 'Connection request sent successfully',
        recipient: {
          username: recipient.username,
          displayName: recipient.displayName
        }
      });
    } catch (error) {
      console.error('Send request error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/connection/accept-request
// @desc    Accept connection request
// @access  Private
router.post('/accept-request', auth, async (req, res) => {
  try {
    const recipient = await User.findById(req.user.id);

    if (recipient.connectionStatus !== 'pending_received') {
      return res.status(400).json({ message: 'No pending request to accept' });
    }

    const sender = await User.findById(recipient.pendingRequest);

    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const now = new Date();

    // Connect both users
    recipient.connectionStatus = 'connected';
    recipient.connectedTo = sender._id;
    recipient.pendingRequest = null;
    recipient.connectedAt = now;
    recipient.connectionCount += 1;
    await recipient.save();

    sender.connectionStatus = 'connected';
    sender.connectedTo = recipient._id;
    sender.pendingRequest = null;
    sender.connectedAt = now;
    sender.connectionCount += 1;
    await sender.save();

    res.json({
      message: 'Connection request accepted',
      connectedUser: {
        id: sender._id,
        username: sender.username,
        displayName: sender.displayName,
        profilePicture: sender.profilePicture
      }
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/connection/reject-request
// @desc    Reject connection request
// @access  Private
router.post('/reject-request', auth, async (req, res) => {
  try {
    const recipient = await User.findById(req.user.id);

    if (recipient.connectionStatus !== 'pending_received') {
      return res.status(400).json({ message: 'No pending request to reject' });
    }

    const sender = await User.findById(recipient.pendingRequest);

    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Reset both users to available
    recipient.connectionStatus = 'none';
    recipient.pendingRequest = null;
    await recipient.save();

    sender.connectionStatus = 'none';
    sender.pendingRequest = null;
    sender.connectionRequestedAt = null;
    await sender.save();

    res.json({ message: 'Connection request rejected' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/connection/break
// @desc    Break connection
// @access  Private
router.post('/break', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.connectionStatus !== 'connected') {
      return res.status(400).json({ message: 'You are not connected to anyone' });
    }

    const partner = await User.findById(user.connectedTo);

    // Break connection for both users
    user.connectionStatus = 'none';
    user.connectedTo = null;
    user.connectedAt = null;
    await user.save();

    if (partner) {
      partner.connectionStatus = 'none';
      partner.connectedTo = null;
      partner.connectedAt = null;
      await partner.save();
    }

    res.json({ message: 'Connection broken successfully' });
  } catch (error) {
    console.error('Break connection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connection/status
// @desc    Get current connection status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connectedTo', 'username displayName profilePicture phoneNumbers bio interests age location isOnline')
      .populate('pendingRequest', 'username displayName profilePicture bio interests age location');

    // Mark messages as delivered when user opens app
    if (user.connectionStatus === 'connected' && user.connectedTo) {
      await Message.markAsDelivered(user._id);
    }

    res.json({
      connectionStatus: user.connectionStatus,
      connectedTo: user.connectedTo,
      pendingRequest: user.pendingRequest,
      connectedAt: user.connectedAt
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connection/messages
// @desc    Get chat messages with connected user
// @access  Private
router.get('/messages', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.connectionStatus !== 'connected') {
      return res.status(400).json({ message: 'You are not connected to anyone' });
    }

    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const messages = await Message.getConversation(user._id, user.connectedTo, limit, skip);

    // Mark messages as delivered
    await Message.markAsDelivered(user._id);

    // Return messages in ascending order (oldest first)
    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/connection/message
// @desc    Send a message to connected user
// @access  Private
router.post(
  '/message',
  [
    auth,
    body('content', 'Message content is required').notEmpty().trim(),
    body('content').isLength({ max: 5000 }).withMessage('Message too long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, messageType = 'text', mediaUrl } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (user.connectionStatus !== 'connected') {
        return res.status(400).json({ message: 'You are not connected to anyone' });
      }

      const message = new Message({
        sender: user._id,
        receiver: user.connectedTo,
        content,
        messageType,
        mediaUrl,
        status: 'sent'
      });

      await message.save();

      // Update user stats
      user.totalMessagesSent += 1;
      await user.save();

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username displayName profilePicture')
        .populate('receiver', 'username displayName profilePicture');

      res.json(populatedMessage);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/connection/messages/mark-read
// @desc    Mark messages as read
// @access  Private
router.post('/messages/mark-read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.connectionStatus !== 'connected') {
      return res.status(400).json({ message: 'You are not connected to anyone' });
    }

    // Mark all messages from partner as read
    await Message.markAsRead(user.connectedTo, user._id);

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connection/discover
// @desc    Discover available users (better discovery)
// @access  Private
router.get('/discover', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (currentUser.connectionStatus !== 'none') {
      return res.status(400).json({
        message: 'You already have a pending request or active connection'
      });
    }

    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Find available users (not connected, no pending requests)
    const users = await User.find({
      _id: { $ne: currentUser._id },
      connectionStatus: 'none',
      blockedUsers: { $ne: currentUser._id }
    })
    .select('username displayName profilePicture bio interests age location.city location.country')
    .limit(limit)
    .skip(skip);

    res.json(users);
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;