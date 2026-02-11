import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">👤</div>
          <p className="text-dark-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-50">
      <header className="border-b border-white/5 backdrop-blur-xl bg-dark-50/50">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center gap-4">
          <Link to="/dashboard">
            <motion.div
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-sm text-dark-600">Your account details</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Card>
          <div className="text-center space-y-6">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-5xl mx-auto shadow-glow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{
                boxShadow: [
                  '0 0 30px rgba(168, 85, 247, 0.6)',
                  '0 0 50px rgba(236, 72, 153, 0.8)',
                  '0 0 30px rgba(168, 85, 247, 0.6)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user?.displayName?.[0]}
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{user?.displayName}</h2>
              <p className="text-dark-600 text-lg">@{user?.username}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <Mail className="w-6 h-6 text-primary-400" />
              <div className="flex-1">
                <p className="text-dark-600 text-sm">Email</p>
                <p className="text-white font-semibold">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <Phone className="w-6 h-6 text-primary-400" />
              <div className="flex-1">
                <p className="text-dark-600 text-sm">Phone</p>
                <p className="text-white font-semibold">
                  {user?.phoneNumbers?.find(p => p.isPrimary)?.number}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Button
          variant="danger"
          icon={<LogOut size={20} />}
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </main>
    </div>
  );
}

export default Profile;