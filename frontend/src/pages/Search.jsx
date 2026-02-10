import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import './Dashboard.css'

function Search() {
  const [searchUsername, setSearchUsername] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setSearchResult(null)
    setLoading(true)

    try {
      const response = await api.get(`/connection/search/${searchUsername}`)
      if (response.data.available) {
        setSearchResult(response.data.user)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'User not found')
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async () => {
    try {
      await api.post('/connection/send-request', {
        recipientId: searchResult.id
      })
      alert('Connection request sent!')
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request')
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <Link to="/dashboard" className="back-button">← Back</Link>
        <h1>Search</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="container">
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <label>Search by Username</label>
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {searchResult && (
          <div className="card">
            <div className="search-result">
              <div className="user-avatar large">
                {searchResult.displayName[0]}
              </div>
              <h2>{searchResult.displayName}</h2>
              <p className="username">@{searchResult.username}</p>
              {searchResult.bio && <p className="bio">{searchResult.bio}</p>}
              <button onClick={handleSendRequest} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Send Connection Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search