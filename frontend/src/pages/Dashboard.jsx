import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import api from '../utils/api'
import './Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [userRes, statusRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/connection/status')
      ])
      setUser(userRes.data)
      setConnectionStatus(statusRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async () => {
    try {
      await api.post('/connection/accept-request')
      
      // Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
      })
      
      toast.success('🎉 Connected! You can now chat!', {
        duration: 4000
      })
      
      fetchUserData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request')
    }
  }

  const handleRejectRequest = async () => {
    try {
      await api.post('/connection/reject-request')
      toast.success('Request rejected')
      fetchUserData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request')
    }
  }

  const handleBreakConnection = async () => {
    if (confirm('Are you sure you want to break this connection?')) {
      try {
        await api.post('/connection/break')
        toast.success('Connection ended')
        fetchUserData()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to break connection')
      }
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
            💎
          </motion.div>
          <p>Loading your connection...</p>
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
        transition={{ duration: 0.5 }}
      >
        <div className="header-content glass-card">
          <h1 className="logo-text">Promitto</h1>
          <Link to="/profile" className="profile-btn glass-btn">
            <span className="avatar-circle">{user?.displayName?.[0]}</span>
          </Link>
        </div>
      </motion.div>

      <div className="container">
        {/* No Connection */}
        {connectionStatus?.connectionStatus === 'none' && (
          <motion.div
            className="status-card glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="status-icon"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              🔍
            </motion.div>
            <h2 className="gradient-text">Ready to Connect</h2>
            <p className="subtitle">Find someone special and start your journey together</p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/search" className="btn-premium gradient-btn">
                <span>Find Someone</span>
                <div className="btn-glow"></div>
              </Link>
            </motion.div>

            <div className="decorative-elements">
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">💫</div>
              <div className="sparkle sparkle-3">⭐</div>
            </div>
          </motion.div>
        )}

        {/* Pending Sent */}
        {connectionStatus?.connectionStatus === 'pending_sent' && connectionStatus?.pendingRequest && (
          <motion.div
            className="status-card glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="status-icon pulse">⏳</div>
            <h2 className="gradient-text">Request Sent</h2>
            <p className="subtitle">Waiting for response...</p>
            
            <motion.div
              className="user-card glass-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="user-avatar-large glow">
                {connectionStatus.pendingRequest.displayName[0]}
              </div>
              <h3>{connectionStatus.pendingRequest.displayName}</h3>
              <p className="username">@{connectionStatus.pendingRequest.username}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Pending Received */}
        {connectionStatus?.connectionStatus === 'pending_received' && connectionStatus?.pendingRequest && (
          <motion.div
            className="status-card glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="status-icon"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💌
            </motion.div>
            <h2 className="gradient-text">New Request!</h2>
            <p className="subtitle">Someone wants to connect with you</p>
            
            <motion.div
              className="user-card glass-card"
              whileHover={{ scale: 1.02 }}
            >
              <div className="user-avatar-large glow">
                {connectionStatus.pendingRequest.displayName[0]}
              </div>
              <h3>{connectionStatus.pendingRequest.displayName}</h3>
              <p className="username">@{connectionStatus.pendingRequest.username}</p>
            </motion.div>
            
            <div className="button-group">
              <motion.button
                onClick={handleAcceptRequest}
                className="btn-premium gradient-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✓ Accept
              </motion.button>
              <motion.button
                onClick={handleRejectRequest}
                className="btn-premium glass-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✗ Decline
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Connected */}
        {connectionStatus?.connectionStatus === 'connected' && connectionStatus?.connectedTo && (
          <motion.div
            className="status-card glass-card connected-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="connection-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="ring"></div>
            </motion.div>
            
            <motion.div
              className="status-icon"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💍
            </motion.div>
            
            <h2 className="gradient-text">Connected</h2>
            
            <motion.div
              className="connected-user glass-card"
              whileHover={{ scale: 1.02 }}
            >
              <div className="user-avatar-xl glow">
                {connectionStatus.connectedTo.displayName[0]}
                <div className="online-indicator"></div>
              </div>
              <h3>{connectionStatus.connectedTo.displayName}</h3>
              <p className="username">@{connectionStatus.connectedTo.username}</p>
            </motion.div>
            
            <div className="button-group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/chat" className="btn-premium gradient-btn">
                  💬 Open Chat
                </Link>
              </motion.div>
              <motion.button
                onClick={handleBreakConnection}
                className="btn-premium danger-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Break Connection
              </motion.button>
            </div>

            <div className="hearts-animation">
              <span className="heart">💖</span>
              <span className="heart">💖</span>
              <span className="heart">💖</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard