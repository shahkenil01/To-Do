import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, X, Trash2, Calendar, Star, GripVertical } from 'lucide-react';
import { TodoItem, Category } from '../types';
import { isOverdue, formatDate } from '../utils/taskUtils';
 
interface TaskListProps {
  tasks: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onSetPriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
  onSetCategory: (id: string, categoryId: string) => void;
  onSetDueDate: (id: string, dueDate: string | undefined) => void;
  categories: Category[];
  setTasks?: (tasks: TodoItem[]) => void;
}

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onSetPriority,
  onSetCategory,
  onSetDueDate,
  categories,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editCategory, setEditCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const startEdit = (task: TodoItem) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority || 'medium');
    setEditCategory(task.categoryId || 'personal');
    setEditDueDate(task.dueDate || '');
  };

  const submitEdit = (id: string) => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onEdit(id, trimmed);
      onSetPriority(id, editPriority);
      onSetCategory(id, editCategory);
      if (editDueDate) {
        onSetDueDate(id, editDueDate);
      } else {
        onSetDueDate(id, undefined);
      }
    }
    setEditingId(null);
  };

  const priorityColors: Record<string, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#14b8a6',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => {
          const category = categories.find(c => c.id === task.categoryId) || categories[0];
          const overdue = isOverdue(task.dueDate);
          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`task-item card ${task.completed ? 'completed' : ''}`}
              style={{
                borderLeft: task.priority ? `3px solid ${priorityColors[task.priority]}` : '3px solid transparent',
              }}
            >
              <div
                style={{
                  cursor: 'grab',
                  color: 'var(--text-muted)',
                  padding: '0.25rem',
                  display: 'flex',
                }}
              >
                <GripVertical size={16} />
              </div>

              <motion.div
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => onToggle(task.id)}
                whileTap={{ scale: 0.9 }}
              >
                {task.completed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </motion.div>

              <div className="task-content">
                {editingId === task.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitEdit(task.id)}
                      autoFocus
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--primary)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <select
                        value={editPriority}
                        onChange={e => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                        style={{
                          padding: '0.35rem 0.5rem',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem',
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        style={{
                          padding: '0.35rem 0.5rem',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                        style={{
                          padding: '0.35rem 0.5rem',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span
                        className="task-tag"
                        style={{
                          borderColor: category.color + '40',
                          color: category.color
                        }}
                      >
                        <Star size={10} fill={category.color} color={category.color} />
                        {category.name}
                      </span>
                      {task.priority && task.priority !== 'medium' && (
                        <span
                          className="task-tag"
                          style={{
                            color: priorityColors[task.priority],
                            borderColor: priorityColors[task.priority] + '40',
                          }}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={`task-date ${overdue && !task.completed ? 'overdue' : ''}`}>
                          <Calendar size={12} />
                          {formatDate(task.dueDate)}
                          {overdue && !task.completed && ' (Overdue)'}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="task-actions" style={{ opacity: 1 }}>
                {editingId === task.id ? (
                  <>
                    <motion.button
                      onClick={() => submitEdit(task.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}
                    >
                      <Save size={14} />
                    </motion.button>
                    <motion.button
                      onClick={() => setEditingId(null)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      className="task-action-btn"
                      onClick={() => startEdit(task)}
                      whileHover={{ scale: 1.1 }}
                      title="Edit task"
                    >
                      <Edit2 size={14} />
                    </motion.button>
                    <motion.button
                      className="task-action-btn delete"
                      onClick={() => onDelete(task.id)}
                      whileHover={{ scale: 1.1 }}
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
