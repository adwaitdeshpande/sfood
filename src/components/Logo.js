import React from 'react';
import { motion } from 'framer-motion';

function Logo({ size = 'medium' }) {
  // Calculate size based on prop
  const getSizeClass = () => {
    switch(size) {
      case 'small':
        return 'text-xl md:text-2xl';
      case 'large':
        return 'text-3xl md:text-4xl';
      case 'medium':
      default:
        return 'text-2xl md:text-3xl';
    }
  };

  return (
    <motion.div 
      className="flex items-center font-bold cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={`${getSizeClass()} text-gray-800 dark:text-gray-100`}>s</span>
      <motion.span 
        className={`${getSizeClass()} text-orange-500`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.2,
          type: "spring",
          stiffness: 300
        }}
      >
        Food
      </motion.span>
      <motion.span
        className="absolute -mt-1 ml-1 h-1.5 w-1.5 rounded-full bg-orange-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.4,
          type: "spring",
          stiffness: 500
        }}
      />
    </motion.div>
  );
}

export default Logo; 