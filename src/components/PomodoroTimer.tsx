import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';
 
interface PomodoroTimerProps {
  time: number;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export default function PomodoroTimer({ time, isActive, onToggle, onReset }: PomodoroTimerProps) {
  const [currentTime, setCurrentTime] = useState(time);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrentTime(time);
  }, [time]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const progress = ((time - currentTime) / time) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        style={{
          position: 'fixed',
          top: '5rem',
          right: '1.5rem',
          zIndex: 100,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--blur-strength))',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          minWidth: '200px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Timer size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Focus</span>
          </div>
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={16} />
          </motion.button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={currentTime}
            style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'monospace' }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            height: '4px',
            background: 'var(--glass-border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              padding: '0.625rem',
              background: isActive ? 'var(--accent)' : 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button
            onClick={() => {
              setCurrentTime(time);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.625rem',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            title="Reset timer"
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
