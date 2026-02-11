import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [sending, setSending] = useState(false);
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
    if (!newMessage.trim() || sending) return;

    const user = JSON.parse(localStorage.getItem('user'));
    setSending(true);

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
    } finally {
      setSending(false);
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundEffects />
        <div className="relative z-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-purple mx-auto mb-4" />
          <p className="text-text-secondary">Loading chat...</p>
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="h-screen flex flex-col">
      <BackgroundEffects />

      {/* Header */}
      <header className="relative z-10 border-b border-border backdrop-premium">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <motion.div
                className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center hover:bg-bg-subtle cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar name={partner.displayName} size="md" online={isOnline} />
              <div>
                <h3 className="font-semibold">{partner.displayName}</h3>
                <p className="text-xs text-text-tertiary">
                  {isTyping ? 'typing...' : isOnline ? 'online' : '@' + partner.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isOwn = msg.sender._id === user.id;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                  isOwn
                    ? 'bg-accent-purple text-white rounded-br-md'
                    : 'bg-bg-elevated border border-border rounded-bl-md'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-white/60' : 'text-text-quaternary'
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
      <div className="relative z-10 border-t border-border backdrop-premium p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="input-premium flex-1"
            disabled={sending}
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-12 h-12 rounded-xl bg-accent-purple flex items-center justify-center text-white disabled:opacity-50 shadow-glow-subtle hover:shadow-glow-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default Chat;