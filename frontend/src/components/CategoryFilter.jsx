import { motion } from 'framer-motion';
import { categories } from '../utils/helpers';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div 
      className="flex gap-3 md:justify-center overflow-x-auto px-6 py-5 scrollbar-hide snap-x" 
      style={{ scrollbarWidth: 'none' }}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category || (category === 'All' && !selectedCategory);

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category === 'All' ? '' : category)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors shrink-0 snap-center outline-none ${
              isActive ? 'text-[#E60023]' : 'text-gray-700 hover:bg-gray-200/80'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Animated Background Pill */}
            {isActive && (
              <motion.div
                layoutId="activeCategoryIndicator"
                className="absolute inset-0 rounded-full bg-[#ffe0e4]"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8
                }}
                style={{ zIndex: -1 }}
              />
            )}
            
            {/* Text with slight pop animation on hover if not active */}
            <motion.span
              whileHover={!isActive ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 block"
            >
              {category}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
