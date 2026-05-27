import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiBookmark, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" style={{ height: '64px' }}>
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E60023' }}>
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-lg font-bold hidden sm:block" style={{ color: '#E60023' }}>Pinterest</span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100"
            style={{ color: '#111' }}
          >
            Home
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 rounded-full text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            style={{ color: '#111' }}
          >
            Create
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 hidden sm:block mx-4 md:mx-8 lg:mx-12">
          <div className="relative flex items-center w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search pins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-4 py-2.5 rounded-full text-sm transition-all relative z-0"
              style={{
                backgroundColor: '#e9e9e9',
                border: '2px solid transparent',
                outline: 'none',
                paddingLeft: '44px'
              }}
              onFocus={(e) => e.target.style.backgroundColor = '#fff'}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#e9e9e9';
                e.target.style.borderColor = 'transparent';
              }}
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FiPlus size={22} />
              </Link>
              <Link
                to="/saved"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FiBookmark size={20} />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors overflow-hidden"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#E60023' }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm">{user?.username}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiUser size={16} /> My Profile
                      </Link>
                      <Link
                        to="/saved"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiBookmark size={16} /> Saved Posts
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
                          style={{ color: '#E60023' }}
                        >
                          <FiLogOut size={16} /> Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-gray-100"
                style={{ color: '#111' }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 text-white"
                style={{ backgroundColor: '#E60023' }}
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            {showMobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 overflow-hidden"
          >
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search pins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-4 py-2.5 rounded-full text-sm relative z-0"
                  style={{ backgroundColor: '#e9e9e9', border: 'none', outline: 'none', paddingLeft: '44px' }}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
