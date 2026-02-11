import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
            <h1 className="text-2xl font-bold text-white">Find Someone</h1>
            <p className="text-sm text-dark-600">Search by username</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Username</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username"
                  className="input-premium pl-11 text-white"
                  required
                />
              </div>
            </div>
            <Button type="submit" icon={<SearchIcon size={20} />} loading={loading} className="w-full">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </Card>

        {searchResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <div className="text-center space-y-4">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-glow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {searchResult.displayName[0]}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{searchResult.displayName}</h2>
                  <p className="text-dark-600 text-lg">@{searchResult.username}</p>
                </div>
                <Button icon={<Send size={20} />} onClick={handleSendRequest} className="w-full">
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