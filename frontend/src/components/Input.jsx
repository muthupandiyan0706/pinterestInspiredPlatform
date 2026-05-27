import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold mb-1.5" style={{ color: '#111' }}>
          {label}
          {required && <span style={{ color: '#E60023' }}> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 rounded-2xl text-sm transition-all border-2"
          style={{
            backgroundColor: '#fff',
            borderColor: error ? '#E60023' : '#ddd',
            outline: 'none',
            color: '#111',
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = '#111';
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = '#ddd';
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#E60023' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
