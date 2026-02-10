import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import api from '../utils/api'
import './Auth.css'

function Signup({ setAuth }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const sendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/send-otp', { phoneNumber: formData.phoneNumber })
      toast.success('📱 OTP sent to your phone!')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/verify-otp', {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp
      })
      toast.success('✓ Phone verified!')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/signup', {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      })
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Celebration!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
      })
      
      toast.success('🎉 Account created! Welcome to Promitto!', { duration: 3000 })
      setAuth(true)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <motion.div
        className="auth-card glass-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <motion.div
          className="auth-logo"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          💎
        </motion.div>
        
        <h1 className="auth-title gradient-text">Promitto</h1>
        <p className="auth-subtitle">Create your exclusive connection</p>

        {/* Progress Indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={sendOTP}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="input-group">
                <label>📱 Phone Number</label>
                <motion.input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+919876543210"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input"
                />
              </div>
              <motion.button
                type="submit"
                className="btn-premium gradient-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              onSubmit={verifyOTP}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="input-group">
                <label>🔐 Enter OTP</label>
                <motion.input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input otp-input"
                />
              </div>
              <motion.button
                type="submit"
                className="btn-premium gradient-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </motion.button>
              <motion.button
                type="button"
                className="btn-premium glass-btn"
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: '1rem' }}
              >
                Change Number
              </motion.button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              onSubmit={handleSignup}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="input-group">
                <label>Username</label>
                <motion.input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input"
                />
              </div>

              <div className="input-group">
                <label>Display Name</label>
                <motion.input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input"
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input"
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <motion.input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input"
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <motion.input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="premium-input"
                />
              </div>

              <motion.button
                type="submit"
                className="btn-premium gradient-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating Account...' : 'Create Account 🎉'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p
          className="auth-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already have an account? <Link to="/login" className="gradient-link">Login</Link>
        </motion.p>

        <div className="decorative-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">⭐</span>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup