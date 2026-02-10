import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import api from '../utils/api'
import './Chat.css'

function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [partner, setPartner] = useState(null)
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)
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
      navigate('/dashboard')
    }
  }

  const setupSocket = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    // Get backend URL from environment or use default
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
    const newSocket = io(backendUrl)
    
    newSocket.on('connect', () => {
      newSocket.emit('join', user.id)
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

    setSocket(newSocket)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      
      // Emit to socket
      if (socket && partner) {
        socket.emit('sendMessage', {
          from: user.id,
          to: partner._id,
          message: newMessage
        })
      }

      setNewMessage('')
    } catch (error) {
      alert('Failed to send message')
    }
  }

  if (!partner) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    )
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="chat-page">
      <div className="chat-header">
        <Link to="/dashboard" className="back-button">←</Link>
        <div className="chat-partner">
          <div className="user-avatar-small">{partner.displayName[0]}</div>
          <div>
            <h3>{partner.displayName}</h3>
            <p>@{partner.username}</p>
          </div>
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isOwn = msg.sender._id === user.id
          return (
            <div key={index} className={`message ${isOwn ? 'own' : 'other'}`}>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="send-button">
          ➤
        </button>
      </form>
    </div>
  )
}

export default Chat