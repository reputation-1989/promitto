import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import api from '../utils/api'

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
      toast.success('📱 OTP sent!')
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
      toast.success('✓ Verified!')
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
      
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#4ade80']
      })
      
      toast.success('🎉 Welcome to Promitto!')
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

  return (
    <>
      <div className="ultra-bg">
        <div className="ultra-orb ultra-orb-1"></div>
        <div className="ultra-orb ultra-orb-2"></div>
        <div className="ultra-orb ultra-orb-3"></div>
      </div>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
          className="ultra-glass-card"
          style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem', position: 'relative', zIndex: 1 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1.5rem' }}
          >
            💎
          </motion.div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            <span className="ultra-gradient-text">Promitto</span>
          </h1>
          
          <p className="text-secondary" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Create your exclusive connection
          </p>

          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                animate={{
                  backgroundColor: step >= s ? 'var(--accent-purple)' : 'var(--bg-tertiary)'
                }}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={sendOTP}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div className="ultra-input-wrapper">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="ultra-input ultra-input-floating"
                  />
                  <label className="ultra-input-label">📱 Phone Number</label>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </motion.button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={verifyOTP}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div className="ultra-input-wrapper">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder=" "
                    maxLength="6"
                    required
                    className="ultra-input ultra-input-floating"
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                  />
                  <label className="ultra-input-label">🔐 Enter OTP</label>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-ghost"
                  style={{ width: '100%' }}
                >
                  Change Number
                </motion.button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div className="ultra-input-wrapper">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="ultra-input ultra-input-floating"
                  />
                  <label className="ultra-input-label">Username</label>
                </div>

                <div className="ultra-input-wrapper">
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="ultra-input ultra-input-floating"
                  />
                  <label className="ultra-input-label">Display Name</label>
                </div>

                <div className="ultra-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="ultra-input ultra-input-floating"
                  />
                  <label className="ultra-input-label">Email</label>
                </div>

                <div className="ultra-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="ultra-input ultra-input-floating"
                  />
                  <label className="ultra-input-label">Password</label>
                </div>

                <div className="ultra-input-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="ultra-input ultra-input-floating"
                  />
                  <label className="ultra-input-label">Confirm Password</label>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Creating Account...' : '🎉 Create Account'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-secondary" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}

export default Signup