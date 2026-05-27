import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostGrid from '../components/PostGrid';
import Loader from '../components/Loader';
import savedPostService from '../services/savedPostService';

const SavedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const data = await savedPostService.getSavedPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch saved posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (postId, isSaved) => {
    if (!isSaved) {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 px-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#111' }}>
          Saved Pins
        </h1>
        <p className="text-sm text-gray-500">
          {posts.length} pin{posts.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      {loading ? (
        <Loader size="lg" />
      ) : (
        <PostGrid
          posts={posts}
          onSaveToggle={handleSaveToggle}
          emptyMessage="You haven't saved any pins yet"
        />
      )}
    </div>
  );
};

export default SavedPostsPage;
