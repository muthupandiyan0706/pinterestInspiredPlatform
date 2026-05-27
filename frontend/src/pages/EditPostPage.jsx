import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiRotateCw, FiRotateCcw, FiSun, FiSliders,
  FiDroplet, FiCrop, FiRefreshCw, FiCheck, FiX, FiUploadCloud, FiImage
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import postService from '../services/postService';
import uploadService from '../services/uploadService';
import { categories, getImageUrl } from '../utils/helpers';

const FILTERS = [
  { name: 'Original', value: 'none' },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(80%)' },
  { name: 'Warm', value: 'sepia(30%) saturate(140%) brightness(105%)' },
  { name: 'Cool', value: 'hue-rotate(180deg) saturate(60%) brightness(105%)' },
  { name: 'Vintage', value: 'sepia(40%) contrast(90%) brightness(95%) saturate(80%)' },
  { name: 'Dramatic', value: 'contrast(140%) brightness(90%) saturate(120%)' },
  { name: 'Fade', value: 'contrast(80%) brightness(115%) saturate(70%)' },
];

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);
  const fileInputRef = useRef(null);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('adjust');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  // Image editing state
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    filter: 'none',
  });

  // New image upload
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await postService.getPostById(id);
      if (user && data.userId !== user.id) {
        navigate('/');
        return;
      }
      setPost(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
      });
      loadImage(getImageUrl(data.imageUrl));
    } catch (err) {
      console.error('Failed to fetch post:', err);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const loadImage = (src) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      drawCanvas();
    };
    img.src = src;
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const isRotated = adjustments.rotation % 180 !== 0;
    const w = isRotated ? img.height : img.width;
    const h = isRotated ? img.width : img.height;

    // Scale to fit
    const maxW = 600;
    const maxH = 500;
    const scale = Math.min(maxW / w, maxH / h, 1);
    canvas.width = w * scale;
    canvas.height = h * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Build filter string
    const b = 100 + adjustments.brightness;
    const c = 100 + adjustments.contrast;
    const s = 100 + adjustments.saturation;
    let filterStr = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
    if (adjustments.filter !== 'none') {
      filterStr += ` ${adjustments.filter}`;
    }
    ctx.filter = filterStr;

    // Transform
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    if (adjustments.flipH) ctx.scale(-1, 1);
    if (adjustments.flipV) ctx.scale(1, -1);

    const drawW = img.width * scale;
    const drawH = img.height * scale;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  }, [adjustments]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleAdjustment = (key, value) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
    setImageChanged(true);
  };

  const handleRotate = (degrees) => {
    setAdjustments((prev) => ({
      ...prev,
      rotation: (prev.rotation + degrees + 360) % 360,
    }));
    setImageChanged(true);
  };

  const handleFlip = (axis) => {
    setAdjustments((prev) => ({
      ...prev,
      [axis === 'h' ? 'flipH' : 'flipV']: !prev[axis === 'h' ? 'flipH' : 'flipV'],
    }));
    setImageChanged(true);
  };

  const handleFilter = (filter) => {
    setAdjustments((prev) => ({ ...prev, filter }));
    setImageChanged(true);
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
      filter: 'none',
    });
    setImageChanged(newImageFile !== null);
  };

  const handleNewImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setNewImageFile(file);
    setImageChanged(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setNewImagePreview(e.target.result);
      loadImage(e.target.result);
      // Reset adjustments for new image
      setAdjustments({
        brightness: 0, contrast: 0, saturation: 0,
        rotation: 0, flipH: false, flipV: false, filter: 'none',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleNewImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const getEditedImageBlob = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please add a title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let imageUrl = post.imageUrl;

      // Upload new/edited image if changed
      if (imageChanged) {
        setUploading(true);
        const blob = await getEditedImageBlob();
        const file = new File([blob], `edited-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const uploadData = await uploadService.uploadImage(file);
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const updateData = {
        title: formData.title,
        description: formData.description,
        imageUrl: imageUrl,
        category: formData.category,
      };

      await postService.updatePost(id, updateData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;
  if (!post) return null;

  return (
    <div className="edit-post-page">
      {/* Header */}
      <div className="edit-post-header">
        <div className="edit-post-header-left">
          <button
            onClick={() => navigate(-1)}
            className="edit-back-btn"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="edit-post-title">Edit Pin</h1>
        </div>
        <div className="edit-post-header-right">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={saving}
            disabled={!formData.title.trim()}
            onClick={handleSubmit}
          >
            {uploading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="edit-error-banner"
        >
          {error}
        </motion.div>
      )}

      <div className="edit-post-content">
        {/* Left - Image Editor */}
        <div className="edit-image-section">
          <div className="edit-canvas-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <canvas ref={canvasRef} className="edit-canvas" />

            {/* Replace Image Button */}
            <button
              className="edit-replace-img-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Replace image"
            >
              <FiUploadCloud size={16} />
              <span>Replace</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleNewImage(e.target.files[0])}
            />
          </div>

          {/* Editor Toolbar */}
          <div className="edit-toolbar">
            {/* Tab Switcher */}
            <div className="edit-tab-bar">
              <button
                className={`edit-tab ${activeTab === 'adjust' ? 'active' : ''}`}
                onClick={() => setActiveTab('adjust')}
              >
                <FiSliders size={14} />
                Adjust
              </button>
              <button
                className={`edit-tab ${activeTab === 'transform' ? 'active' : ''}`}
                onClick={() => setActiveTab('transform')}
              >
                <FiRotateCw size={14} />
                Transform
              </button>
              <button
                className={`edit-tab ${activeTab === 'filters' ? 'active' : ''}`}
                onClick={() => setActiveTab('filters')}
              >
                <FiImage size={14} />
                Filters
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'adjust' && (
                <motion.div
                  key="adjust"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="edit-panel"
                >
                  <div className="edit-slider-group">
                    <div className="edit-slider-row">
                      <label><FiSun size={14} /> Brightness</label>
                      <div className="edit-slider-control">
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={adjustments.brightness}
                          onChange={(e) => handleAdjustment('brightness', Number(e.target.value))}
                          className="edit-range-slider"
                        />
                        <span className="edit-slider-value">{adjustments.brightness}</span>
                      </div>
                    </div>

                    <div className="edit-slider-row">
                      <label><FiSliders size={14} /> Contrast</label>
                      <div className="edit-slider-control">
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={adjustments.contrast}
                          onChange={(e) => handleAdjustment('contrast', Number(e.target.value))}
                          className="edit-range-slider"
                        />
                        <span className="edit-slider-value">{adjustments.contrast}</span>
                      </div>
                    </div>

                    <div className="edit-slider-row">
                      <label><FiDroplet size={14} /> Saturation</label>
                      <div className="edit-slider-control">
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={adjustments.saturation}
                          onChange={(e) => handleAdjustment('saturation', Number(e.target.value))}
                          className="edit-range-slider"
                        />
                        <span className="edit-slider-value">{adjustments.saturation}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'transform' && (
                <motion.div
                  key="transform"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="edit-panel"
                >
                  <div className="edit-transform-grid">
                    <button className="edit-transform-btn" onClick={() => handleRotate(-90)}>
                      <FiRotateCcw size={18} />
                      <span>Rotate Left</span>
                    </button>
                    <button className="edit-transform-btn" onClick={() => handleRotate(90)}>
                      <FiRotateCw size={18} />
                      <span>Rotate Right</span>
                    </button>
                    <button className="edit-transform-btn" onClick={() => handleFlip('h')}>
                      <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>↔</span>
                      <span>Flip H</span>
                    </button>
                    <button className="edit-transform-btn" onClick={() => handleFlip('v')}>
                      <span style={{ display: 'inline-block', transform: 'scaleY(-1)' }}>↕</span>
                      <span>Flip V</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'filters' && (
                <motion.div
                  key="filters"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="edit-panel"
                >
                  <div className="edit-filter-grid">
                    {FILTERS.map((f) => (
                      <button
                        key={f.name}
                        className={`edit-filter-btn ${adjustments.filter === f.value ? 'active' : ''}`}
                        onClick={() => handleFilter(f.value)}
                      >
                        <div className="edit-filter-preview">
                          {originalImageRef.current && (
                            <img
                              src={newImagePreview || getImageUrl(post.imageUrl)}
                              alt={f.name}
                              style={{ filter: f.value === 'none' ? 'none' : f.value }}
                            />
                          )}
                        </div>
                        <span>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="edit-reset-btn" onClick={resetAdjustments}>
              <FiRefreshCw size={14} />
              Reset All
            </button>
          </div>
        </div>

        {/* Right - Form Fields */}
        <div className="edit-form-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="edit-form-card"
          >
            <h2 className="edit-form-heading">Pin Details</h2>

            <div className="edit-form-fields">
              <Input
                label="Title"
                id="edit-post-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add a title"
                required
              />

              <div>
                <label htmlFor="edit-post-description" className="edit-field-label">
                  Description
                </label>
                <textarea
                  id="edit-post-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell everyone what your pin is about"
                  rows={5}
                  className="edit-textarea"
                  onFocus={(e) => e.target.style.borderColor = '#E60023'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div>
                <label htmlFor="edit-post-category" className="edit-field-label">
                  Category
                </label>
                <select
                  id="edit-post-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="edit-select"
                >
                  <option value="">Select a category</option>
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Change indicators */}
            <div className="edit-change-indicator">
              {imageChanged && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="edit-badge edit-badge-image"
                >
                  📷 Image modified
                </motion.span>
              )}
              {(formData.title !== (post?.title || '') ||
                formData.description !== (post?.description || '') ||
                formData.category !== (post?.category || '')) && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="edit-badge edit-badge-text"
                >
                  ✏️ Details modified
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
