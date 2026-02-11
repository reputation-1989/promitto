const rateLimit = require('express-rate-limit');

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true, // Trust proxy headers for Codespaces/Heroku/etc
});

// Strict limiter for auth endpoints - 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  trustProxy: true,
});

// OTP limiter - 3 OTP requests per hour
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  },
  trustProxy: true,
});

// Message limiter - 500 messages per hour (prevent spam)
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: 'Message limit reached. Please slow down.'
  },
  trustProxy: true,
});

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter,
  messageLimiter
};