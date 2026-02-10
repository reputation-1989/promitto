import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setAuth(false)
      navigate('/login')
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
        <Link to="/dashboard" className="back-button">← Back</Link>
        <h1>Profile</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="container">
        <div className="card">
          <div className="profile-view">
            <div className="user-avatar large">
              {user?.displayName?.[0]}
            </div>
            <h2>{user?.displayName}</h2>
            <p className="username">@{user?.username}</p>

            <div className="profile-details">
              <div className="detail-row">
                <span className="label">Email</span>
                <span className="value">{user?.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone</span>
                <span className="value">
                  {user?.phoneNumbers?.find(p => p.isPrimary)?.number}
                </span>
              </div>
              {user?.bio && (
                <div className="detail-row">
                  <span className="label">Bio</span>
                  <span className="value">{user.bio}</span>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="btn btn-danger" style={{ marginTop: '2rem' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile