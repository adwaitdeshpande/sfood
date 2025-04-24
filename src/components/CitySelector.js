import React from 'react';
import { motion } from 'framer-motion';

function CitySelector({ selectedCity, setSelectedCity }) {
  const cities = ['All Cities', 'Mumbai', 'Pune', 'Bangalore'];
  
  return (
    <div className="mb-4">
      <motion.label 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        htmlFor="city-select" 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left"
      >
        Select Location
      </motion.label>
      <div className="relative">
        <motion.select
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-md appearance-none"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </motion.select>
        <motion.div 
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300"
          animate={{ 
            rotate: selectedCity !== 'All Cities' ? 180 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export default CitySelector;