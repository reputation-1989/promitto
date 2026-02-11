const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ConnectionLevel = require('../models/ConnectionLevel');
const { body, validationResult } = require('express-validator');

// @route   GET /api/level
// @desc    Get connection level details
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.connectionStatus !== 'connected' || !user.connectedTo) {
      return res.status(400).json({ message: 'Not connected to anyone' });
    }

    // Find connection level (either user can be user1 or user2)
    let connectionLevel = await ConnectionLevel.findOne({
      $or: [
        { user1: user._id, user2: user.connectedTo },
        { user1: user.connectedTo, user2: user._id }
      ]
    });

    if (!connectionLevel) {
      return res.status(404).json({ message: 'Connection level not found' });
    }

    // Reset daily rituals if new day
    connectionLevel.resetDailyRituals();
    await connectionLevel.save();

    res.json(connectionLevel);
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/level/ritual/:type
// @desc    Complete a daily ritual
// @access  Private
router.post('/ritual/:type', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { type } = req.params;
    
    if (user.connectionStatus !== 'connected' || !user.connectedTo) {
      return res.status(400).json({ message: 'Not connected to anyone' });
    }

    // Find connection level
    let connectionLevel = await ConnectionLevel.findOne({
      $or: [
        { user1: user._id, user2: user.connectedTo },
        { user1: user.connectedTo, user2: user._id }
      ]
    });

    if (!connectionLevel) {
      return res.status(404).json({ message: 'Connection level not found' });
    }

    // Reset daily rituals if new day
    connectionLevel.resetDailyRituals();

    // Determine which user this is
    const isUser1 = connectionLevel.user1.toString() === user._id.toString();
    const userKey = isUser1 ? 'user1' : 'user2';

    // Update ritual based on type
    const validTypes = ['morningCheckIn', 'afternoonCheckIn', 'eveningGratitude', 'emotionShare'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid ritual type' });
    }

    if (connectionLevel.dailyRituals[type][userKey]) {
      return res.status(400).json({ message: 'Already completed this ritual today' });
    }

    connectionLevel.dailyRituals[type][userKey] = true;

    // Award points if both users completed this ritual
    if (connectionLevel.dailyRituals[type].user1 && connectionLevel.dailyRituals[type].user2) {
      await connectionLevel.addPoints(15, `Both completed ${type}`);
    }

    // Check if all daily rituals are done
    await connectionLevel.checkDailyCompletion();
    await connectionLevel.save();

    res.json({ 
      message: 'Ritual completed',
      connectionLevel 
    });
  } catch (error) {
    console.error('Complete ritual error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/level/add-points
// @desc    Manually add points (for activities, quality convos, etc.)
// @access  Private
router.post('/add-points', [
  auth,
  body('points').isInt({ min: 1 }).withMessage('Points must be positive'),
  body('reason').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    const { points, reason } = req.body;
    
    if (user.connectionStatus !== 'connected' || !user.connectedTo) {
      return res.status(400).json({ message: 'Not connected to anyone' });
    }

    let connectionLevel = await ConnectionLevel.findOne({
      $or: [
        { user1: user._id, user2: user.connectedTo },
        { user1: user.connectedTo, user2: user._id }
      ]
    });

    if (!connectionLevel) {
      return res.status(404).json({ message: 'Connection level not found' });
    }

    const result = await connectionLevel.addPoints(points, reason || 'Manual points');
    
    res.json({ 
      message: 'Points added',
      ...result,
      connectionLevel 
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;