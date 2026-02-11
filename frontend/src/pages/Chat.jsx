import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, User } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Button } from '../components/ui/Button';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadChatData();
    setupSocket();
    return () => socket?.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatData = async () => {
    try {
      const [statusRes, messagesRes] = await Promise.all([
        api.get('/connection/status'),
        api.get('/connection/messages')
      ]);

      if (statusRes.data.connectionStatus !== 'connected') {
        navigate('/dashboard');
        return;
      }

      setPartner(statusRes.data.connectedTo);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error loading chat:', error);
      toast.error('Failed to load chat');
      navigate('/dashboard');
    }
  };

  const setupSocket = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(backendUrl);
    
    newSocket.on('connect', () => {
      newSocket.emit('join', user.id);
      newSocket.emit('userOnline', user.id);
    });

    newSocket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, {
        sender: { _id: data.from },
        content: data.message,
        timestamp: data.timestamp
      }]);
    });

    newSocket.on('userTyping', () => setIsTyping(true));
    newSocket.on('userStoppedTyping', () => setIsTyping(false));
    newSocket.on('userStatusChange', (data) => setIsOnline(data.status === 'online'));

    setSocket(newSocket);
  };

  const handleTyping = () => {
    if (socket && partner) {
      socket.emit('typing', {
        from: JSON.parse(localStorage.getItem('user')).id,
        to: partner._id
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', {
          from: JSON.parse(localStorage.getItem('user')).id,
          to: partner._id
        });
      }, 1000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await api.post('/connection/message', { content: newMessage });
      setMessages((prev) => [...prev, response.data]);
      
      if (socket && partner) {
        socket.emit('sendMessage', {
          from: user.id,
          to: partner._id,
          message: newMessage
        });
        socket.emit('stopTyping', { from: user.id, to: partner._id });
      }

      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">💬</div>
          <p className="text-dark-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-dark-50 via-dark-100 to-dark-50">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-dark-50/50">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <motion.div
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {partner.displayName[0]}
                </div>
                {isOnline && (
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white">{partner.displayName}</h3>
                <p className="text-sm text-dark-600">
                  {isTyping ? 'typing...' : isOnline ? 'online' : '@' + partner.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isOwn = msg.sender._id === user.id;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  isOwn
                    ? 'bg-gradient-to-br from-primary-500 to-pink-500 text-white rounded-br-sm'
                    : 'glass-card text-white rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-white/70' : 'text-dark-600'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 backdrop-blur-xl bg-dark-50/50 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="input-premium flex-1 text-white"
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default Chat;