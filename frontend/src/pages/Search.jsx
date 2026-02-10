import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'
import './Dashboard.css'

function Search() {
  const [searchUsername, setSearchUsername] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    setSearchResult(null)
    setLoading(true)

    try {
      const response = await api.get(`/connection/search/${searchUsername}`)
      if (response.data.available) {
        setSearchResult(response.data.user)
        toast.success('✓ User found!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'User not found')
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async () => {
    try {
      await api.post('/connection/send-request', {
        recipientId: searchResult.id
      })
      toast.success('🎉 Connection request sent!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    }
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
          <h1 className="logo-text">Search</h1>
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
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <label style={{ color: 'rgba(255, 255, 255, 0.95)' }}>🔍 Search by Username</label>
              <motion.input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter username"
                required
                whileFocus={{ scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              />
            </div>
            <motion.button
              type="submit"
              className="btn-premium gradient-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </motion.button>
          </form>
        </motion.div>

        {searchResult && (
          <motion.div
            className="card glass-card"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="search-result" style={{ textAlign: 'center' }}>
              <motion.div
                className="user-avatar-large glow"
                style={{ margin: '0 auto 1.5rem' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {searchResult.displayName[0]}
              </motion.div>
              
              <h2 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: '700' }}>
                {searchResult.displayName}
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontSize: '1rem', marginBottom: '1rem' }}>
                @{searchResult.username}
              </p>
              
              {searchResult.bio && (
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', marginBottom: '2rem' }}>
                  {searchResult.bio}
                </p>
              )}
              
              <motion.button
                onClick={handleSendRequest}
                className="btn-premium gradient-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💌 Send Connection Request
              </motion.button>
            </div>

            <div className="decorative-elements">
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">💫</div>
              <div className="sparkle sparkle-3">⭐</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search