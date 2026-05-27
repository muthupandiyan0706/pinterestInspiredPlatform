import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBookmark, FiTrash2, FiShare2, FiExternalLink, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import Button from '../components/Button';
import postService from '../services/postService';
import savedPostService from '../services/savedPostService';
import { getImageUrl, formatDate } from '../utils/helpers';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await postService.getPostById(id);
      setPost(data);
      setIsSaved(data.saved);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
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
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pin?')) {
      try {
        await postService.deletePost(post.id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;
  if (!post) return null;

  const isOwner = user?.id === post.userId;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          style={{ backgroundColor: '#fff' }}
        >
          <FiArrowLeft size={20} />
        </button>
      </div>

      {/* Post Card */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="bg-gray-100 flex items-center justify-center min-h-64">
              <img
                src={getImageUrl(post.imageUrl)}
                alt={post.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: '700px' }}
              />
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex flex-col">
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <FiShare2 size={18} />
                  </button>
                  {isOwner && (
                    <>
                      <button
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ color: '#111' }}
                        title="Edit pin"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ color: '#E60023' }}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </>
                  )}
                </div>

                {isAuthenticated && (
                  <Button
                    variant={isSaved ? 'dark' : 'primary'}
                    size="md"
                    onClick={handleSaveToggle}
                    loading={saving}
                  >
                    <FiBookmark size={16} fill={isSaved ? '#fff' : 'none'} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                )}
              </div>

              {/* Category */}
              {post.category && (
                <Link
                  to={`/?category=${post.category}`}
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 hover:opacity-80 transition-opacity self-start"
                  style={{ backgroundColor: '#e9e9e9', color: '#111' }}
                >
                  {post.category}
                </Link>
              )}

              {/* Title & Description */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#111' }}>
                {post.title}
              </h1>

              {post.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {post.description}
                </p>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Author Info */}
              <div className="border-t border-gray-100 pt-5 mt-4">
                <Link
                  to={`/profile/${post.userId}`}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: '#E60023' }}
                  >
                    {post.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:underline" style={{ color: '#111' }}>
                      {post.username}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetailPage;
