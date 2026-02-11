import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
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
        className="relative z-10 w-full max-w-md space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <motion.div
            className="inline-block text-6xl mb-4"
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            💎
          </motion.div>
          <h1 className="text-display-md font-bold text-gradient-purple mb-2">Promitto</h1>
          <p className="text-text-secondary">Your exclusive connection</p>
        </div>

        {/* Login Card */}
        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-text-tertiary text-sm">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" />
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email or username"
                    className="input-premium pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input-premium pl-11"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                icon={<LogIn className="w-5 h-5" />}
                loading={loading}
                className="w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-text-tertiary text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-accent-purple hover:text-accent-purple/80 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Floating elements */}
        <motion.div
          className="absolute -top-20 -right-20 text-4xl opacity-50"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute -bottom-20 -left-20 text-4xl opacity-50"
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
        >
          💫
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;