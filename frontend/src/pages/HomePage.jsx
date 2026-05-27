import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PostGrid from '../components/PostGrid';
import CategoryFilter from '../components/CategoryFilter';
import Loader from '../components/Loader';
import postService from '../services/postService';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await postService.searchPosts(searchQuery);
      } else if (selectedCategory) {
        data = await postService.getPostsByCategory(selectedCategory);
      } else {
        data = await postService.getAllPosts();
      }
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* Hero / Search Info */}
      {searchQuery ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 px-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#111' }}>
            Results for &quot;{searchQuery}&quot;
          </h1>
          <p className="text-sm text-gray-500">
            {posts.length} pin{posts.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>
      ) : (
        <div className="pt-2">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <Loader size="lg" />
      ) : (
        <PostGrid
          posts={posts}
          onDelete={handleDelete}
          emptyMessage={
            searchQuery
              ? `No results for "${searchQuery}"`
              : selectedCategory
              ? `No pins in "${selectedCategory}"`
              : 'No pins yet. Be the first to create one!'
          }
        />
      )}
    </div>
  );
};

export default HomePage;
