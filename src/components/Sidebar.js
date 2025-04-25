import React, { useContext } from 'react';
import CitySelector from './CitySelector';
import ThemeContext from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// This will be implemented later
const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="mt-4">
    <label 
      htmlFor="search-input" 
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left"
    >
      Search Vendors
    </label>
    <div className="relative flex items-center">
      <input
        id="search-input"
        type="text"
        placeholder="Search vendors by name or food type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 pr-10"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400 dark:text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);

// Theme Toggle Button component
const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  const handleToggle = () => {
    // Call toggle function directly without logging
    toggleDarkMode();
  };
  
  return (
    <motion.button 
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md border transition-colors duration-200 
        ${darkMode 
          ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white' 
          : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-800'}`}
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.div 
            key="light-mode"
            className="flex items-center space-x-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Light</span>
          </motion.div>
        ) : (
          <motion.div 
            key="dark-mode"
            className="flex items-center space-x-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className="text-sm font-medium">Dark</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// This will be implemented later
const VendorCard = ({ vendor, isSelected, onClick, distanceText }) => {
  // Function to render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        layout: { duration: 0.3 }
      }}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 shadow-md' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 text-left">{vendor.name}</h3>
        <motion.span 
          whileHover={{ scale: 1.1 }}
          className="px-2 py-1 bg-orange-100 dark:bg-orange-800/50 text-orange-800 dark:text-orange-200 text-xs rounded-full"
        >
          {vendor.type}
        </motion.span>
      </div>
      
      <div className="flex items-center mt-1">
        <div className="flex mr-1">
          {renderStars(vendor.rating)}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{vendor.rating.toFixed(1)}</span>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2 text-left">
        {vendor.description}
      </p>
      
      <div className="flex justify-between mt-3">
        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {vendor.openHours}
        </span>
        <span className="text-sm text-blue-600 dark:text-blue-400">
          {vendor.city}
        </span>
      </div>
      
      {distanceText && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {distanceText}
        </motion.div>
      )}
    </motion.div>
  );
};

function Sidebar({ 
  vendors = [], 
  searchTerm = '', 
  setSearchTerm = () => {}, 
  selectedVendor = null, 
  setSelectedVendor = () => {},
  selectedCity = 'All Cities',
  setSelectedCity = () => {},
  getVendorDistanceText = () => null
}) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 shadow-md h-full transition-colors duration-200">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-500 mb-2 text-left">
            Indian Street Food Locator
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm text-left">
          Discover the best street food vendors across India
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <CitySelector 
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-4"
      >
        <motion.h2 
          layout
          className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-left"
        >
          {vendors.length} {vendors.length === 1 ? 'Vendor' : 'Vendors'} Found
        </motion.h2>
        
        {vendors.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md"
          >
            <p className="text-gray-500 dark:text-gray-400 text-left">No vendors found. Try a different search or location.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {vendors.map(vendor => (
                <motion.div
                  key={vendor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <VendorCard 
                    vendor={vendor}
                    isSelected={selectedVendor?.id === vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    distanceText={getVendorDistanceText(vendor)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Sidebar; 