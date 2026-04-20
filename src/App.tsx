import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import { TodoItem, Priority, Category } from './types';
import { sortTasks, filterTasks, calculateStats } from './utils/taskUtils';
import { loadState, saveState } from './utils/storage';
import ConfettiCanvas from './components/ConfettiCanvas';
import './index.css';
import PomodoroTimer from './components/PomodoroTimer';

// ✅ FIX 1: Removed `import { crypto } from 'crypto'` — browser crypto is globally available

type Filter = 'all' | 'active' | 'completed';
type SortOption = 'created' | 'dueDate' | 'priority' | 'alphabetical';

const STORAGE_KEY = 'taskflow-state';

const defaultCategories: Category[] = [
  { id: 'work', name: 'Work', color: '#f59e0b', icon: '💼' },
  { id: 'personal', name: 'Personal', color: '#6366f1', icon: '🏠' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: '🛒' },
  { id: 'health', name: 'Health', color: '#14b8a6', icon: '💪' },
];

  function loadPersistedState(): {
    tasks: TodoItem[];
    theme: 'light' | 'dark';
    categories: Category[];
  } {
    const saved = loadState<{ tasks: TodoItem[]; theme: 'light' | 'dark'; categories: Category[] }>(STORAGE_KEY);
  if (saved) {
    return {
      tasks: saved.tasks || [],
      theme: saved.theme || 'dark',
      categories: saved.categories || defaultCategories,
    };
  }
  return {
    tasks: [],
    theme: 'dark',
    categories: defaultCategories,
  };
}

export default function App() {
  const initial = loadPersistedState();

  const [tasks, setTasks] = useState<TodoItem[]>(initial.tasks);
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(initial.theme);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);

  // ✅ FIX 2: categories is now proper useState — no more stale reference
  const [categories] = useState<Category[]>(initial.categories);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ✅ FIX 3: Persist state now uses stable `categories` from useState
  useEffect(() => {
    saveState(STORAGE_KEY, { tasks, theme, categories });
  }, [tasks, theme, categories]);

  // Check for all tasks completed
  const allCompleted = useMemo(() => {
    return tasks.length > 0 && tasks.every((t) => t.completed);
  }, [tasks]);

  useEffect(() => {
    if (allCompleted && tasks.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [allCompleted, tasks.length]);

  const addTask = useCallback(
    (
      title: string,
      priority: Priority = 'medium',
      categoryId?: string,
      dueDate?: string,
    ) => {
      const newTask: TodoItem = {
        id: crypto.randomUUID(), // ✅ Uses browser's built-in globalThis.crypto
        title,
        completed: false,
        createdAt: Date.now(),
        priority,
        categoryId: categoryId || 'personal',
        dueDate: dueDate || undefined,
        createdAtDate: new Date().toISOString().split('T')[0],
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [],
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTask = useCallback((id: string, title: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }, []);

  const setTaskPriority = useCallback((id: string, priority: Priority) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
  }, []);

  const setTaskCategory = useCallback((id: string, categoryId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, categoryId } : t)),
    );
  }, []);

  const setTaskDueDate = useCallback(
    (id: string, dueDate: string | undefined) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, dueDate: dueDate || undefined } : t,
        ),
      );
    },
    [],
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.categoryId?.toLowerCase().includes(query),
      );
    }

    result = filterTasks(result, filter);

    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }

    result = sortTasks(result, sortBy);

    return result;
  }, [tasks, searchQuery, filter, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    return calculateStats(tasks);
  }, [tasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.search-input')?.focus();
      }
      if (e.key === 'Escape') {
        document.querySelector<HTMLInputElement>('.search-input')?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="background-mesh">
        <div className="mesh-gradient mesh-1" />
        <div className="mesh-gradient mesh-2" />
        <div className="mesh-gradient mesh-3" />
      </div>
      <div className="noise-overlay" />
      <ConfettiCanvas active={showConfetti} />

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      {pomodoroActive && (
        <PomodoroTimer
          time={pomodoroTime}
          isActive={pomodoroActive}
          onToggle={() => setPomodoroActive(!pomodoroActive)}
          onReset={() => {
            setPomodoroActive(false);
            setPomodoroTime(25 * 60);
          }}
        />
      )}

      <div className="container">
        <Header
          tasks={tasks}
          onTogglePomodoro={() => setPomodoroActive(!pomodoroActive)}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stats-bar">
            <motion.div
              className="stat-card card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </motion.div>
            <motion.div
              className="stat-card card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Active</div>
            </motion.div>
            <motion.div
              className="stat-card card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Done</div>
            </motion.div>
            <motion.div
              className="stat-card card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="stat-value">{stats.percentage}%</div>
              <div className="stat-label">Progress</div>
            </motion.div>
          </div>

          <div className="progress-container card">
            <div className="progress-ring">
              <svg viewBox="0 0 100 100">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <circle className="bg" cx="50" cy="50" r="42" />
                <circle
                  className="progress"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray={`${stats.percentage * 2.64} 264`}
                  stroke="url(#gradient)"
                />
              </svg>
              <div className="progress-text">{stats.percentage}%</div>
            </div>
            <div className="progress-label">
              <span style={{ color: getCompletionColor(stats.percentage) }}>
                {getCompletionMessage(stats.percentage)}
              </span>
            </div>
          </div>

          <TaskForm
            onAdd={addTask}
            categories={categories}
            priorities={['low', 'medium', 'high'] as Priority[]}
          />

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="filter-bar">
            <FilterBar current={filter} setFilter={setFilter} tasks={tasks} />
          </div>

          <div className="category-filter" style={{ marginBottom: '1rem' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>All Categories</option>
              {initial.categories.map(cat => (
                <option 
                  key={cat.id} 
                  value={cat.id}
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="created">Sort by: Newest First</option>
              <option value="dueDate">Sort by: Due Date</option>
              <option value="priority">Sort by: Priority</option>
              <option value="alphabetical">Sort by: Alphabetical</option>
            </select>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredAndSortedTasks.length > 0 ? (
              <TaskList
                tasks={filteredAndSortedTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onSetPriority={setTaskPriority}
                onSetCategory={setTaskCategory}
                onSetDueDate={setTaskDueDate}
                categories={categories}
                setTasks={setTasks}
              />
            ) : (
              <motion.div
                className="empty-state card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="empty-icon">✨</div>
                <h3>{searchQuery ? 'No matching tasks' : 'All caught up!'}</h3>
                <p>
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Add a task to get started'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {tasks.some((t) => t.completed) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="action-buttons"
              >
                <button
                  className="action-btn"
                  onClick={() => setTasks((prev) => [...prev])}
                >
                  <span>↻</span> Reset All
                </button>
                <button className="action-btn danger" onClick={clearCompleted}>
                  <span>🗑</span> Clear Completed
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

function getCompletionColor(percentage: number): string {
  if (percentage === 100) return '#22c55e';
  if (percentage >= 70) return '#14b8a6';
  if (percentage >= 40) return '#6366f1';
  return '#f59e0b';
}

function getCompletionMessage(percentage: number): string {
  if (percentage === 100) return '🎉 Perfect! All completed!';
  if (percentage >= 80) return 'Amazing progress!';
  if (percentage >= 60) return 'Great momentum!';
  if (percentage >= 40) return 'Keep pushing!';
  if (percentage >= 20) return 'Good start!';
  return "Let's get started!";
}
