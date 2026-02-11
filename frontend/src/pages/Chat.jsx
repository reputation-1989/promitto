import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Smile, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSkeleton';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadChatData();
    setupSocket();
    return () => socket?.disconnect();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

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
    } finally {
      setLoading(false);
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
    const messageContent = newMessage.trim();
    setSending(true);
    setNewMessage('');

    try {
      const response = await api.post('/connection/message', { content: messageContent });
      setMessages((prev) => [...prev, response.data]);
      
      if (socket && partner) {
        socket.emit('sendMessage', {
          from: user.id,
          to: partner._id,
          message: messageContent
        });
        socket.emit('stopTyping', { from: user.id, to: partner._id });
      }
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundEffects />
        <div className="relative z-10 text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundEffects />
        <EmptyState 
          icon={<Smile className="w-10 h-10 text-accent-purple" />}
          title="No connection found"
          description="Connect with someone to start chatting"
          action={() => navigate('/dashboard')}
          actionLabel="Go to Dashboard"
        />
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="h-screen flex flex-col bg-bg">
      <BackgroundEffects />

      {/* Header - Ultra refined */}
      <header className="relative z-10 backdrop-premium border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <motion.div
                className="w-11 h-11 rounded-xl bg-bg-elevated border border-border flex items-center justify-center hover:bg-bg-hover hover:border-border-hover cursor-pointer transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </motion.div>
            </Link>
            <div className="flex items-center gap-4">
              <Avatar name={partner.displayName} size="md" online={isOnline} />
              <div>
                <h3 className="font-semibold text-lg">{partner.displayName}</h3>
                <motion.p 
                  className="text-xs text-text-tertiary"
                  key={isTyping ? 'typing' : 'status'}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isTyping ? (
                    <span className="flex items-center gap-1.5 text-accent-purple">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        typing
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      >
                        •
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      >
                        •
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                      >
                        •
                      </motion.span>
                    </span>
                  ) : (
                    isOnline ? 'online' : '@' + partner.username
                  )}
                </motion.p>
              </div>
            </div>
          </div>

          <motion.button
            className="w-11 h-11 rounded-xl bg-bg-elevated border border-border flex items-center justify-center hover:bg-bg-hover hover:border-border-hover transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </div>
      </header>

      {/* Messages - Enhanced */}
      <div 
        ref={messagesContainerRef}
        className="relative z-10 flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full"
      >
        {messages.length === 0 ? (
          <EmptyState 
            icon={<Smile className="w-10 h-10 text-accent-purple" />}
            title="Start the conversation"
            description="Send your first message and begin your exclusive journey together"
          />
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isOwn = msg.sender._id === user.id;
              const showAvatar = index === 0 || messages[index - 1].sender._id !== msg.sender._id;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={clsx(
                    'flex mb-4 gap-3',
                    isOwn ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isOwn && showAvatar && (
                    <Avatar name={partner.displayName} size="sm" className="flex-shrink-0 mt-1" />
                  )}
                  {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}
                  
                  <div className={clsx(
                    'max-w-md lg:max-w-lg xl:max-w-xl',
                    'px-4 py-2.5 rounded-2xl',
                    'transition-all duration-200',
                    isOwn 
                      ? 'bg-accent-purple text-white rounded-br-md shadow-glow-subtle'
                      : 'bg-bg-elevated border border-border rounded-bl-md hover:border-border-hover'
                  )}>
                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    <p className={clsx(
                      'text-xs mt-1.5',
                      isOwn ? 'text-white/60' : 'text-text-quaternary'
                    )}>
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
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Ultra refined */}
      <div className="relative z-10 backdrop-premium border-t border-border p-6">
        <form onSubmit={handleSendMessage} className="max-w-6xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="input-premium flex-1 text-base"
            disabled={sending}
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-14 h-14 rounded-xl bg-accent-purple flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-subtle hover:shadow-glow-medium transition-all duration-200"
            whileHover={{ scale: newMessage.trim() ? 1.05 : 1 }}
            whileTap={{ scale: newMessage.trim() ? 0.95 : 1 }}
          >
            <Send className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default Chat;