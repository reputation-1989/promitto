import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, LogOut, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';

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
        <div className="relative z-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-purple mx-auto mb-4" />
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundEffects />

      <header className="relative z-10 border-b border-border backdrop-premium">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/dashboard">
            <motion.div
              className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center hover:bg-bg-subtle cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-xs text-text-tertiary">Your account details</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-6">
        <Card>
          <div className="text-center space-y-6">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Avatar name={user?.displayName} size="2xl" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold">{user?.displayName}</h2>
              <p className="text-text-tertiary">@{user?.username}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-subtle border border-border">
              <div className="w-10 h-10 rounded-xl bg-accent-purple-glow flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent-purple" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-tertiary">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-subtle border border-border">
              <div className="w-10 h-10 rounded-xl bg-accent-purple-glow flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent-purple" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-tertiary">Phone</p>
                <p className="font-medium">
                  {user?.phoneNumbers?.find(p => p.isPrimary)?.number}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Button
          variant="ghost"
          icon={<LogOut className="w-5 h-5" />}
          onClick={handleLogout}
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          Logout
        </Button>
      </main>
    </div>
  );
}

export default Profile;