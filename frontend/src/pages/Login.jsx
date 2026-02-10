import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'
import './Auth.css'

function Login({ setAuth }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setAuth(true)
      toast.success('🎉 Welcome back!', { duration: 2000 })
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
        <p className="auth-subtitle">Welcome back to your exclusive connection</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email or Username</label>
            <motion.input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or username"
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
              placeholder="••••••••"
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
            {loading ? (
              <span className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <motion.p
          className="auth-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Don't have an account? <Link to="/signup" className="gradient-link">Sign up</Link>
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

export default Login