import { FiHeart, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E60023' }}
              >
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-bold" style={{ color: '#E60023' }}>
                Pinterest
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Discover creative ideas and inspiration for your life.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <FiFacebook size={18} style={{ color: '#111' }} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <FiInstagram size={18} style={{ color: '#111' }} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="font-bold text-lg" style={{ color: '#111' }}>P</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <FiTwitter size={18} style={{ color: '#111' }} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#111' }}>Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#111' }}>Community</h4>
            <ul className="space-y-2">
              {['Creators', 'Guidelines', 'Safety', 'Help'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#111' }}>Legal</h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Cookies', 'Licenses'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Pinterest Clone. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Made with <FiHeart size={12} style={{ color: '#E60023' }} /> for creativity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
