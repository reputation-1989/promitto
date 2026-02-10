import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import PageTransition from './components/PageTransition'
import './styles/premium.css'

function AnimatedRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <PageTransition>
                <Login setAuth={setIsAuthenticated} />
              </PageTransition>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <PageTransition>
                <Signup setAuth={setIsAuthenticated} />
              </PageTransition>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <PageTransition>
                <Dashboard />
              </PageTransition>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/search"
          element={
            isAuthenticated ? (
              <PageTransition>
                <Search />
              </PageTransition>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isAuthenticated ? (
              <PageTransition>
                <Chat />
              </PageTransition>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <PageTransition>
                <Profile setAuth={setIsAuthenticated} />
              </PageTransition>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has token
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="float">
          <h1 className="gradient-text" style={{ fontSize: '3rem', margin: 0 }}>Promitto</h1>
        </div>
        <div className="pulse" style={{ marginTop: '2rem' }}>
          <div style={{ fontSize: '2rem' }}>💎</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#1e293b',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          },
          success: {
            iconTheme: {
              primary: '#667eea',
              secondary: 'white',
            },
          },
        }}
      />
      <AnimatedRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  )
}

export default App