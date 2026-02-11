import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import api from '../utils/api'

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
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#4ade80']
      })
      
      toast.success('🎉 Connected! You can now chat!', { duration: 4000 })
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
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '4rem', marginBottom: '2rem' }}
        >
          💎
        </motion.div>
        <div className="ultra-skeleton" style={{ width: '200px', height: '8px' }}></div>
      </div>
    )
  }

  return (
    <>
      {/* Ultra-premium background */}
      <div className="ultra-bg">
        <div className="ultra-orb ultra-orb-1"></div>
        <div className="ultra-orb ultra-orb-2"></div>
        <div className="ultra-orb ultra-orb-3"></div>
      </div>

      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Modern Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            padding: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <div className="ultra-glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              <span className="ultra-gradient-text">Promitto</span>
            </h1>
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ultra-avatar ultra-avatar-md"
              >
                {user?.displayName?.[0]}
              </motion.div>
            </Link>
          </div>
        </motion.header>

        <div className="container">
          {/* No Connection State */}
          {connectionStatus?.connectionStatus === 'none' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ultra-glass-card"
              style={{ padding: '3rem 2rem', textAlign: 'center' }}
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '5rem', marginBottom: '1.5rem' }}
              >
                🔍
              </motion.div>
              
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                <span className="ultra-gradient-text">Ready to Connect</span>
              </h2>
              
              <p className="text-secondary" style={{ fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                Find someone special and start your journey together
              </p>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/search" className="ultra-btn ultra-btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
                  <span>🔍</span>
                  <span>Find Someone</span>
                </Link>
              </motion.div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '1.5rem' }}>
                <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>✨</motion.span>
                <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>💫</motion.span>
                <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>⭐</motion.span>
              </div>
            </motion.div>
          )}

          {/* Pending Sent State */}
          {connectionStatus?.connectionStatus === 'pending_sent' && connectionStatus?.pendingRequest && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ultra-glass-card"
              style={{ padding: '3rem 2rem', textAlign: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
              >
                ⏳
              </motion.div>
              
              <h2 className="ultra-gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                Request Sent
              </h2>
              
              <div className="ultra-badge ultra-badge-primary" style={{ marginBottom: '2rem' }}>
                Waiting for response
              </div>

              <div className="ultra-glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
                <div className="ultra-avatar ultra-avatar-lg" style={{ margin: '0 auto 1rem' }}>
                  {connectionStatus.pendingRequest.displayName[0]}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {connectionStatus.pendingRequest.displayName}
                </h3>
                <p className="text-secondary">@{connectionStatus.pendingRequest.username}</p>
              </div>
            </motion.div>
          )}

          {/* Pending Received State */}
          {connectionStatus?.connectionStatus === 'pending_received' && connectionStatus?.pendingRequest && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ultra-glass-card"
              style={{ padding: '3rem 2rem', textAlign: 'center' }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
              >
                💌
              </motion.div>
              
              <h2 className="ultra-gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                New Request!
              </h2>
              
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Someone wants to connect with you
              </p>

              <div className="ultra-glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div className="ultra-avatar ultra-avatar-lg" style={{ margin: '0 auto 1rem' }}>
                  {connectionStatus.pendingRequest.displayName[0]}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {connectionStatus.pendingRequest.displayName}
                </h3>
                <p className="text-secondary">@{connectionStatus.pendingRequest.username}</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.button
                  onClick={handleAcceptRequest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-primary"
                  style={{ flex: 1 }}
                >
                  ✓ Accept
                </motion.button>
                <motion.button
                  onClick={handleRejectRequest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-secondary"
                  style={{ flex: 1 }}
                >
                  ✗ Decline
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Connected State */}
          {connectionStatus?.connectionStatus === 'connected' && connectionStatus?.connectedTo && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ultra-glass-card"
              style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'visible' }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
              >
                💍
              </motion.div>
              
              <div className="ultra-badge ultra-badge-success" style={{ marginBottom: '2rem' }}>
                ✓ Connected
              </div>

              <div className="ultra-glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <div className="ultra-avatar ultra-avatar-xl ultra-avatar-online" style={{ margin: '0 auto 1.5rem' }}>
                  {connectionStatus.connectedTo.displayName[0]}
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  {connectionStatus.connectedTo.displayName}
                </h3>
                <p className="text-secondary" style={{ fontSize: '1.05rem' }}>@{connectionStatus.connectedTo.username}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/chat" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="ultra-btn ultra-btn-primary"
                    style={{ width: '100%' }}
                  >
                    💬 Open Chat
                  </motion.button>
                </Link>
                <motion.button
                  onClick={handleBreakConnection}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ultra-btn ultra-btn-ghost"
                  style={{ width: '100%' }}
                >
                  Break Connection
                </motion.button>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -15, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    style={{ fontSize: '1.5rem' }}
                  >
                    💖
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard