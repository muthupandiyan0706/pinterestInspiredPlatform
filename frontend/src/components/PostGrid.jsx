import { AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';

const PostGrid = ({ posts, onDelete, onSaveToggle, emptyMessage = 'No pins found' }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh', padding: '0 20px' }}>
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f0f0f0' }}>
          <span className="text-5xl" style={{ transform: 'rotate(-45deg)', display: 'inline-block' }}>📌</span>
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: '#111' }}>
          {emptyMessage}
        </h3>
        <p className="text-base text-gray-500 mb-8 font-medium">
          Try exploring different categories or creating new pins
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-3 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#E60023' }}
        >
          Explore categories
        </button>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={onDelete}
            onSaveToggle={onSaveToggle}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PostGrid;
