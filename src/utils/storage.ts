const STORAGE_PREFIX = 'taskflow-';

export function loadState<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
}

export function saveState<T>(key: string, state: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}
