import React from 'react';
import { motion } from 'framer-motion';
import { Filter as FilterIcon } from 'lucide-react';
import { TodoItem, Filter as FilterType } from '../types';
 
interface FilterBarProps {
  current: FilterType;
  setFilter: (filter: FilterType) => void;
  tasks: TodoItem[];
}

export default function FilterBar({ current, setFilter, tasks }: FilterBarProps) {
  const counts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <FilterIcon size={14} /> },
    { key: 'active', label: 'Active', icon: <span style={{ fontSize: '0.8rem' }}>○</span> },
    { key: 'completed', label: 'Done', icon: <span style={{ fontSize: '0.8rem' }}>✓</span> },
  ];

  return (
    <motion.div
      className="filter-bar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {filters.map(({ key, label, icon }) => (
        <motion.button
          key={key}
          className={`filter-btn ${current === key ? 'active' : ''}`}
          onClick={() => setFilter(key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          layout
        >
          {icon}
          <span>{label}</span>
          {counts[key] > 0 && (
            <motion.span
              className="filter-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={counts[key]}
            >
              {counts[key]}
            </motion.span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}
