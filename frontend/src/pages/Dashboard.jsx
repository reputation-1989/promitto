import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async () => {
    try {
      await api.post('/connection/accept-request')
      fetchUserData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept request')
    }
  }

  const handleRejectRequest = async () => {
    try {
      await api.post('/connection/reject-request')
      fetchUserData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject request')
    }
  }

  const handleBreakConnection = async () => {
    if (confirm('Are you sure you want to break this connection?')) {
      try {
        await api.post('/connection/break')
        fetchUserData()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to break connection')
      }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Promitto</h1>
        <Link to="/profile" className="profile-link">Profile</Link>
      </div>

      <div className="container">
        {/* No Connection */}
        {connectionStatus?.connectionStatus === 'none' && (
          <div className="status-card">
            <div className="status-icon">🔍</div>
            <h2>You're not connected yet</h2>
            <p>Search for someone and send a connection request</p>
            <Link to="/search" className="btn btn-primary">Find Someone</Link>
          </div>
        )}

        {/* Pending Sent */}
        {connectionStatus?.connectionStatus === 'pending_sent' && connectionStatus?.pendingRequest && (
          <div className="status-card">
            <div className="status-icon">⏳</div>
            <h2>Request Sent</h2>
            <p>Waiting for <strong>@{connectionStatus.pendingRequest.username}</strong> to respond</p>
            <div className="pending-user">
              <div className="user-avatar">
                {connectionStatus.pendingRequest.displayName[0]}
              </div>
              <div>
                <h3>{connectionStatus.pendingRequest.displayName}</h3>
                <p>@{connectionStatus.pendingRequest.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Received */}
        {connectionStatus?.connectionStatus === 'pending_received' && connectionStatus?.pendingRequest && (
          <div className="status-card">
            <div className="status-icon">💌</div>
            <h2>Connection Request</h2>
            <p><strong>@{connectionStatus.pendingRequest.username}</strong> wants to connect</p>
            <div className="pending-user">
              <div className="user-avatar">
                {connectionStatus.pendingRequest.displayName[0]}
              </div>
              <div>
                <h3>{connectionStatus.pendingRequest.displayName}</h3>
                <p>@{connectionStatus.pendingRequest.username}</p>
              </div>
            </div>
            <div className="button-group">
              <button onClick={handleAcceptRequest} className="btn btn-primary">
                Accept
              </button>
              <button onClick={handleRejectRequest} className="btn btn-secondary">
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Connected */}
        {connectionStatus?.connectionStatus === 'connected' && connectionStatus?.connectedTo && (
          <div className="status-card connected">
            <div className="status-icon">💍</div>
            <h2>Connected</h2>
            <div className="connected-user">
              <div className="user-avatar large">
                {connectionStatus.connectedTo.displayName[0]}
              </div>
              <h3>{connectionStatus.connectedTo.displayName}</h3>
              <p>@{connectionStatus.connectedTo.username}</p>
            </div>
            <div className="button-group">
              <Link to="/chat" className="btn btn-primary">
                Open Chat 💬
              </Link>
              <button onClick={handleBreakConnection} className="btn btn-danger">
                Break Connection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard