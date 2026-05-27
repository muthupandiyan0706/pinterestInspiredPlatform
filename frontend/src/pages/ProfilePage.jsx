import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiLogOut, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import PostGrid from '../components/PostGrid';
import Loader from '../components/Loader';
import Button from '../components/Button';
import userService from '../services/userService';
import postService from '../services/postService';
import { formatDate } from '../utils/helpers';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !id || (currentUser && currentUser.id === parseInt(id));

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      let profileData;
      if (isOwnProfile) {
        profileData = await userService.getProfile();
      } else {
        profileData = await userService.getUserById(id);
      }
      setProfile(profileData);

      const userId = isOwnProfile ? currentUser?.id : id;
      if (userId) {
        const postsData = await postService.getPostsByUser(userId);
        setPosts(postsData);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;
  if (!profile) return null;

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10 px-4"
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #E60023, #ad081b)',
            }}
          >
            {profile.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#111' }}>
          {profile.username}
        </h1>
        <p className="text-sm text-gray-500 mb-1">@{profile.username}</p>

        {profile.bio && (
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: '#111' }}>{profile.postCount || 0}</p>
            <p className="text-xs text-gray-500">Pins</p>
          </div>
          <div className="text-center flex items-center gap-1 text-gray-400">
            <FiCalendar size={14} />
            <span className="text-xs">Joined {formatDate(profile.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        {isOwnProfile && (
          <div className="flex justify-center gap-3 mt-5">
            <Link to="/edit-profile">
              <Button variant="secondary" size="md">
                <FiEdit2 size={14} /> Edit profile
              </Button>
            </Link>
            <Button variant="outline" size="md" onClick={handleLogout}>
              <FiLogOut size={14} /> Logout
            </Button>
          </div>
        )}
      </motion.div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-2">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex justify-center">
            <span
              className="px-6 py-3 text-sm font-bold border-b-2"
              style={{ color: '#111', borderBottomColor: '#111' }}
            >
              Created
            </span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <PostGrid
        posts={posts}
        onDelete={handleDelete}
        emptyMessage={isOwnProfile ? 'Create your first pin!' : 'No pins yet'}
      />
    </div>
  );
};

export default ProfilePage;
