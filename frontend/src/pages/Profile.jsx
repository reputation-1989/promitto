import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'
import './Dashboard.css'

function Profile({ setAuth }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setAuth(false)
      toast.success('Logged out successfully')
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            👤
          </motion.div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="header-content glass-card">
          <Link to="/dashboard" className="back-button glass-btn">←</Link>
          <h1 className="logo-text">Profile</h1>
          <div style={{ width: '60px' }}></div>
        </div>
      </motion.div>

      <div className="container">
        <motion.div
          className="card glass-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-view" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <motion.div
              className="user-avatar-xl glow"
              style={{ margin: '0 auto 1.5rem' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{ 
                boxShadow: [
                  '0 0 30px rgba(102, 126, 234, 0.6)',
                  '0 0 50px rgba(118, 75, 162, 0.8)',
                  '0 0 30px rgba(102, 126, 234, 0.6)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user?.displayName?.[0]}
            </motion.div>
            
            <h2 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '800' }}>
              {user?.displayName}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '2rem' }}>
              @{user?.username}
            </p>

            <div style={{ 
              marginTop: '2rem', 
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>📧 Email</span>
                <span style={{ color: 'white' }}>{user?.email}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>📱 Phone</span>
                <span style={{ color: 'white' }}>
                  {user?.phoneNumbers?.find(p => p.isPrimary)?.number}
                </span>
              </div>
              {user?.bio && (
                <div style={{
                  padding: '1rem 0'
                }}>
                  <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>📝 Bio</span>
                  <span style={{ color: 'white' }}>{user.bio}</span>
                </div>
              )}
            </div>

            <motion.button
              onClick={handleLogout}
              className="btn-premium danger-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '2rem' }}
            >
              🚪 Logout
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile