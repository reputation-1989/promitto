import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

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
      toast.success('🎉 Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
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
          {/* Logo */}
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
          
          <p className="text-secondary" style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Welcome back to your exclusive connection
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="ultra-input-wrapper">
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder=" "
                required
                className="ultra-input ultra-input-floating"
              />
              <label className="ultra-input-label">Email or Username</label>
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

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="ultra-btn ultra-btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          <p className="text-secondary" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}

export default Login