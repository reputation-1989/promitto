const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Twilio client setup (optional for development)
let twilioClient = null;
const isDevelopment = process.env.NODE_ENV !== 'production';

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio configured successfully');
  } else {
    console.log('⚠️  Twilio not configured - using development mode (OTP: 123456)');
  }
} catch (error) {
  console.log('⚠️  Twilio setup failed - using development mode:', error.message);
}

// Store OTP temporarily (in production, use Redis)
const otpStore = new Map();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post(
  '/send-otp',
  [
    body('phoneNumber', 'Valid phone number is required').isMobilePhone()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber } = req.body;

    try {
      // Generate 6-digit OTP
      const otp = isDevelopment && !twilioClient ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 5 minute expiry
      otpStore.set(phoneNumber, {
        otp,
        expires: Date.now() + 5 * 60 * 1000
      });

      // Send OTP via Twilio SMS (or skip in development)
      if (twilioClient) {
        await twilioClient.messages.create({
          body: `Your Promitto verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });
        console.log(`📱 OTP sent to ${phoneNumber}: ${otp}`);
      } else {
        console.log(`🔧 Development mode - OTP for ${phoneNumber}: ${otp}`);
      }

      res.json({ 
        message: 'OTP sent successfully',
        ...(isDevelopment && !twilioClient && { devMode: true, otp: '123456' })
      });
    } catch (error) {
      console.error('OTP send error:', error);
      res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
  }
);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post(
  '/verify-otp',
  [
    body('phoneNumber', 'Valid phone number is required').isMobilePhone(),
    body('otp', 'OTP is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, otp } = req.body;

    try {
      const storedOTP = otpStore.get(phoneNumber);

      if (!storedOTP) {
        return res.status(400).json({ message: 'OTP expired or not found' });
      }

      if (Date.now() > storedOTP.expires) {
        otpStore.delete(phoneNumber);
        return res.status(400).json({ message: 'OTP expired' });
      }

      if (storedOTP.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // OTP verified successfully
      otpStore.delete(phoneNumber);
      console.log(`✅ OTP verified for ${phoneNumber}`);
      res.json({ message: 'OTP verified successfully', verified: true });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post(
  '/signup',
  [
    body('username', 'Username is required and must be 3-20 characters')
      .isLength({ min: 3, max: 20 })
      .isAlphanumeric(),
    body('displayName', 'Display name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('phoneNumber', 'Valid phone number is required').isMobilePhone(),
    body('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, displayName, email, phoneNumber, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email },
          { 'phoneNumbers.number': phoneNumber }
        ]
      });

      if (user) {
        return res.status(400).json({
          message: 'User already exists with this username, email, or phone number'
        });
      }

      // Create new user
      user = new User({
        username: username.toLowerCase(),
        displayName,
        email,
        phoneNumbers: [{
          number: phoneNumber,
          verified: true,
          isPrimary: true
        }],
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '30d' },
        (err, token) => {
          if (err) throw err;
          console.log(`✅ New user signed up: ${username}`);
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              email: user.email
            }
          });
        }
      );
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('identifier', 'Email or username is required').notEmpty(),
    body('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    try {
      // Find user by email or username
      let user = await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier.toLowerCase() }
        ]
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update last active
      user.lastActive = Date.now();
      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '30d' },
        (err, token) => {
          if (err) throw err;
          console.log(`✅ User logged in: ${user.username}`);
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              email: user.email,
              connectionStatus: user.connectionStatus,
              connectedTo: user.connectedTo
            }
          });
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('connectedTo', 'username displayName profilePicture');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;