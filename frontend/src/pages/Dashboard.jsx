import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Zap,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User2
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';

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
        colors: ['#8b5cf6', '#ec4899', '#3b82f6']
      });
      
      toast.success('🎉 Connected! You can now chat!');
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
        <BackgroundEffects />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            💎
          </motion.div>
          <p className="text-text-secondary">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundEffects />

      {/* Header */}
      <header className="relative z-10 border-b border-border backdrop-premium">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-3xl">💎</div>
              <div>
                <h1 className="text-xl font-bold text-gradient-purple">Promitto</h1>
                <p className="text-xs text-text-quaternary">Exclusive connections</p>
              </div>
            </motion.div>

            <Link to="/profile">
              <Avatar name={user?.displayName} size="md" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {/* No Connection */}
          {connectionStatus?.connectionStatus === 'none' && (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6 py-12">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-purple-glow mb-6"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Search className="w-10 h-10 text-accent-purple" />
                </motion.div>
                <h2 className="text-display-md font-bold text-balance">Ready to Connect</h2>
                <p className="text-xl text-text-secondary max-w-lg mx-auto text-balance">
                  Find someone special and start your exclusive journey together
                </p>
                <Button 
                  icon={<Search className="w-5 h-5" />}
                  size="lg"
                  onClick={() => navigate('/search')}
                >
                  Find Someone
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <StatCard 
                  icon={<Zap className="w-6 h-6 text-yellow-400" />}
                  value="1"
                  label="Max Connections"
                  delay={0.1}
                />
                <StatCard 
                  icon={<Heart className="w-6 h-6 text-pink-400" />}
                  value="0"
                  label="Active"
                  delay={0.2}
                />
                <StatCard 
                  icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                  value="∞"
                  label="Possibilities"
                  delay={0.3}
                />
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
            >
              <Card glow>
                <div className="text-center space-y-6">
                  <motion.div
                    className="text-6xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Request Sent</h2>
                    <p className="text-text-secondary">Waiting for their response...</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 py-6">
                    <Avatar name={connectionStatus.pendingRequest.displayName} size="xl" />
                    <div>
                      <h3 className="text-xl font-semibold">{connectionStatus.pendingRequest.displayName}</h3>
                      <p className="text-text-tertiary">@{connectionStatus.pendingRequest.username}</p>
                    </div>
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
            >
              <Card glow>
                <div className="text-center space-y-6">
                  <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    💌
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">New Request!</h2>
                    <p className="text-text-secondary text-lg">Someone wants to connect with you</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 py-6">
                    <Avatar name={connectionStatus.pendingRequest.displayName} size="2xl" />
                    <div>
                      <h3 className="text-2xl font-bold">{connectionStatus.pendingRequest.displayName}</h3>
                      <p className="text-text-tertiary text-lg">@{connectionStatus.pendingRequest.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button icon={<CheckCircle2 className="w-5 h-5" />} size="lg" onClick={handleAcceptRequest}>
                      Accept
                    </Button>
                    <Button icon={<XCircle className="w-5 h-5" />} variant="secondary" size="lg" onClick={handleRejectRequest}>
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Connected */}
          {connectionStatus?.connectionStatus === 'connected' && connectionStatus?.connectedTo && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card glow>
                <div className="text-center space-y-8">
                  <motion.div
                    className="text-6xl"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💝
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-gradient-purple">Connected</h2>
                    <p className="text-text-secondary">Your exclusive connection is active</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 py-6">
                    <Avatar 
                      name={connectionStatus.connectedTo.displayName} 
                      size="2xl" 
                      online={true}
                    />
                    <div>
                      <h3 className="text-2xl font-bold">{connectionStatus.connectedTo.displayName}</h3>
                      <p className="text-text-tertiary">@{connectionStatus.connectedTo.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      icon={<MessageCircle className="w-5 h-5" />}
                      size="lg"
                      onClick={() => navigate('/chat')}
                    >
                      Open Chat
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="md"
                      onClick={handleBreakConnection}
                      className="text-red-400 hover:text-red-300"
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