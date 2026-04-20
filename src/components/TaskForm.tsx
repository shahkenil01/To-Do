import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Calendar, Flag, DollarSign, Heart, Music, Book, Coffee, Gamepad2 } from 'lucide-react';
import { Priority, Category } from '../types';

interface TaskFormProps {
  onAdd: (title: string, priority?: Priority, categoryId?: string, dueDate?: string) => void;
  categories: Category[];
  priorities: Priority[];
}

const quickTags = [
  { label: 'Work', icon: '💼', categoryId: 'work' },
  { label: 'Personal', icon: '🏠', categoryId: 'personal' },
  { label: 'Shopping', icon: '🛒', categoryId: 'shopping' },
  { label: 'Health', icon: '💪', categoryId: 'health' },
];

export default function TaskForm({ onAdd, categories, priorities }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<string>('personal');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed, priority, categoryId, dueDate || undefined);
      setTitle('');
      setDueDate('');
      setPriority('medium');
      setCategoryId('personal');
      setExpanded(false);
      inputRef.current?.focus();
    }
  };

  const handleTagClick = ({ categoryId, label }: { categoryId: string; label: string }) => {
    setTitle(prev => prev ? `${prev} ${label}` : label);
    setCategoryId(categoryId);
    inputRef.current?.focus();
  };

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: '#14b8a6' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
  ];

  return (
    <div className="task-form-container">
      <motion.form
        onSubmit={handleSubmit}
        className="task-form"
        layout
      >
        <div className="task-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="task-input"
            onFocus={() => setExpanded(true)}
            style={{ paddingRight: expanded ? '80px' : undefined }}
          />
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '0.25rem',
                }}
              >
                <QuickPrioritySelector priority={priority} setPriority={setPriority} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          className="add-btn"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          <span>Add</span>
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <Flag size={12} />
                    Priority
                  </label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {priorityOptions.map(opt => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => setPriority(opt.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: priority === opt.value ? opt.color : 'var(--bg-tertiary)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          color: priority === opt.value ? 'white' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <Calendar size={12} />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <DollarSign size={12} />
                  Category
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.5rem 0.75rem',
                        background: categoryId === cat.id ? cat.color + '20' : 'var(--bg-tertiary)',
                        border: `1px solid ${categoryId === cat.id ? cat.color : 'var(--glass-border)'}`,
                        borderRadius: 'var(--radius-full)',
                        color: categoryId === cat.id ? cat.color : 'var(--text-muted)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Zap size={14} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick add</span>
              </div>
              <div className="quick-add">
                {quickTags.map(tag => (
                  <motion.span
                    key={tag.categoryId}
                    className="quick-tag"
                    onClick={() => handleTagClick(tag)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag.icon} {tag.label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickPrioritySelector({ priority, setPriority }: { priority: Priority; setPriority: (p: Priority) => void }) {
  return (
    <div style={{ display: 'flex', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
      {(['low', 'medium', 'high'] as Priority[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPriority(p)}
          style={{
            width: '24px',
            height: '24px',
            border: 'none',
            background: priority === p ? getPriorityColor(p) : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={p}
        >
          <Flag size={10} color={priority === p ? 'white' : getPriorityColor(p)} />
        </button>
      ))}
    </div>
  );
}

function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#14b8a6';
  }
}
