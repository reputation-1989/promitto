import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, LogOut, User2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { LoadingSpinner } from '../components/ui/LoadingSkeleton';

function Profile({ setAuth }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth(false);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundEffects />
        <div className="relative z-10 text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundEffects />

      {/* Header */}
      <header className="relative z-10 backdrop-premium border-b border-border sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link to="/dashboard">
            <motion.div
              className="w-11 h-11 rounded-xl bg-bg-elevated border border-border flex items-center justify-center hover:bg-bg-hover hover:border-border-hover cursor-pointer transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-xs text-text-tertiary">Your account details</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Profile Card */}
        <Card>
          <div className="text-center space-y-6 py-8">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Avatar name={user?.displayName} size="2xl" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold">{user?.displayName}</h2>
              <p className="text-text-tertiary text-lg">@{user?.username}</p>
            </div>
          </div>
        </Card>

        {/* Details Card */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Account Information</h3>
            
            <div className="flex items-center gap-4 p-5 rounded-xl bg-bg-subtle/50 border border-border hover:border-border-hover transition-all duration-200">
              <div className="w-12 h-12 rounded-xl icon-container flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent-purple" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-1">Email Address</p>
                <p className="font-medium truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-xl bg-bg-subtle/50 border border-border hover:border-border-hover transition-all duration-200">
              <div className="w-12 h-12 rounded-xl icon-container flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-accent-purple" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-1">Phone Number</p>
                <p className="font-medium truncate">
                  {user?.phoneNumbers?.find(p => p.isPrimary)?.number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-xl bg-bg-subtle/50 border border-border hover:border-border-hover transition-all duration-200">
              <div className="w-12 h-12 rounded-xl icon-container flex items-center justify-center flex-shrink-0">
                <User2 className="w-5 h-5 text-accent-purple" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-1">Username</p>
                <p className="font-medium truncate">@{user?.username}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          variant="ghost"
          icon={<LogOut className="w-5 h-5" strokeWidth={2} />}
          onClick={handleLogout}
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/30"
          size="lg"
        >
          Logout
        </Button>
      </main>
    </div>
  );
}

export default Profile;