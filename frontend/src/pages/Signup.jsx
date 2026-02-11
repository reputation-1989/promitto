import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Key, User, Mail, Lock, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { Button } from '../components/ui/Button';

function Signup({ setAuth }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phoneNumber: formData.phoneNumber });
      toast.success('📱 OTP sent to your phone!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp
      });
      toast.success('✓ Phone verified!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#8b5cf6']
      });
      
      toast.success('🎉 Welcome to Promitto!', { duration: 3000 });
      setAuth(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-50 via-dark-100 to-dark-50 p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div className="text-center mb-8">
          <div className="text-7xl mb-4">💎</div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Promitto</h1>
          <p className="text-dark-600">Create your exclusive connection</p>
        </motion.div>

        {/* Signup Card */}
        <div className="glass-card p-8 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= i
                      ? 'bg-gradient-to-br from-primary-500 to-pink-500 text-white shadow-glow'
                      : 'bg-white/5 text-dark-500'
                  }`}
                  animate={step === i ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {i}
                </motion.div>
                {i < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${
                    step > i ? 'bg-gradient-to-r from-primary-500 to-pink-500' : 'bg-white/5'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                onSubmit={sendOTP}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white">Phone Verification</h3>
                  <p className="text-dark-600 text-sm">Enter your phone number</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+919876543210"
                      className="input-premium pl-11 text-white"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" icon={<ArrowRight size={20} />} loading={loading} className="w-full">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={verifyOTP}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white">Enter OTP</h3>
                  <p className="text-dark-600 text-sm">6-digit code sent to your phone</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">OTP Code</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      className="input-premium pl-11 text-white text-center text-2xl tracking-widest font-bold"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)} icon={<ArrowLeft size={20} />}>
                    Back
                  </Button>
                  <Button type="submit" icon={<ArrowRight size={20} />} loading={loading} className="flex-1">
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                onSubmit={handleSignup}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white">Create Account</h3>
                  <p className="text-dark-600 text-sm">Complete your profile</p>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="input-premium text-white"
                    required
                  />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Display Name"
                    className="input-premium text-white"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="input-premium text-white"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password (min 6 characters)"
                    className="input-premium text-white"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="input-premium text-white"
                    required
                  />
                </div>
                <Button type="submit" icon={<Sparkles size={20} />} loading={loading} className="w-full">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-dark-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;