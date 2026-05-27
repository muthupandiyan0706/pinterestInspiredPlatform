import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    primary: {
      backgroundColor: '#E60023',
      color: '#fff',
    },
    secondary: {
      backgroundColor: '#e9e9e9',
      color: '#111',
    },
    dark: {
      backgroundColor: '#111',
      color: '#fff',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#111',
      border: '2px solid #ddd',
    },
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-full font-semibold transition-all
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        ...variants[variant],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      {...props}
    >
      {loading && (
        <motion.span
          className="w-4 h-4 rounded-full border-2"
          style={{
            borderColor: variant === 'primary' || variant === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
            borderTopColor: variant === 'primary' || variant === 'dark' ? '#fff' : '#111',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
