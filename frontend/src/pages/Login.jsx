import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BackgroundEffects } from '../components/BackgroundEffects';

function Login({ setAuth }) {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuth(true);
      toast.success('🎉 Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <BackgroundEffects />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-md space-y-10"
      >
        {/* Logo - Enhanced */}
        <div className="text-center space-y-6">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink shadow-glow-medium"
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -8, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-4xl">💎</span>
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-display-md font-bold text-gradient-purple">Promitto</h1>
            <p className="text-text-secondary text-lg">Your exclusive connection</p>
          </div>
        </div>

        {/* Login Card - Perfected */}
        <Card>
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-text-tertiary">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" strokeWidth={2} />
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email or username"
                    className="input-premium pl-12 text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" strokeWidth={2} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input-premium pl-12 text-base"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                icon={<LogIn className="w-5 h-5" strokeWidth={2} />}
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-border">
              <p className="text-text-tertiary">
                Don't have an account?{' '}
                <Link to="/signup" className="text-accent-purple hover:text-accent-purple-muted font-semibold transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Floating elements - More subtle */}
        <motion.div
          className="absolute -top-24 -right-24 text-4xl opacity-30"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-12 h-12 text-accent-purple" />
        </motion.div>
        <motion.div
          className="absolute -bottom-24 -left-24 text-4xl opacity-30"
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        >
          <Zap className="w-12 h-12 text-accent-pink" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;