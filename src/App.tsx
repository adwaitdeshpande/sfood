import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import './darkMode.css';
import Layout from './components/Layout.js';
import { motion } from 'framer-motion';
import ThemeContext from './contexts/ThemeContext';

// Main App component that renders the Indian Street Food Locator
function App() {
  // Initialize from localStorage with a default of false if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  
  // Create a memoized toggle function with useCallback
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      console.log("Toggle dark mode from", prevMode, "to", newMode);
      // Update localStorage
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    console.log('Dark mode state is now:', darkMode);
    
    // Apply or remove dark class on document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Force a reflow to ensure styles are applied
    document.body.style.transition = 'background-color 0.5s, color 0.5s';
    
    // Debug information
    console.log('Dark mode classes applied:', 
      document.documentElement.classList.contains('dark') ? 'yes' : 'no');
  }, [darkMode]);

  // Simple page transition
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {/* Apply dark class to a top-level wrapping div that contains everything */}
      <div className={darkMode ? 'dark' : ''} 
           style={{ height: '100%', width: '100%' }}>
        <motion.div 
          className="App"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3 }}
        >
          <Layout />
        </motion.div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App; 