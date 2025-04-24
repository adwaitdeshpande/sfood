/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add custom colors for dark mode
        dark: {
          bg: {
            primary: '#1f2937',
            secondary: '#111827',
            tertiary: '#374151',
          },
          text: {
            primary: '#f3f4f6',
            secondary: '#e5e7eb',
            tertiary: '#d1d5db',
          }
        }
      },
    },
  },
  plugins: [],
} 