import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, ArrowLeft, Send, User } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

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

  const handleSendRequest = async () => {
    try {
      await api.post('/connection/send-request', { recipientId: searchResult.id });
      toast.success('🎉 Connection request sent!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

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
            <p className="text-xs text-text-tertiary">Search by username</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">
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

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <LoadingSpinner size="lg" />
            </motion.div>
          )}

          {!loading && searchResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card glow>
                <div className="text-center space-y-8 py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  >
                    <Avatar name={searchResult.displayName} size="2xl" />
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{searchResult.displayName}</h2>
                    <p className="text-text-tertiary text-lg">@{searchResult.username}</p>
                  </div>
                  <Button 
                    icon={<Send className="w-5 h-5" strokeWidth={2} />} 
                    onClick={handleSendRequest} 
                    className="w-full"
                    size="lg"
                  >
                    Send Connection Request
                  </Button>
                </div>
              </Card>
            </motion.div>
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
      </main>
    </div>
  );
}

export default Search;