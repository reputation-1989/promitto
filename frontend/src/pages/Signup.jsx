import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Key, User2, Mail, Lock, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BackgroundEffects } from '../components/BackgroundEffects';

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
      toast.success('📱 OTP sent!');
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
        colors: ['#8b5cf6', '#ec4899', '#3b82f6']
      });
      
      toast.success('🎉 Welcome to Promitto!');
      setAuth(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
          <div className="text-6xl mb-4">💎</div>
          <h1 className="text-display-md font-bold text-gradient-purple mb-2">Promitto</h1>
          <p className="text-text-secondary">Create your exclusive connection</p>
        </div>

        {/* Signup Card */}
        <Card>
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > i
                        ? 'bg-accent-purple text-white'
                        : step === i
                        ? 'bg-accent-purple text-white shadow-glow-subtle'
                        : 'bg-bg-subtle text-text-quaternary'
                    }`}
                    animate={step === i ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {step > i ? <Check className="w-4 h-4" /> : i}
                  </motion.div>
                  {i < 3 && (
                    <div className={`w-12 h-0.5 mx-1 rounded transition-all ${
                      step > i ? 'bg-accent-purple' : 'bg-border'
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Phone Verification</h3>
                    <p className="text-text-tertiary text-sm">Enter your phone number</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+919876543210"
                        className="input-premium pl-11"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" icon={<ArrowRight className="w-5 h-5" />} loading={loading} className="w-full">
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  onSubmit={verifyOTP}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Enter OTP</h3>
                    <p className="text-text-tertiary text-sm">6-digit code sent to your phone</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">OTP Code</label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      className="input-premium text-center text-2xl tracking-widest font-bold"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => setStep(1)} icon={<ArrowLeft className="w-5 h-5" />}>
                      Back
                    </Button>
                    <Button type="submit" icon={<ArrowRight className="w-5 h-5" />} loading={loading} className="flex-1">
                      {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Create Account</h3>
                    <p className="text-text-tertiary text-sm">Complete your profile</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="input-premium"
                      required
                    />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Display Name"
                      className="input-premium"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="input-premium"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password (min 6 characters)"
                      className="input-premium"
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="input-premium"
                      required
                    />
                  </div>
                  <Button type="submit" icon={<Sparkles className="w-5 h-5" />} loading={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-text-tertiary text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-purple hover:text-accent-purple/80 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Signup;