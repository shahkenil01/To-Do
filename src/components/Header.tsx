import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame } from 'lucide-react';
import { TodoItem } from '../types';
 
interface HeaderProps {
  tasks: TodoItem[];
  onTogglePomodoro: () => void;
}

export default function Header({ tasks, onTogglePomodoro }: HeaderProps) {
  const completedToday = tasks.filter(t => {
    if (!t.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.createdAtDate === today;
  }).length;

  const streak = calculateStreak(tasks);

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="logo">
        <motion.div
          className="logo-icon"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Target size={24} strokeWidth={2.5} />
        </motion.div>
        <h1>TaskFlow</h1>
      </div>
      <p className="header-subtitle">
        {tasks.length === 0
          ? 'Start building your productive day'
          : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} • ${completedToday} completed today`}
      </p>

      <motion.button
        className="add-task-btn"
        onClick={onTogglePomodoro}
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-primary)',
          fontWeight: '500',
          fontSize: '0.9rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          alignSelf: 'center',
          transition: 'all 0.3s var(--ease-out)',
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
        whileTap={{ scale: 0.98 }}
      >
        <Flame size={18} />
        Focus Mode
        {streak > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: 'var(--gradient-primary)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
            }}
          >
            {streak}🔥
          </motion.span>
        )}
      </motion.button>
    </motion.header>
  );
}

function calculateStreak(tasks: TodoItem[]): number {
  let streak = 0;
  let current = new Date();

  while (true) {
    const dateStr = current.toISOString().split('T')[0];
    const hasCompletedToday = tasks.some(t =>
      t.completed && t.createdAtDate === dateStr
    );

    if (hasCompletedToday) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
