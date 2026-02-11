import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  MessageCircle, 
  Heart, 
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { Card, GradientCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userRes, statusRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/connection/status')
      ]);
      setUser(userRes.data);
      setConnectionStatus(statusRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await api.post('/connection/accept-request');
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#8b5cf6']
      });
      
      toast.success('🎉 Connected! You can now chat!', { duration: 4000 });
      fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async () => {
    try {
      await api.post('/connection/reject-request');
      toast.success('Request declined');
      fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleBreakConnection = async () => {
    if (confirm('Are you sure you want to end this connection?')) {
      try {
        await api.post('/connection/break');
        toast.success('Connection ended');
        fetchUserData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to break connection');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-6xl"
          >
            💎
          </motion.div>
          <p className="text-dark-600 text-lg">Loading your connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-dark-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-4xl">💎</div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Promitto</h1>
                <p className="text-xs text-dark-600">Your exclusive connection</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/profile">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-glow cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {user?.displayName?.[0]}
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* No Connection */}
          {connectionStatus?.connectionStatus === 'none' && (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GradientCard gradient="purple" className="text-center">
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🔍
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Ready to Connect</h2>
                <p className="text-white/80 mb-8 text-lg">Find someone special and start your exclusive journey</p>
                <Button 
                  icon={<Search size={20} />}
                  size="lg"
                  onClick={() => navigate('/search')}
                >
                  Find Someone
                </Button>
              </GradientCard>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card hover={false} className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-dark-600 text-sm">Max Connections</p>
                </Card>
                <Card hover={false} className="text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-dark-600 text-sm">Active Connection</p>
                </Card>
                <Card hover={false} className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold text-white">∞</p>
                  <p className="text-dark-600 text-sm">Possibilities</p>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Pending Sent */}
          {connectionStatus?.connectionStatus === 'pending_sent' && connectionStatus?.pendingRequest && (
            <motion.div
              key="pending-sent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Request Sent</h2>
                  <p className="text-dark-600 mb-6">Waiting for their response...</p>
                  
                  <div className="bg-white/5 rounded-2xl p-6 max-w-sm mx-auto">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-glow">
                      {connectionStatus.pendingRequest.displayName[0]}
                    </div>
                    <h3 className="text-xl font-bold text-white">{connectionStatus.pendingRequest.displayName}</h3>
                    <p className="text-dark-600">@{connectionStatus.pendingRequest.username}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Pending Received */}
          {connectionStatus?.connectionStatus === 'pending_received' && connectionStatus?.pendingRequest && (
            <motion.div
              key="pending-received"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GradientCard gradient="pink">
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    💌
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">New Request!</h2>
                  <p className="text-white/80 mb-6">Someone wants to connect with you</p>
                  
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-sm mx-auto mb-6">
                    <motion.div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-pink-400 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-glow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {connectionStatus.pendingRequest.displayName[0]}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">{connectionStatus.pendingRequest.displayName}</h3>
                    <p className="text-white/70 text-lg">@{connectionStatus.pendingRequest.username}</p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button icon={<CheckCircle size={20} />} size="lg" onClick={handleAcceptRequest}>
                      Accept
                    </Button>
                    <Button icon={<XCircle size={20} />} variant="secondary" size="lg" onClick={handleRejectRequest}>
                      Decline
                    </Button>
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          )}

          {/* Connected */}
          {connectionStatus?.connectionStatus === 'connected' && connectionStatus?.connectedTo && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💝
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gradient mb-2">Connected</h2>
                  <p className="text-dark-600 mb-8">Your exclusive connection is active</p>
                  
                  <div className="bg-gradient-to-br from-primary-500/20 to-pink-500/20 rounded-2xl p-8 max-w-sm mx-auto mb-6">
                    <motion.div 
                      className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-pink-400 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-glow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {connectionStatus.connectedTo.displayName[0]}
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-50"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">{connectionStatus.connectedTo.displayName}</h3>
                    <p className="text-dark-500 text-lg">@{connectionStatus.connectedTo.username}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      icon={<MessageCircle size={20} />}
                      size="lg"
                      onClick={() => navigate('/chat')}
                    >
                      Open Chat
                    </Button>
                    <Button 
                      variant="danger" 
                      size="md"
                      onClick={handleBreakConnection}
                    >
                      End Connection
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;