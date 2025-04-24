import { createContext } from 'react';

// Create Theme Context
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {}
});

export default ThemeContext; 