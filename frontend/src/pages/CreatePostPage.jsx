import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import ImageUploader from '../components/ImageUploader';
import Input from '../components/Input';
import Button from '../components/Button';
import postService from '../services/postService';
import { categories } from '../utils/helpers';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageUpload = (url) => {
    setFormData({ ...formData, imageUrl: url });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      setError('Please upload an image');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please add a title');
      return;
    }

    setLoading(true);
    try {
      const post = await postService.createPost(formData);
      navigate(`/post/${post.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: '#111' }}>Create Pin</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm p-6 md:p-8"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 rounded-2xl text-sm text-center"
            style={{ backgroundColor: '#ffe0e4', color: '#E60023' }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Image */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#111' }}>
                Image <span style={{ color: '#E60023' }}>*</span>
              </label>
              <ImageUploader onUpload={handleImageUpload} />
            </div>

            {/* Right - Details */}
            <div className="space-y-5">
              <Input
                label="Title"
                id="post-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add a title"
                required
              />

              <div>
                <label htmlFor="post-description" className="block text-sm font-semibold mb-1.5" style={{ color: '#111' }}>
                  Description
                </label>
                <textarea
                  id="post-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell everyone what your pin is about"
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

              <div>
                <label htmlFor="post-category" className="block text-sm font-semibold mb-1.5" style={{ color: '#111' }}>
                  Category
                </label>
                <select
                  id="post-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-sm transition-all border-2 appearance-none cursor-pointer"
                  style={{
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    outline: 'none',
                    color: formData.category ? '#111' : '#767676',
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={!formData.imageUrl || !formData.title.trim()}
                  className="flex-1"
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePostPage;
