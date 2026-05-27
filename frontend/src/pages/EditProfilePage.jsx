import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import userService from '../services/userService';
import uploadService from '../services/uploadService';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setFormData({
        username: data.username || '',
        email: data.email || '',
        bio: data.bio || '',
        profileImage: data.profileImage || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      const data = await uploadService.uploadImage(file);
      setFormData({ ...formData, profileImage: data.url });
      setSuccessMessage('Profile image uploaded. Save to apply.');
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const data = await userService.updateProfile(formData);
      updateUser(data);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: '#111' }}>Edit Profile</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm p-6 md:p-8"
      >
        {error && (
          <div className="mb-6 p-3 rounded-2xl text-sm text-center" style={{ backgroundColor: '#ffe0e4', color: '#E60023' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 rounded-2xl text-sm text-center" style={{ backgroundColor: '#e6ffe6', color: '#008000' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{ backgroundColor: '#E60023' }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <label
                htmlFor="profile-image"
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <FiCamera size={24} color="#fff" />
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to change avatar</p>
          </div>

          <Input
            label="Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div>
            <label htmlFor="bio" className="block text-sm font-semibold mb-1.5" style={{ color: '#111' }}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl text-sm transition-all border-2 resize-none"
              style={{
                backgroundColor: '#fff',
                borderColor: '#ddd',
                outline: 'none',
                color: '#111',
              }}
              onFocus={(e) => e.target.style.borderColor = '#111'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfilePage;
