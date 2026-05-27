import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark, FiTrash2, FiMoreHorizontal, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { savedPostService } from '../services/savedPostService';
import { getImageUrl, formatDate } from '../utils/helpers';

const PostCard = ({ post, onDelete, onSaveToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(post.saved);
  const [isHovered, setIsHovered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isOwner = user?.id === post.userId;

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || saving) return;

    setSaving(true);
    try {
      if (isSaved) {
        await savedPostService.unsavePost(post.id);
        setIsSaved(false);
      } else {
        await savedPostService.savePost(post.id);
        setIsSaved(true);
      }
      onSaveToggle?.(post.id, !isSaved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this pin?')) {
      onDelete?.(post.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="masonry-grid-item"
    >
      <Link to={`/post/${post.id}`}>
        <div
          className="relative rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="relative">
            {!imageLoaded && (
              <div className="skeleton" style={{ paddingTop: '120%' }} />
            )}
            <img
              src={getImageUrl(post.imageUrl)}
              alt={post.title}
              className="w-full object-cover transition-transform duration-300"
              style={{
                display: imageLoaded ? 'block' : 'none',
                filter: isHovered ? 'brightness(0.85)' : 'brightness(1)',
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x600/efefef/999?text=Image+Error';
                setImageLoaded(true);
              }}
            />

            {/* Overlay Actions */}
            {isHovered && imageLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col justify-between p-3"
              >
                {/* Top Actions */}
                <div className="flex justify-end gap-2">
                  {isAuthenticated && (
                    <button
                      onClick={handleSaveToggle}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
                      style={{
                        backgroundColor: isSaved ? '#111' : '#E60023',
                        color: '#fff',
                      }}
                    >
                      <FiBookmark size={14} fill={isSaved ? '#fff' : 'none'} />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between">
                  {post.category && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#111' }}
                    >
                      {post.category}
                    </span>
                  )}
                  <div className="flex gap-1 ml-auto">
                    {isOwner && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/edit-post/${post.id}`);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                          title="Edit pin"
                        >
                          <FiEdit2 size={14} style={{ color: '#111' }} />
                        </button>
                        <button
                          onClick={handleDelete}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                        >
                          <FiTrash2 size={14} style={{ color: '#111' }} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Card Info */}
          <div className="p-2.5">
            {post.title && (
              <h3 className="text-sm font-semibold leading-tight line-clamp-2 text-center" style={{ color: '#111' }}>
                {post.title}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: '#E60023' }}
              >
                {post.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 truncate">{post.username}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;
