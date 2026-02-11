import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Zap,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { DashboardConnected } from './DashboardConnected';

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
        colors: ['#8b5cf6', '#ec4899', '#3b82f6'],
        ticks: 300,
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
    if (confirm('⚠️ Are you sure? You will LOSE ALL progress: levels, points, streaks, and milestones. This cannot be undone!')) {
      try {
        await api.post('/connection/break');
        toast.success('Connection ended. All progress lost.');
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
          className="relative z-10 text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto rounded-2xl icon-container flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-accent-purple" />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Loading your space</h3>
            <p className="text-text-tertiary text-sm">Setting up your exclusive connection</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Basic user card - only name/username (for pending requests)
  const BasicUserCard = ({ user: profileUser }) => (
    <div className="space-y-4">
      {profileUser?.profilePicture ? (
        <img 
          src={profileUser.profilePicture} 
          alt={profileUser.displayName}
          className="w-24 h-24 mx-auto rounded-3xl object-cover shadow-glow-subtle"
        />
      ) : (
        <Avatar name={profileUser?.displayName} size="2xl" />
      )}
      <div className="space-y-2 text-center">
        <h3 className="text-3xl font-bold">{profileUser?.displayName}</h3>
        <p className="text-text-tertiary text-lg">@{profileUser?.username}</p>
      </div>
      
      {/* Privacy notice for pending */}
      <div className="max-w-md mx-auto mt-6">
        <div className="flex items-start gap-3 p-4 bg-bg-subtle/50 border border-border rounded-xl text-left">
          <Lock className="w-4 h-4 text-text-quaternary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Their full profile will be visible after you connect
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <BackgroundEffects />

      {/* Header */}
      <header className="relative z-10 backdrop-premium sticky top-0">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-glow-subtle">
                <span className="text-2xl">💎</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-purple">Promitto</h1>
                <p className="text-xs text-text-quaternary tracking-wide">EXCLUSIVE CONNECTIONS</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
            >
              <Link to="/profile">
                <div className="icon-container-hover w-12 h-12">
                  <Avatar name={user?.displayName} size="sm" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* No Connection */}
          {connectionStatus?.connectionStatus === 'none' && (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-12"
            >
              <div className="text-center space-y-8 py-16">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-3xl icon-container mb-8"
                    animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Search className="w-12 h-12 text-accent-purple" strokeWidth={1.5} />
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                  <h2 className="text-display-lg font-bold text-balance leading-tight">Ready to Connect</h2>
                  <p className="text-xl text-text-secondary max-w-2xl mx-auto text-balance leading-relaxed">
                    Find someone special and start your exclusive journey together
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <Button icon={<Search className="w-5 h-5" strokeWidth={2} />} size="lg" onClick={() => navigate('/search')} className="text-base px-8 py-4">Find Someone</Button>
                </motion.div>
              </div>

              <motion.div className="grid grid-cols-3 gap-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <StatCard icon={<Zap className="w-5 h-5 text-yellow-400" strokeWidth={2} />} value="1" label="Max Connections" delay={0.5} />
                <StatCard icon={<Heart className="w-5 h-5 text-pink-400" strokeWidth={2} />} value="0" label="Active Connection" delay={0.6} />
                <StatCard icon={<Lock className="w-5 h-5 text-purple-400" strokeWidth={2} />} value="100%" label="Privacy" delay={0.7} />
              </motion.div>
            </motion.div>
          )}

          {/* Pending Sent */}
          {connectionStatus?.connectionStatus === 'pending_sent' && connectionStatus?.pendingRequest && (
            <motion.div key="pending-sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <Card glow>
                <div className="text-center space-y-8 py-8">
                  <motion.div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl icon-container" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                    <Clock className="w-10 h-10 text-accent-purple" strokeWidth={1.5} />
                  </motion.div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold">Request Sent</h2>
                    <p className="text-text-secondary text-lg">Waiting for their response...</p>
                  </div>
                  <BasicUserCard user={connectionStatus.pendingRequest} />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Pending Received */}
          {connectionStatus?.connectionStatus === 'pending_received' && connectionStatus?.pendingRequest && (
            <motion.div key="pending-received" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <Card glow>
                <div className="text-center space-y-8 py-8">
                  <motion.div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl icon-container" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <span className="text-5xl">💌</span>
                  </motion.div>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold">New Request!</h2>
                    <p className="text-text-secondary text-xl">Someone wants to connect with you</p>
                  </div>
                  <BasicUserCard user={connectionStatus.pendingRequest} />
                  <div className="flex gap-4 pt-4">
                    <Button icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2} />} size="lg" onClick={handleAcceptRequest} className="flex-1 text-base">Accept</Button>
                    <Button icon={<XCircle className="w-5 h-5" strokeWidth={2} />} variant="secondary" size="lg" onClick={handleRejectRequest} className="flex-1 text-base">Decline</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Connected - USE NEW COMPONENT */}
          {connectionStatus?.connectionStatus === 'connected' && connectionStatus?.connectedTo && (
            <motion.div key="connected" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <DashboardConnected connectedUser={connectionStatus.connectedTo} onBreak={handleBreakConnection} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;