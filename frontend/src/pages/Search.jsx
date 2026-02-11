import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, ArrowLeft, Send, User, Heart, MapPin, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSkeleton';

function Search() {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'search'
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscoverUsers();
  }, []);

  const fetchDiscoverUsers = async () => {
    setDiscoverLoading(true);
    try {
      const response = await api.get('/connection/discover?limit=20');
      setDiscoverUsers(response.data);
    } catch (err) {
      console.error('Discover error:', err);
      if (err.response?.status !== 400) {
        toast.error('Failed to load users');
      }
    } finally {
      setDiscoverLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get(`/connection/search/${searchUsername}`);
      if (response.data.available) {
        setSearchResult(response.data.user);
        toast.success('✓ User found!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await api.post('/connection/send-request', { recipientId: userId });
      toast.success('🎉 Connection request sent!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const UserCard = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card>
        <div className="space-y-6 p-6">
          <div className="flex items-start gap-4">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.displayName}
                className="w-16 h-16 rounded-2xl object-cover shadow-glow-subtle"
              />
            ) : (
              <Avatar name={user.displayName} size="lg" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold truncate">{user.displayName}</h3>
              <p className="text-text-tertiary text-sm">@{user.username}</p>
            </div>
          </div>

          {user.bio && (
            <p className="text-text-secondary text-sm leading-relaxed">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {user.age && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-xs text-text-tertiary">
                <Calendar className="w-3.5 h-3.5" />
                {user.age} years old
              </div>
            )}
            {user.location?.city && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-xs text-text-tertiary">
                <MapPin className="w-3.5 h-3.5" />
                {user.location.city}{user.location.country && `, ${user.location.country}`}
              </div>
            )}
          </div>

          {user.interests && user.interests.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-text-quaternary font-medium flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 5).map((interest, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {user.interests.length > 5 && (
                  <span className="px-3 py-1 rounded-full bg-bg-subtle border border-border text-text-quaternary text-xs font-medium">
                    +{user.interests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          <Button 
            icon={<Send className="w-4 h-4" strokeWidth={2} />} 
            onClick={() => handleSendRequest(user.id || user._id)} 
            className="w-full"
            size="md"
          >
            Send Connection Request
          </Button>
        </div>
      </Card>
    </motion.div>
  );

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
            <h1 className="text-xl font-bold">Find Someone</h1>
            <p className="text-xs text-text-tertiary">Discover & connect</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-bg-elevated border border-border rounded-xl">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'discover'
                ? 'bg-accent-purple text-white shadow-glow-subtle'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Discover
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'search'
                ? 'bg-accent-purple text-white shadow-glow-subtle'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <SearchIcon className="w-4 h-4" />
            Search
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {discoverLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : discoverUsers.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm">
                      {discoverUsers.length} available {discoverUsers.length === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discoverUsers.map((user) => (
                      <UserCard key={user._id || user.id} user={user} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState 
                  icon={<User className="w-10 h-10 text-accent-purple" strokeWidth={1.5} />}
                  title="No available users"
                  description="Check back later for new connections"
                />
              )}
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Search Card */}
              <Card>
                <form onSubmit={handleSearch} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2.5">Username</label>
                    <div className="relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" strokeWidth={2} />
                      <input
                        type="text"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        placeholder="Enter username"
                        className="input-premium pl-12 text-base"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    icon={<SearchIcon className="w-5 h-5" strokeWidth={2} />} 
                    loading={loading} 
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </form>
              </Card>

              {/* Search Results */}
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </motion.div>
                )}

                {!loading && searchResult && (
                  <UserCard user={searchResult} />
                )}

                {!loading && !searchResult && searched && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmptyState 
                      icon={<User className="w-10 h-10 text-accent-purple" strokeWidth={1.5} />}
                      title="No results found"
                      description="Try searching with a different username"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Search;