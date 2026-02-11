import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { BackgroundEffects } from '../components/BackgroundEffects';

function Search() {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    setLoading(true);

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
            <h1 className="text-xl font-bold">Find Someone</h1>
            <p className="text-xs text-text-tertiary">Search by username</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-6">
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Username</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary w-5 h-5" />
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username"
                  className="input-premium pl-11"
                  required
                />
              </div>
            </div>
            <Button type="submit" icon={<SearchIcon className="w-5 h-5" />} loading={loading} className="w-full">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </Card>

        {searchResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card glow>
              <div className="text-center space-y-6">
                <Avatar name={searchResult.displayName} size="2xl" />
                <div>
                  <h2 className="text-2xl font-bold">{searchResult.displayName}</h2>
                  <p className="text-text-tertiary">@{searchResult.username}</p>
                </div>
                <Button icon={<Send className="w-5 h-5" />} onClick={handleSendRequest} className="w-full">
                  Send Connection Request
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Search;