import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
 
export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <motion.div className="theme-toggle" layout>
      <motion.button
        className="theme-btn"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
