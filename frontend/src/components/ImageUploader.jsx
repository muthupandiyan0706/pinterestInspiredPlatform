import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';
import uploadService from '../services/uploadService';

const ImageUploader = ({ onUpload, currentImage = null }) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const data = await uploadService.uploadImage(file);
      onUpload(data.url);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
          <img src={preview} alt="Preview" className="w-full max-h-96 object-cover" />
          <button
            onClick={removeImage}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <FiX size={16} />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <motion.div
                className="w-10 h-10 rounded-full border-4 border-white/30"
                style={{ borderTopColor: '#fff' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all min-h-64"
          style={{
            borderColor: dragActive ? '#E60023' : '#ddd',
            backgroundColor: dragActive ? '#fff5f5' : '#fafafa',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: dragActive ? '#ffe0e4' : '#f0f0f0' }}
          >
            {dragActive ? (
              <FiUploadCloud size={24} style={{ color: '#E60023' }} />
            ) : (
              <FiImage size={24} style={{ color: '#767676' }} />
            )}
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#111' }}>
            {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm" style={{ color: '#E60023' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
