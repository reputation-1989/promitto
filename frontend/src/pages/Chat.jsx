import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import api from '../utils/api'
import './Chat.css'

function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [partner, setPartner] = useState(null)
  const [socket, setSocket] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadChatData()
    setupSocket()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatData = async () => {
    try {
      const [statusRes, messagesRes] = await Promise.all([
        api.get('/connection/status'),
        api.get('/connection/messages')
      ])

      if (statusRes.data.connectionStatus !== 'connected') {
        navigate('/dashboard')
        return
      }

      setPartner(statusRes.data.connectedTo)
      setMessages(messagesRes.data)
    } catch (error) {
      console.error('Error loading chat:', error)
      toast.error('Failed to load chat')
      navigate('/dashboard')
    }
  }

  const setupSocket = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
    const newSocket = io(backendUrl)
    
    newSocket.on('connect', () => {
      newSocket.emit('join', user.id)
      newSocket.emit('userOnline', user.id)
    })

    newSocket.on('receiveMessage', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: { _id: data.from },
          content: data.message,
          timestamp: data.timestamp
        }
      ])
    })

    newSocket.on('userTyping', () => {
      setIsTyping(true)
    })

    newSocket.on('userStoppedTyping', () => {
      setIsTyping(false)
    })

    newSocket.on('userStatusChange', (data) => {
      setIsOnline(data.status === 'online')
    })

    setSocket(newSocket)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTyping = () => {
    if (socket && partner) {
      socket.emit('typing', {
        from: JSON.parse(localStorage.getItem('user')).id,
        to: partner._id
      })

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', {
          from: JSON.parse(localStorage.getItem('user')).id,
          to: partner._id
        })
      }, 1000)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const user = JSON.parse(localStorage.getItem('user'))

    try {
      const response = await api.post('/connection/message', {
        content: newMessage
      })

      setMessages((prev) => [...prev, response.data])
      
      if (socket && partner) {
        socket.emit('sendMessage', {
          from: user.id,
          to: partner._id,
          message: newMessage
        })
        socket.emit('stopTyping', {
          from: user.id,
          to: partner._id
        })
      }

      setNewMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  if (!partner) {
    return (
      <div className="chat-page">
        <div className="loading-state">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            💬
          </motion.div>
          <p>Loading chat...</p>
        </div>
      </div>
    )
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="chat-page">
      {/* Animated Background */}
      <div className="chat-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      {/* Header */}
      <motion.div
        className="chat-header glass-card"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Link to="/dashboard" className="back-button">
          <motion.span whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            ←
          </motion.span>
        </Link>
        
        <div className="chat-partner">
          <div className="partner-avatar glow">
            {partner.displayName[0]}
            {isOnline && <div className="online-dot"></div>}
          </div>
          <div>
            <h3>{partner.displayName}</h3>
            <p className="status-text">
              {isTyping ? (
                <span className="typing-indicator">
                  typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </span>
              ) : isOnline ? (
                'online'
              ) : (
                '@' + partner.username
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isOwn = msg.sender._id === user.id
            return (
              <motion.div
                key={index}
                className={`message ${isOwn ? 'own' : 'other'}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
              >
                <motion.div
                  className="message-bubble glass-card"
                  whileHover={{ scale: 1.02 }}
                >
                  {msg.content}
                </motion.div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="message other"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="message-bubble glass-card typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.form
        className="chat-input glass-card"
        onSubmit={handleSendMessage}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            handleTyping()
          }}
          placeholder="Type a message..."
          className="premium-input"
          whileFocus={{ scale: 1.01 }}
        />
        <motion.button
          type="submit"
          className="send-button gradient-btn"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          disabled={!newMessage.trim()}
        >
          ➤
        </motion.button>
      </motion.form>
    </div>
  )
}

export default Chat