import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Phone, LogOut, User2, Edit3, Save, X, Camera, MapPin, Calendar, Heart, Plus } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    interests: [],
    age: null,
    location: { city: '', country: '' }
  });
  const [newInterest, setNewInterest] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      setProfileData({
        displayName: response.data.displayName || '',
        bio: response.data.bio || '',
        interests: response.data.interests || [],
        age: response.data.age || null,
        location: response.data.location || { city: '', country: '' }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await api.post('/auth/profile-picture', { image: event.target.result });
        toast.success('Profile picture updated!');
        fetchUser();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to upload photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', profileData);
      toast.success('Profile updated successfully!');
      setUser({ ...user, ...profileData });
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (profileData.interests.length >= 10) {
      toast.error('Maximum 10 interests allowed');
      return;
    }
    setProfileData({
      ...profileData,
      interests: [...profileData.interests, newInterest.trim()]
    });
    setNewInterest('');
  };

  const handleRemoveInterest = (index) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter((_, i) => i !== index)
    });
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      }
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
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          {!isEditing ? (
            <Button
              icon={<Edit3 className="w-4 h-4" />}
              onClick={() => setIsEditing(true)}
              size="md"
              variant="secondary"
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                icon={<X className="w-4 h-4" />}
                onClick={() => {
                  setIsEditing(false);
                  setProfileData({
                    displayName: user.displayName,
                    bio: user.bio || '',
                    interests: user.interests || [],
                    age: user.age || null,
                    location: user.location || { city: '', country: '' }
                  });
                }}
                size="md"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                icon={<Save className="w-4 h-4" />}
                onClick={handleSaveProfile}
                size="md"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-6">
        {/* Profile Header Card */}
        <Card>
          <div className="text-center space-y-6 py-8">
            <div className="relative inline-block">
              <motion.div
                animate={!isEditing ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.displayName}
                    className="w-32 h-32 rounded-3xl object-cover shadow-glow-subtle"
                  />
                ) : (
                  <Avatar name={user?.displayName} size="2xl" />
                )}
              </motion.div>
              {isEditing && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-accent-purple text-white flex items-center justify-center shadow-glow-medium hover:shadow-glow-strong cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            
            {!isEditing ? (
              <div className="space-y-2">
                <h2 className="text-4xl font-bold">{user?.displayName}</h2>
                <p className="text-text-tertiary text-lg">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-text-secondary text-base max-w-2xl mx-auto mt-4">{user.bio}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  className="input-premium w-full text-center text-2xl font-bold"
                  placeholder="Display Name"
                />
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="input-premium w-full text-center min-h-[80px] resize-none"
                  placeholder="Write something about yourself..."
                  maxLength={500}
                />
                <p className="text-xs text-text-quaternary text-right">
                  {profileData.bio.length}/500
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Interests */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent-pink" />
                Interests
              </h3>
              {!isEditing && user?.interests?.length === 0 && (
                <Button
                  icon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  variant="ghost"
                >
                  Add
                </Button>
              )}
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  className="input-premium flex-1"
                  placeholder="Add an interest (e.g. Music, Travel, Gaming)"
                  maxLength={30}
                />
                <Button
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddInterest}
                  size="md"
                >
                  Add
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {(isEditing ? profileData.interests : user?.interests || []).map((interest, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-medium flex items-center gap-2"
                  >
                    {interest}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveInterest(index)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {(!isEditing && (!user?.interests || user.interests.length === 0)) && (
                <p className="text-text-tertiary text-sm">No interests added yet</p>
              )}
            </div>
          </div>
        </Card>

        {/* Personal Info */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-text-tertiary font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.age || ''}
                    onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) || null })}
                    className="input-premium w-full"
                    placeholder="Your age"
                    min="13"
                    max="120"
                  />
                ) : (
                  <p className="text-base font-medium">{user?.age || 'Not specified'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-text-tertiary font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location.city}
                    onChange={(e) => setProfileData({ 
                      ...profileData, 
                      location: { ...profileData.location, city: e.target.value }
                    })}
                    className="input-premium w-full"
                    placeholder="Your city"
                  />
                ) : (
                  <p className="text-base font-medium">{user?.location?.city || 'Not specified'}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs text-text-tertiary font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location.country}
                    onChange={(e) => setProfileData({ 
                      ...profileData, 
                      location: { ...profileData.location, country: e.target.value }
                    })}
                    className="input-premium w-full"
                    placeholder="Your country"
                  />
                ) : (
                  <p className="text-base font-medium">{user?.location?.country || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-subtle/50 border border-border">
              <div className="w-10 h-10 rounded-xl icon-container flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent-purple" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-1">Email Address</p>
                <p className="font-medium truncate text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-subtle/50 border border-border">
              <div className="w-10 h-10 rounded-xl icon-container flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-accent-purple" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-1">Phone Number</p>
                <p className="font-medium truncate text-sm">
                  {user?.phoneNumbers?.find(p => p.isPrimary)?.number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-subtle/50 border border-border">
              <div className="w-10 h-10 rounded-xl icon-container flex items-center justify-center flex-shrink-0">
                <User2 className="w-5 h-5 text-accent-purple" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-1">Username</p>
                <p className="font-medium truncate text-sm">@{user?.username}</p>
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