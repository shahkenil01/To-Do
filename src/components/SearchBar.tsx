import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
 
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      className="search-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Search size={18} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks... (⌘/ to focus)"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
          }}
          whileHover={{ scale: 1.2, color: 'var(--text-primary)' }}
        >
          <X size={16} />
        </motion.button>
      )}
    </motion.div>
  );
}
